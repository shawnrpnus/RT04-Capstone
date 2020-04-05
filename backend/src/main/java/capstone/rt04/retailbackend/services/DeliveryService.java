package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.DeliveryRepository;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.ItemDeliveryStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.delivery.DeliveryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.delivery.NoItemForDeliveryException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderItemNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    private final StaffService staffService;
    private final WarehouseService warehouseService;
    private final TransactionService transactionService;
    private final InStoreRestockOrderService inStoreRestockOrderService;

    public DeliveryService(DeliveryRepository deliveryRepository, StaffService staffService,
                           WarehouseService warehouseService, @Lazy TransactionService transactionService, @Lazy InStoreRestockOrderService inStoreRestockOrderService) {
        this.deliveryRepository = deliveryRepository;
        this.warehouseService = warehouseService;
        this.transactionService = transactionService;
        this.inStoreRestockOrderService = inStoreRestockOrderService;
        this.staffService = staffService;
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
        transactions.forEach(item -> item.getDeliveries().add(delivery));
        deliveryRepository.save(delivery);
    }

    public void automateDeliveryAllocation(Long staffId) throws StaffNotFoundException, DeliveryNotFoundException, NoItemForDeliveryException {
        Staff staff = staffService.retrieveStaffByStaffId(staffId);
        // Includes warehouse-customer, warehouse-store (self collection), store-customer
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
            if (inStoreRestockOrderItems.size() > 0 && inStoreRestockOrderIndex < inStoreRestockOrderItemSize
                    && inStoreRestockOrderItems.get(inStoreRestockOrderIndex).getQuantity() + quantity <= maxCapacity) {
                delivery.getInStoreRestockOrderItems().add(inStoreRestockOrderItems.get(inStoreRestockOrderIndex));
                inStoreRestockOrderItems.get(inStoreRestockOrderIndex).setDelivery(delivery);

                inStoreRestockOrderItems.get(inStoreRestockOrderIndex).setItemDeliveryStatus(ItemDeliveryStatusEnum.IN_TRANSIT);
                affectedItems.add(inStoreRestockOrderItems.get(inStoreRestockOrderIndex));
                quantity += inStoreRestockOrderItems.get(inStoreRestockOrderIndex).getQuantity();
            }

            if (transactions.size() > 0 && transactionIndex < transactionSize
                    && transactions.get(transactionIndex).getTotalQuantity() + quantity <= maxCapacity) {
                delivery.getCustomerOrdersToDeliver().add(transactions.get(transactionIndex));
                transactions.get(transactionIndex).getDeliveries().add(delivery);

                transactions.get(transactionIndex).setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
                quantity += transactions.get(transactionIndex).getTotalQuantity();
            }

            inStoreRestockOrderIndex += 1;
            transactionIndex += 1;

            if (inStoreRestockOrderIndex >= inStoreRestockOrderItemSize && transactionIndex >= transactionSize)
                break;
        }
        updateRestockOrderStatus(affectedItems);
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
                addresses.add(transaction.getStoreToCollect().getAddress());
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

        List<Transaction> transactions = new ArrayList<>(delivery.getCustomerOrdersToDeliver());
        List<InStoreRestockOrderItem> inStoreRestockOrderItems = new ArrayList<>(delivery.getInStoreRestockOrderItems());

        for (Long id : route) {
            for (Transaction transaction : delivery.getCustomerOrdersToDeliver()) {
                if (transaction.getStoreToCollect() != null &&
                        id.equals(transaction.getStoreToCollect().getAddress().getAddressId())
                        ||
                        transaction.getDeliveryAddress() != null &&
                                id.equals(transaction.getDeliveryAddress().getAddressId())) {
                    deliveryList.add(transactions.remove(transactions.indexOf(transaction)));
                }
            }

            for (InStoreRestockOrderItem inStoreRestockOrderItem : delivery.getInStoreRestockOrderItems()) {
                if (id.equals(inStoreRestockOrderItem.getInStoreRestockOrder().getStore().getAddress().getAddressId())) {
                    deliveryList.add(inStoreRestockOrderItems.remove(inStoreRestockOrderItems.indexOf(inStoreRestockOrderItem)));
                }
            }
        }

        return deliveryList;
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
