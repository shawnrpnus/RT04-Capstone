package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.delivery.DeliveryForRestockOrderCreateRequest;
import capstone.rt04.retailbackend.request.delivery.ReceiveRestockOrderRequest;
import capstone.rt04.retailbackend.services.DeliveryService;
import capstone.rt04.retailbackend.services.InStoreRestockOrderService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.delivery.DeliveryHasAlreadyBeenConfirmedException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderItemNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.DeliveryControllerRoutes.*;

@RestController
@RequestMapping(DELIVERY_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})

public class DeliveryController {

    private final DeliveryService deliveryService;
    private final InStoreRestockOrderService inStoreRestockOrderService;
    private final ValidationService validationService;

    private final InStoreRestockOrderController inStoreRestockOrderController;

    public DeliveryController(DeliveryService deliveryService, @Lazy InStoreRestockOrderService inStoreRestockOrderService, ValidationService validationService,
                              @Lazy InStoreRestockOrderController inStoreRestockOrderController) {
        this.deliveryService = deliveryService;
        this.inStoreRestockOrderService = inStoreRestockOrderService;
        this.validationService = validationService;
        this.inStoreRestockOrderController = inStoreRestockOrderController;
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


    @PostMapping(RECEIVE_RESTOCK_ORDER_ITEM_THROUGH_DELIVERY)
    public ResponseEntity<?> receiveRestockOrderItemThroughDelivery(@RequestBody ReceiveRestockOrderRequest request)
            throws InStoreRestockOrderItemNotFoundException, DeliveryHasAlreadyBeenConfirmedException {
        inStoreRestockOrderService.receiveRestockOrderItemThroughDelivery(request.getInStoreRestockOrderItemIds());
        return new ResponseEntity<>(ResponseEntity.ok("Stock received!"), HttpStatus.OK);
    }

    /*
    ----------- Restock Order Item -----------
    */
    @GetMapping(RETRIEVE_ALL_RESTOCK_ORDER_ITEM_TO_DELIVER)
    public ResponseEntity<?> retrieveAllRestockOrderItemToDeliver() {
        List<InStoreRestockOrderItem> inStoreRestockOrderItems = inStoreRestockOrderService.retrieveAllRestockOrderItemToDeliver();
        clearRestockOrderItemRelationships(inStoreRestockOrderItems);
        return new ResponseEntity<>(inStoreRestockOrderItems, HttpStatus.OK);
    }

    private void clearRestockOrderItemRelationships(List<InStoreRestockOrderItem> items) {
        ProductStock productStock;
        ProductVariant productVariant;
        InStoreRestockOrder inStoreRestockOrder;
        for(InStoreRestockOrderItem item : items) {
            // Delivery
            item.setDelivery(null);
            // Restock order
            inStoreRestockOrder = item.getInStoreRestockOrder();
            inStoreRestockOrder.setWarehouse(null);
            inStoreRestockOrder.setInStoreRestockOrderItems(null);
            inStoreRestockOrder.setStore(null);

            productStock = item.getProductStock();
            // Store
            inStoreRestockOrderController.clearStore(productStock.getStore());
            // Warehouse
            productStock.setWarehouse(null);
            // Product variant
            productVariant = productStock.getProductVariant();
            inStoreRestockOrderController.clearProductVariant(productVariant);
        }

    }

    private void clearDeliveriesRelationships(List<Delivery> deliveries) {
        for(Delivery delivery : deliveries) {
            clearStaff(delivery.getDeliveryStaff());
            for(InStoreRestockOrderItem item : delivery.getInStoreRestockOrderItems()) {
                item.setDelivery(null);
                item.setInStoreRestockOrder(null);
                inStoreRestockOrderController.clearProductVariant(item.getProductStock().getProductVariant());
                inStoreRestockOrderController.clearStore(item.getProductStock().getStore());
            };
        }
    }

    public void clearStaff(Staff staff) {
        staff.setPayrolls(null);
        staff.setDeliveries(null);
        staff.setAdvertisements(null);
        staff.setLeaves(null);
        staff.setAddress(null);
        staff.setRepliedReviews(null);
        staff.setStore(null);
        staff.setRole(null);
        staff.setDepartment(null);
    }
}
