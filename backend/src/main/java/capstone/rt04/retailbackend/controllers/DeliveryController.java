package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.delivery.AutomateDeliveryRequest;
import capstone.rt04.retailbackend.request.delivery.DeliveryForRestockOrderCreateRequest;
import capstone.rt04.retailbackend.request.delivery.DeliveryForTransactionCreateRequest;
import capstone.rt04.retailbackend.request.delivery.ReceiveRestockOrderRequest;
import capstone.rt04.retailbackend.request.transaction.TransactionReceiveDeliveryRequest;
import capstone.rt04.retailbackend.response.GroupedStoreOrderItems;
import capstone.rt04.retailbackend.services.*;
import capstone.rt04.retailbackend.util.exceptions.delivery.DeliveryCreationException;
import capstone.rt04.retailbackend.util.exceptions.delivery.DeliveryHasAlreadyBeenConfirmedException;
import capstone.rt04.retailbackend.util.exceptions.delivery.DeliveryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.delivery.NoItemForDeliveryException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderItemNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.DeliveryControllerRoutes.*;

@RestController
@RequestMapping(DELIVERY_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final InStoreRestockOrderService inStoreRestockOrderService;
    private final TransactionService transactionService;
    private final ValidationService validationService;
    private final RelationshipService relationshipService;


    public DeliveryController(DeliveryService deliveryService, @Lazy InStoreRestockOrderService inStoreRestockOrderService,
                              @Lazy TransactionService transactionService, ValidationService validationService,
                              RelationshipService relationshipService) {
        this.deliveryService = deliveryService;
        this.inStoreRestockOrderService = inStoreRestockOrderService;
        this.transactionService = transactionService;
        this.validationService = validationService;
        this.relationshipService = relationshipService;
    }

    /*
    ----------- DELIVERY -----------
     */
    @GetMapping(RETRIEVE_ALL_DELIVERY)
    public ResponseEntity<?> retrieveAllDelivery() {
        List<Delivery> deliveries = deliveryService.retrieveAllDelivery();
        clearDeliveriesRelationships(deliveries);
        return new ResponseEntity<>(deliveries, HttpStatus.OK);
    }

    @PostMapping(CREATE_DELIVERY_FOR_RESTOCK_ORDER)
    public ResponseEntity<?> createDeliveryForRestockOrder(@RequestBody DeliveryForRestockOrderCreateRequest request)
            throws StaffNotFoundException, InStoreRestockOrderItemNotFoundException, DeliveryCreationException {
        for (Long staffId : request.getStaffIds()) {
            deliveryService.createDeliveryForRestockOrder(request.getInStoreRestockOrderItemIds(), staffId, request.getMaxCapacity());
        }
        return new ResponseEntity<>(ResponseEntity.ok("Delivery created!"), HttpStatus.OK);
    }

    @PostMapping(CREATE_DELIVERY_FOR_TRANSACTION)
    public ResponseEntity<?> createDeliveryForTransaction(@RequestBody DeliveryForTransactionCreateRequest request)
            throws TransactionNotFoundException, StaffNotFoundException, DeliveryCreationException {
        List<Transaction> customerToEmail = new ArrayList<>();
        for (Long staffId : request.getStaffIds()) {
            List<Transaction> transactions = deliveryService.createDeliveryForTransaction(request.getTransactionIds(), staffId,
                    request.getMaxCapacity());
            customerToEmail.addAll(transactions);
        }
        deliveryService.sendDeliveryNotificationEmail(customerToEmail, Boolean.TRUE);
        return new ResponseEntity<>(ResponseEntity.ok("Delivery created!"), HttpStatus.OK);
    }

    @PostMapping(RECEIVE_RESTOCK_ORDER_ITEM_THROUGH_DELIVERY)
    public ResponseEntity<?> receiveRestockOrderItemThroughDelivery(@RequestBody ReceiveRestockOrderRequest request)
            throws InStoreRestockOrderItemNotFoundException, DeliveryHasAlreadyBeenConfirmedException {
        inStoreRestockOrderService.receiveRestockOrderItemThroughDelivery(request.getInStoreRestockOrderItemIds());
        return new ResponseEntity<>(ResponseEntity.ok("Stock received!"), HttpStatus.OK);
    }

    @PostMapping(RECEIVE_TRANSACTION_THROUGH_DELIVERY)
    public ResponseEntity<?> receiveTransactionThroughDelivery(@RequestBody TransactionReceiveDeliveryRequest request) throws TransactionNotFoundException {
        List<Transaction> transactions = transactionService.receiveTransactionThroughDelivery(request.getTransactionIds());
//        for (Transaction transaction : transactions) {
//            relationshipService.clearTransactionRelationships(transaction);
//        }
        deliveryService.sendDeliveryNotificationEmail(transactions, Boolean.FALSE);
        return new ResponseEntity<>(ResponseEntity.ok("Delivery confirmed"), HttpStatus.OK);
    }

    @GetMapping(ESTIMATE_NUMBER_OF_DELIVERYMAN_REQUIRED)
    public ResponseEntity<?> estimateNumberOfDeliveryManRequired(@RequestParam Boolean transaction, @RequestParam Boolean restockOrderItem,
                                                                 @RequestParam Integer maxCapacity) {
        double numberOfDeliveryManRequired = deliveryService.estimateNumberOfDeliveryManRequired(transaction, restockOrderItem, maxCapacity);
        return new ResponseEntity<>(ResponseEntity.ok(numberOfDeliveryManRequired), HttpStatus.OK);
    }

    @PostMapping(AUTOMATE_DELIVERY_ALLOCATION)
    public ResponseEntity<?> automateDeliveryAllocation(@RequestBody AutomateDeliveryRequest request) throws StaffNotFoundException, DeliveryNotFoundException, NoItemForDeliveryException {
        List<Transaction> customerToEmail = new ArrayList<>();
        for (Long staffId : request.getStaffIds()) {
            List<Transaction> transactions = deliveryService.automateDeliveryAllocation(staffId, request.getMaxCapacity());
            customerToEmail.addAll(transactions);
        }
        deliveryService.sendDeliveryNotificationEmail(customerToEmail, Boolean.TRUE);
        return new ResponseEntity<>(ResponseEntity.ok("Delivery generated for selected staff(s)"), HttpStatus.OK);
    }

    @GetMapping(GENERATE_DELIVERY_ROUTE)
    public ResponseEntity<?> generateRouteForDelivery(@PathVariable Long deliveryId) throws DeliveryNotFoundException {
        List deliveryList = deliveryService.generateDeliveryRoute(deliveryId);
        clearDeliveryListRelationships(deliveryList);
        return new ResponseEntity<>(deliveryList, HttpStatus.OK);
    }

    @GetMapping(GENERATE_DELIVERY_ROUTE_FOR_TODAY)
    public ResponseEntity<?> generateDeliveryRouteToday(@RequestParam Long staffId) throws DeliveryNotFoundException {
        List deliveryList = deliveryService.generateTodaysDeliveryRouteForStaff(staffId);
        clearDeliveryListRelationships(deliveryList);
        return new ResponseEntity<>(deliveryList, HttpStatus.OK);
    }

    /*
    ----------- Restock Order Item -----------
    */
    @GetMapping(RETRIEVE_ALL_RESTOCK_ORDER_ITEM_TO_DELIVER)
    public ResponseEntity<?> retrieveAllRestockOrderItemToDeliver() {
        List<InStoreRestockOrderItem> inStoreRestockOrderItems = inStoreRestockOrderService.retrieveAllRestockOrderItemToDeliver();
        inStoreRestockOrderItems.forEach(inStoreRestockOrderItem -> clearRestockOrderItemRelationships(inStoreRestockOrderItem));
        return new ResponseEntity<>(inStoreRestockOrderItems, HttpStatus.OK);
    }

    private void clearRestockOrderItemRelationships(InStoreRestockOrderItem item) {
        ProductStock productStock;
        ProductVariant productVariant;
        InStoreRestockOrder inStoreRestockOrder;
        // Delivery
        item.setDelivery(null);
        // Restock order
        inStoreRestockOrder = item.getInStoreRestockOrder();
        inStoreRestockOrder.setWarehouse(null);
        inStoreRestockOrder.setInStoreRestockOrderItems(null);
        inStoreRestockOrder.setStore(null);

        productStock = item.getProductStock();
        // Store
        relationshipService.clearStoreRelationships(productStock.getStore());
        // Warehouse
        productStock.setWarehouse(null);
        // Product variant
        productVariant = productStock.getProductVariant();
        relationshipService.clearProductVariantRelationships(productVariant);
    }

    private void clearDeliveriesRelationships(List<Delivery> deliveries) {
        for (Delivery delivery : deliveries) {
            relationshipService.clearStaffRelationships(delivery.getDeliveryStaff());
            for (InStoreRestockOrderItem item : delivery.getInStoreRestockOrderItems()) {
                item.setDelivery(null);
                item.setInStoreRestockOrder(null);
                relationshipService.clearProductVariantRelationships(item.getProductStock().getProductVariant());
                relationshipService.clearStoreRelationships(item.getProductStock().getStore());
            }
            for (Transaction transaction : delivery.getCustomerOrdersToDeliver()) {
                relationshipService.clearTransactionRelationships(transaction);
            }
        }
    }

    private void clearDeliveryListRelationships(List deliveryList) {
        for (Object item : deliveryList) {
            if (item.getClass().equals(Transaction.class)) {
                relationshipService.clearTransactionRelationships((Transaction) item);
            } else if (item.getClass().equals(InStoreRestockOrderItem.class)) {
                clearRestockOrderItemRelationships((InStoreRestockOrderItem) item);
            } else if (item.getClass().equals(GroupedStoreOrderItems.class)) {
                for (InStoreRestockOrderItem inStoreRestockOrderItem : ((GroupedStoreOrderItems) item).getInStoreRestockOrderItems()) {
                    clearRestockOrderItemRelationships(inStoreRestockOrderItem);
                }
                for (Transaction transaction : ((GroupedStoreOrderItems) item).getTransactions()) {
                    relationshipService.clearTransactionRelationships(transaction);
                }
                relationshipService.clearStoreRelationships(((GroupedStoreOrderItems) item).getStore());
            }
        }
    }
}
