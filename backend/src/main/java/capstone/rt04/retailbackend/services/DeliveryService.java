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
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;

@Service
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    private final StaffService staffService;
    private final TransactionService transactionService;
    private final InStoreRestockOrderService inStoreRestockOrderService;

    public DeliveryService(DeliveryRepository deliveryRepository, StaffService staffService,
                           @Lazy TransactionService transactionService, @Lazy InStoreRestockOrderService inStoreRestockOrderService) {
        this.deliveryRepository = deliveryRepository;
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

        for(Long id : transactionIds) {
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

            if (inStoreRestockOrderIndex >= inStoreRestockOrderItemSize  && transactionIndex >= transactionSize )
                break;
        }
        updateRestockOrderStatus(affectedItems);
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


}
