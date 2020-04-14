package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.DeliveryRepository;
import capstone.rt04.retailbackend.request.delivery.DeliveryNotificationNodeRequest;
import capstone.rt04.retailbackend.response.GroupedStoreOrderItems;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.ItemDeliveryStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.delivery.DeliveryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.delivery.NoItemForDeliveryException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderItemNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class DeliveryService {

    private RestTemplate restTemplate;
    @Value("${node.backend.url}")
    private String NODE_API_URL;
    private final String deliveryNotificationPath = "deliveryNotification";

    private final DeliveryRepository deliveryRepository;
    private final StaffService staffService;
    private final WarehouseService warehouseService;
    private final TransactionService transactionService;
    private final InStoreRestockOrderService inStoreRestockOrderService;
    private final RelationshipService relationshipService;

    public DeliveryService(DeliveryRepository deliveryRepository, StaffService staffService,
                           WarehouseService warehouseService, @Lazy TransactionService transactionService,
                           @Lazy InStoreRestockOrderService inStoreRestockOrderService,
                           @Lazy RelationshipService relationshipService) {
        this.deliveryRepository = deliveryRepository;
        this.warehouseService = warehouseService;
        this.transactionService = transactionService;
        this.inStoreRestockOrderService = inStoreRestockOrderService;
        this.staffService = staffService;
        this.relationshipService = relationshipService;
    }

    public Delivery retrieveDeliveryById(Long deliveryId) throws DeliveryNotFoundException {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new DeliveryNotFoundException("Delivery " + deliveryId + "not found!"));
        return delivery;
    }

    public List<Delivery> retrieveAllDelivery() {
        List<Delivery> deliveries = deliveryRepository.findAll();
        Collections.sort(deliveries, Comparator.comparing(Delivery::getDeliveryId).reversed());
        return deliveries;
    }

    /**
     * 1. Warehouse-Store (Online purchase, self collection)
     * 2. Warehouse-Customer (Online purchase, delivery to home)
     * 3. Store-Customer (In-store purchase, delivery to home)
     * 4. Warehouse-Store (Restock order) - createDeliveryForRestockOrder
     */

    // deliverRestockOrderItem
    public void createDeliveryForRestockOrder(List<Long> inStoreRestockOrderItemIds, Long staffId) throws InStoreRestockOrderItemNotFoundException, StaffNotFoundException {
        List<InStoreRestockOrderItem> inStoreRestockOrderItems = new ArrayList<>();
        InStoreRestockOrderItem inStoreRestockOrderItem;

        for (Long id : inStoreRestockOrderItemIds) {
            inStoreRestockOrderItem = inStoreRestockOrderService.retrieveInStoreRestockOrderItemById(id);
            inStoreRestockOrderItem.setItemDeliveryStatus(ItemDeliveryStatusEnum.IN_TRANSIT);
            inStoreRestockOrderItems.add(inStoreRestockOrderItem);
        }
        updateRestockOrderStatus(inStoreRestockOrderItems);

        Staff staff = staffService.retrieveStaffByStaffId(staffId);
        Delivery delivery = new Delivery(new Timestamp(System.currentTimeMillis()), staff);
        delivery.getInStoreRestockOrderItems().addAll(inStoreRestockOrderItems);
        inStoreRestockOrderItems.forEach(item -> item.setDelivery(delivery));
        deliveryRepository.save(delivery);
    }

    // For delivering products from online shopping
    public void createDeliveryForTransaction(List<Long> transactionIds, Long staffId) throws TransactionNotFoundException, StaffNotFoundException {
        Transaction transaction;
        List<Transaction> transactions = new ArrayList<>();

        for (Long id : transactionIds) {
            transaction = transactionService.retrieveTransactionById(id);
            transaction.setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
            transactions.add(transaction);
        }

        Staff staff = staffService.retrieveStaffByStaffId(staffId);
        Delivery delivery = new Delivery(new Timestamp(System.currentTimeMillis()), staff);
        delivery.getCustomerOrdersToDeliver().addAll(transactions);
        transactions.forEach(item -> {
            item.getDeliveries().add(delivery);
            // TODO: Uncomment
            // sendDeliveryNotificationEmail(item);
        });
        deliveryRepository.save(delivery);
    }

    public double estimateNumberOfDeliveryManRequired() {
        List<Transaction> transactions = transactionService.retrieveTransactionsToBeDelivered();
        List<InStoreRestockOrderItem> inStoreRestockOrderItems = inStoreRestockOrderService.retrieveAllRestockOrderItemToDeliver();
        Integer quantity = inStoreRestockOrderItems.size();

        for (Transaction transaction : transactions) {
            quantity += transaction.getTotalQuantity();
        }
        return Math.ceil(quantity / 100.00);
    }

    public List<Transaction> automateDeliveryAllocation(Long staffId) throws StaffNotFoundException, DeliveryNotFoundException, NoItemForDeliveryException {
        Staff staff = staffService.retrieveStaffByStaffId(staffId);
        // Includes warehouse-customer, warehouse-store (self collection), store-customer
        List<Transaction> emails = new ArrayList<>();

        List<Transaction> transactions = transactionService.retrieveTransactionsToBeDelivered();
        Collections.sort(transactions, Comparator.comparing(Transaction::getCreatedDateTime));

        List<InStoreRestockOrderItem> inStoreRestockOrderItems = inStoreRestockOrderService.retrieveAllRestockOrderItemToDeliver();
        Collections.sort(inStoreRestockOrderItems, Comparator.comparing(InStoreRestockOrderItem::getOrderDateTime));

        Integer transactionSize = transactions.size();
        Integer inStoreRestockOrderItemSize = inStoreRestockOrderItems.size();

        if (transactionSize == 0 && inStoreRestockOrderItemSize == 0)
            throw new NoItemForDeliveryException("No item available for delivery");

        Delivery newDelivery = new Delivery(new Timestamp(System.currentTimeMillis()), staff);
        deliveryRepository.save(newDelivery);
        Delivery delivery = retrieveDeliveryById(newDelivery.getDeliveryId());

        Integer quantity = 0;
        Integer maxCapacity = delivery.getMaxCapacity();
        Integer transactionIndex = 0;
        Integer inStoreRestockOrderIndex = 0;
        List<InStoreRestockOrderItem> affectedItems = new ArrayList<>();

        while (quantity < maxCapacity) {
            // Give priority to restock order items
            if (inStoreRestockOrderItems.size() > 0 && inStoreRestockOrderIndex < inStoreRestockOrderItemSize
                    && inStoreRestockOrderItems.get(inStoreRestockOrderIndex).getQuantity() + quantity <= maxCapacity) {
                delivery.getInStoreRestockOrderItems().add(inStoreRestockOrderItems.get(inStoreRestockOrderIndex));
                inStoreRestockOrderItems.get(inStoreRestockOrderIndex).setDelivery(delivery);

                inStoreRestockOrderItems.get(inStoreRestockOrderIndex).setItemDeliveryStatus(ItemDeliveryStatusEnum.IN_TRANSIT);
                affectedItems.add(inStoreRestockOrderItems.get(inStoreRestockOrderIndex));
                quantity += inStoreRestockOrderItems.get(inStoreRestockOrderIndex).getQuantity();
            }

            if (transactions.size() > 0 && transactionIndex < transactionSize
                    && transactions.get(transactionIndex).getTotalQuantity() + quantity <= maxCapacity
                    && !(transactions.get(transactionIndex).getStore() != null && transactions.get(transactionIndex).getCollectionMode() == CollectionModeEnum.IN_STORE)) {
                delivery.getCustomerOrdersToDeliver().add(transactions.get(transactionIndex));
                transactions.get(transactionIndex).getDeliveries().add(delivery);

                transactions.get(transactionIndex).setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
                quantity += transactions.get(transactionIndex).getTotalQuantity();
                emails.add(transactions.get(transactionIndex));
            }

            inStoreRestockOrderIndex += 1;
            transactionIndex += 1;

            if (inStoreRestockOrderIndex >= inStoreRestockOrderItemSize && transactionIndex >= transactionSize)
                break;
        }
        updateRestockOrderStatus(affectedItems);
        return emails;
    }

    @Transactional(readOnly = true)
    public void sendDeliveryNotificationEmail(List<Transaction> transactions) {
        restTemplate = new RestTemplate();
        List<DeliveryNotificationNodeRequest> requests = new ArrayList<>();
        DeliveryNotificationNodeRequest request;
        Customer customer;

        for (Transaction transaction : transactions) {
            request = new DeliveryNotificationNodeRequest();
            customer = transaction.getCustomer();
            request.setEmail(customer.getEmail());
            request.setFullName(customer.getFirstName() + " " + customer.getLastName());
            request.setOrderNumber(transaction.getOrderNumber());
            requests.add(request);
        }

        String endpoint = NODE_API_URL + "/email/" + deliveryNotificationPath;
        ResponseEntity<?> response = restTemplate.postForEntity(endpoint, requests, Object.class);
        if (response.getStatusCode().equals(HttpStatus.OK)) {
            System.out.println("Email sent successfully");
        } else {
            System.err.println("Error sending emails");
        }
    }

    @Transactional(readOnly = true)
    public List generateDeliveryRoute(Long deliveryId) throws DeliveryNotFoundException {

        Delivery delivery = retrieveDeliveryById(deliveryId);
        List<Address> addresses = new ArrayList<>();
        List deliveryList = new ArrayList();
        Address addr;

        delivery.getCustomerOrdersToDeliver().forEach(transaction -> {
            System.out.println(transaction.getTransactionId());
            if (transaction.getDeliveryAddress() != null) {
                addresses.add(transaction.getDeliveryAddress());
            } else if (transaction.getStoreToCollect() != null) {
                if (!addresses.contains(transaction.getStoreToCollect().getAddress())) {
                    addresses.add(transaction.getStoreToCollect().getAddress());
                }
            }
        });

        for (InStoreRestockOrderItem inStoreRestockOrderItem : delivery.getInStoreRestockOrderItems()) {
            System.out.println(inStoreRestockOrderItem.getInStoreRestockOrderItemId());
            addr = inStoreRestockOrderItem.getInStoreRestockOrder().getStore().getAddress();
            if (!addresses.contains(addr)) addresses.add(addr);
        }

        List<Long> route = new ArrayList<>();
        List<Pair<Address, Double>> distances = new ArrayList<>();
        Double lat, lng;

        Warehouse warehouse = warehouseService.retrieveAllWarehouses().get(0);

        lat = Double.valueOf(warehouse.getAddress().getLat());
        lng = Double.valueOf(warehouse.getAddress().getLng());

        while (addresses.size() > 0) {
            distances.clear();

            for (Address address : addresses) {
                distances.add(new ImmutablePair(address, distance(lat, lng,
                        Double.valueOf(address.getLat()), Double.valueOf(address.getLng()), 0, 0)));
            }

            Collections.sort(distances, (Comparator.comparing(Pair::getValue)));

            lat = Double.valueOf(distances.get(0).getKey().getLat());
            lng = Double.valueOf(distances.get(0).getKey().getLng());
            route.add(distances.get(0).getKey().getAddressId());
            addresses.remove(distances.get(0).getKey());
        }


        for (Long id : route) {
            GroupedStoreOrderItems groupedStoreOrderItems = new GroupedStoreOrderItems();
            groupedStoreOrderItems.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);

            for (Transaction transaction : delivery.getCustomerOrdersToDeliver()) {
                if (transaction.getStoreToCollect() != null &&
                        id.equals(transaction.getStoreToCollect().getAddress().getAddressId())) {
                    if (groupedStoreOrderItems.getStore() == null) {
                        groupedStoreOrderItems.setStore(transaction.getStoreToCollect());
                    }
                    groupedStoreOrderItems.getTransactions().add(transaction);
                    if (!(transaction.getDeliveryStatus().equals(DeliveryStatusEnum.DELIVERED)
                            || transaction.getDeliveryStatus().equals(DeliveryStatusEnum.READY_FOR_COLLECTION)
                            || transaction.getDeliveryStatus().equals(DeliveryStatusEnum.COLLECTED))) {
                        groupedStoreOrderItems.setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
                    }
                } else if (transaction.getDeliveryAddress() != null &&
                        id.equals(transaction.getDeliveryAddress().getAddressId())) {
                    deliveryList.add(transaction);
                }
            }

            /*
            for each restock order item, check if store address is same as current one in the route, and group
            together by store
             */
            for (InStoreRestockOrderItem inStoreRestockOrderItem : delivery.getInStoreRestockOrderItems()) {
                if (id.equals(inStoreRestockOrderItem.getInStoreRestockOrder().getStore().getAddress().getAddressId())) {
                    if (groupedStoreOrderItems.getStore() == null) {
                        groupedStoreOrderItems.setStore(inStoreRestockOrderItem.getInStoreRestockOrder().getStore());
                    }
                    groupedStoreOrderItems.getInStoreRestockOrderItems().add(inStoreRestockOrderItem);
                    if (!inStoreRestockOrderItem.getItemDeliveryStatus().equals(ItemDeliveryStatusEnum.DELIVERED)) {
                        groupedStoreOrderItems.setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
                    }
                }
            }

            if (groupedStoreOrderItems.getStore() != null
                    && (groupedStoreOrderItems.getInStoreRestockOrderItems().size() > 0
                    || groupedStoreOrderItems.getTransactions().size() > 0)) {
                deliveryList.add(groupedStoreOrderItems);
            }
        }

        return deliveryList;
    }

    public Delivery getTodaysDeliveryForStaff(Long staffId) {
        List<Delivery> staffDeliveries = deliveryRepository.findAllByDeliveryStaff_StaffId(staffId);
        Timestamp now = new Timestamp(System.currentTimeMillis());
        LocalDate todayDate = now.toInstant().atZone(ZoneId.of("Singapore")).toLocalDate();
        for (Delivery delivery : staffDeliveries) {
            Timestamp deliveryTimestamp = delivery.getDeliveryDateTime();
            LocalDate deliveryDate = deliveryTimestamp.toInstant().atZone(ZoneId.of("Singapore")).toLocalDate();
            if (todayDate.isEqual(deliveryDate)) {
                return delivery;
            }
        }
        return null;
    }

    public List generateTodaysDeliveryRouteForStaff(Long staffId) throws DeliveryNotFoundException {
        Delivery delivery = getTodaysDeliveryForStaff(staffId);
        if (delivery == null) {
            return new ArrayList();
        } else {
            return generateDeliveryRoute(delivery.getDeliveryId());
        }
    }

    private void updateRestockOrderStatus(List<InStoreRestockOrderItem> affectedItems) {
        InStoreRestockOrder inStoreRestockOrder;
        DeliveryStatusEnum deliveryStatusEnum;

        for (InStoreRestockOrderItem item : affectedItems) {

            inStoreRestockOrder = item.getInStoreRestockOrder();
            deliveryStatusEnum = inStoreRestockOrder.getDeliveryStatus();
            if (inStoreRestockOrder.getDeliveryStatus().equals(DeliveryStatusEnum.PARTIALLY_FULFILLED)) {
            } else if (deliveryStatusEnum.equals(DeliveryStatusEnum.PARTIALLY_TO_BE_DELIVERED))
                inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.PARTIALLY_IN_TRANSIT);
            else if (deliveryStatusEnum.equals(DeliveryStatusEnum.TO_BE_DELIVERED))
                inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
        }
    }

    /**
     * Calculate distance between two points in latitude and longitude taking
     * into account height difference. If you are not interested in height
     * difference pass 0.0. Uses Haversine method as its base.
     * <p>
     * lat1, lon1 Start point lat2, lon2 End point el1 Start altitude in meters
     * el2 End altitude in meters
     *
     * @returns Distance in Meters
     */
    private double distance(double lat1, double lon1, double lat2,
                            double lon2, double el1, double el2) {

        final int R = 6371; // Radius of the earth

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c * 1000; // convert to meters

        double height = el1 - el2;

        distance = Math.pow(distance, 2) + Math.pow(height, 2);

        return Math.sqrt(distance);
    }
}
