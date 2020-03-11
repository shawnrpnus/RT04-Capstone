package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.InStoreRestockOrder;
import capstone.rt04.retailbackend.entities.InStoreRestockOrderItem;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.request.inStoreRestockOrder.RestockCreateRequest;
import capstone.rt04.retailbackend.request.inStoreRestockOrder.RestockUpdateRequest;
import capstone.rt04.retailbackend.services.InStoreRestockOrderService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.InStoreRestockOrderControllerRoutes.*;

@RestController
@RequestMapping(IN_STORE_RESTOCK_ORDER_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})

public class InStoreRestockOrderController {

    private final InStoreRestockOrderService inStoreRestockOrderService;
    private final ValidationService validationService;


    public InStoreRestockOrderController(InStoreRestockOrderService inStoreRestockOrderService, ValidationService validationService) {
        this.inStoreRestockOrderService = inStoreRestockOrderService;
        this.validationService = validationService;
    }

    @GetMapping(RETRIEVE_ALL_IN_STORE_RESTOCK_ORDER)
    public ResponseEntity<?> retrieveAllRestockOrder() {
        List<InStoreRestockOrder> inStoreRestockOrders = inStoreRestockOrderService.retrieveAllInStoreRestockOrder();
        clearRestockOrderRelationship(inStoreRestockOrders);
        return new ResponseEntity<>(inStoreRestockOrders, HttpStatus.OK);
    }

    @PostMapping(CREATE_IN_STORE_RESTOCK_ORDER)
    public ResponseEntity<?> createRestockOrder(@RequestBody RestockCreateRequest restockCreateRequest) throws StoreNotFoundException, ProductStockNotFoundException {
        List<InStoreRestockOrder> inStoreRestockOrders = inStoreRestockOrderService.createInStoreRestockOrder(restockCreateRequest.getStoreId(),
                restockCreateRequest.getStockIdQuantityMaps());
        clearRestockOrderRelationship(inStoreRestockOrders);
        return new ResponseEntity<>(inStoreRestockOrders, HttpStatus.CREATED);
    }

    @PostMapping(UPDATE_IN_STORE_RESTOCK_ORDER)
    public ResponseEntity<?> updateRestockOrder(@RequestBody RestockUpdateRequest restockUpdateRequest) throws ProductStockNotFoundException, InStoreRestockOrderNotFoundException, ProductVariantNotFoundException {
        List<InStoreRestockOrder> inStoreRestockOrders = inStoreRestockOrderService.updateRestockOrder(restockUpdateRequest.getRestockOrderId(),
                restockUpdateRequest.getStockIdQuantityMaps());
        clearRestockOrderRelationship(inStoreRestockOrders);
        return new ResponseEntity<>(inStoreRestockOrders, HttpStatus.OK);
    }


    private void clearRestockOrderRelationship(List<InStoreRestockOrder> inStoreRestockOrders) {
        for (InStoreRestockOrder inStoreRestockOrder : inStoreRestockOrders) {
            // Warehouse
            inStoreRestockOrder.getWarehouse().setProductStocks(null);
            inStoreRestockOrder.getWarehouse().setInStoreRestockOrders(null);

            // Store
            inStoreRestockOrder.getStore().setProductStocks(null);
            inStoreRestockOrder.getStore().setReservations(null);
            inStoreRestockOrder.getStore().setInStoreRestockOrders(null);
            inStoreRestockOrder.getStore().setRosters(null);
            inStoreRestockOrder.getStore().setTransactions(null);

            // TODO: Clear delivery

            // Product stock
            for (InStoreRestockOrderItem inStoreRestockOrderItem : inStoreRestockOrder.getInStoreRestockOrderItems()) {
                inStoreRestockOrderItem.getProductStock().setStore(null);
                inStoreRestockOrderItem.getProductStock().setWarehouse(null);
                // Product variant
                ProductVariant productVariant = inStoreRestockOrderItem.getProductStock().getProductVariant();
                productVariant.setProductStocks(null);
                // Product
                Product product = productVariant.getProduct();
                product.setStyles(null);
                product.setReviews(null);
                product.setCategory(null);
                product.setTags(null);
                product.setPromoCodes(null);
                product.setDiscounts(null);
                product.setProductVariants(null);
            }
        }
    }
}
