package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.delivery.DeliveryForRestockOrderCreateRequest;
import capstone.rt04.retailbackend.request.delivery.DeliveryForTransactionCreateRequest;
import capstone.rt04.retailbackend.request.delivery.ReceiveRestockOrderRequest;
import capstone.rt04.retailbackend.request.transaction.TransactionReceiveDeliveryRequest;
import capstone.rt04.retailbackend.services.*;
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
            throws StaffNotFoundException, InStoreRestockOrderItemNotFoundException {
        deliveryService.createDeliveryForRestockOrder(request.getInStoreRestockOrderItemIds(), request.getStaffId());
        return new ResponseEntity<>(ResponseEntity.ok("Delivery created!"), HttpStatus.OK);
    }

    @PostMapping(CREATE_DELIVERY_FOR_TRANSACTION)
    public ResponseEntity<?> createDeliveryForTransaction(@RequestBody DeliveryForTransactionCreateRequest request)
            throws TransactionNotFoundException, StaffNotFoundException {
        deliveryService.createDeliveryForTransaction(request.getTransactionIds(), request.getStaffId());
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
        for (Transaction transaction : transactions) {
            relationshipService.clearTransactionRelationships(transaction);
        }
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping(AUTOMATE_DELIVERY_ALLOCATION)
    public ResponseEntity<?> automateDeliveryAllocation(@PathVariable Long staffId) throws StaffNotFoundException, DeliveryNotFoundException, NoItemForDeliveryException {
        deliveryService.automateDeliveryAllocation(staffId);
        return new ResponseEntity<>(ResponseEntity.ok("Delivery generated for staff " + staffId), HttpStatus.OK);
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
            }
        }
    }
}
