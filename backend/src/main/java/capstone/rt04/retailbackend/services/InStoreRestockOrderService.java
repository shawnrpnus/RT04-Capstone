package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.InStoreRestockOrderItemRepository;
import capstone.rt04.retailbackend.repositories.InStoreRestockOrderRepository;
import capstone.rt04.retailbackend.request.inStoreRestockOrder.StockIdQuantityMap;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@Slf4j
public class InStoreRestockOrderService {

    private final ValidationService validationService;
    private final InStoreRestockOrderRepository inStoreRestockOrderRepository;
    private final InStoreRestockOrderItemRepository inStoreRestockOrderItemRepository;

    private final ProductService productService;
    private final StoreService storeService;
    private final WarehouseService warehouseService;

    public InStoreRestockOrderService(ValidationService validationService, InStoreRestockOrderRepository inStoreRestockOrderRepository, InStoreRestockOrderItemRepository inStoreRestockOrderItemRepository, ProductService productService, StoreService storeService, WarehouseService warehouseService) {
        this.validationService = validationService;
        this.inStoreRestockOrderRepository = inStoreRestockOrderRepository;
        this.inStoreRestockOrderItemRepository = inStoreRestockOrderItemRepository;
        this.productService = productService;
        this.storeService = storeService;
        this.warehouseService = warehouseService;
    }

    // TODO: Create stock order, create restock line item
    public List<InStoreRestockOrder> createInStoreRestockOrder(Long storeId, List<StockIdQuantityMap> stockIdQuantityMaps) throws StoreNotFoundException, ProductStockNotFoundException {

        ProductStock productStock;
        List<InStoreRestockOrderItem> inStoreRestockOrderItems = new ArrayList<>();

        // Creating restock order item
        for (StockIdQuantityMap stockIdQuantityMap : stockIdQuantityMaps) {
            // Chan change to SKU instead?
            productStock = productService.retrieveProductStockById(stockIdQuantityMap.getProductStockId());
            InStoreRestockOrderItem inStoreRestockOrderItem = new InStoreRestockOrderItem(stockIdQuantityMap.getOrderQuantity(), productStock);
            inStoreRestockOrderItemRepository.save(inStoreRestockOrderItem);
            inStoreRestockOrderItems.add(inStoreRestockOrderItem);
        }

        Store store = storeService.retrieveStoreById(storeId);
        Warehouse warehouse = warehouseService.retrieveAllWarehouses().get(0);
        InStoreRestockOrder inStoreRestockOrder = new InStoreRestockOrder(inStoreRestockOrderItems, store, warehouse);
        inStoreRestockOrderRepository.save(inStoreRestockOrder);

        return retrieveAllInStoreRestockOrder();
    }

    public List<InStoreRestockOrder> retrieveAllInStoreRestockOrder() {
        List<InStoreRestockOrder> inStoreRestockOrders = inStoreRestockOrderRepository.findAll();
        lazilyLoadInStoreRestockOrder(inStoreRestockOrders);
        return inStoreRestockOrders;
    }

    public InStoreRestockOrder retrieveInStoreRestockOrderByInStoreRestockOrderId(Long inStoreRestockOrderId) throws InStoreRestockOrderNotFoundException {
        InStoreRestockOrder inStoreRestockOrder = inStoreRestockOrderRepository.findById(inStoreRestockOrderId).orElseThrow(() -> new InStoreRestockOrderNotFoundException());
        List<InStoreRestockOrder> list = new ArrayList<>();
        list.add(inStoreRestockOrder);
        lazilyLoadInStoreRestockOrder(list);
        return inStoreRestockOrder;
    }

    public List<InStoreRestockOrder> updateRestockOrder(Long inStoreRestockOrderId, List<StockIdQuantityMap> stockIdQuantityMaps) throws InStoreRestockOrderNotFoundException, ProductVariantNotFoundException, ProductStockNotFoundException {

        InStoreRestockOrder inStoreRestockOrder = retrieveInStoreRestockOrderByInStoreRestockOrderId(inStoreRestockOrderId);
        List<InStoreRestockOrderItem> loopInStoreRestockOrderItems = new ArrayList<>(inStoreRestockOrder.getInStoreRestockOrderItems());
        List<StockIdQuantityMap> loopStockIdQuantityMaps = new ArrayList<>(stockIdQuantityMaps);
        Boolean presentInExistingList;
        ProductStock productStock;

        for (InStoreRestockOrderItem inStoreRestockOrderItem : loopInStoreRestockOrderItems) {
            presentInExistingList = Boolean.FALSE;

            for (StockIdQuantityMap stockIdQuantityMap : loopStockIdQuantityMaps) {
                // If the existing list of productVariant contains a productVariant from the new list
                if (inStoreRestockOrderItem.getProductStock().equals(stockIdQuantityMap.getProductStockId())) {
                    presentInExistingList = Boolean.TRUE;
                    // Check the orderQuantity against the existing quantity
                    if (inStoreRestockOrderItem.getQuantity().equals(stockIdQuantityMap.getOrderQuantity())) {
                        // If the quantity is the same, skip to next item in the existing list
                        break;
                    } else {
                        // Update the existing restock order item with new quantity
                        inStoreRestockOrderItem.setQuantity(stockIdQuantityMap.getOrderQuantity());
                        // Remove the item from the new list
                        stockIdQuantityMaps.remove(stockIdQuantityMap);
                    }
                }
            }
            if (!presentInExistingList) {
                // Delete the restock order item because it is no longer in the new list
                inStoreRestockOrder.getInStoreRestockOrderItems().remove(inStoreRestockOrderItem);
                inStoreRestockOrderItem.setProductStock(null);
                inStoreRestockOrderItemRepository.delete(inStoreRestockOrderItem);
            }
        }

        // Remaining in skuQuantityMaps are the new items in the list, loop through, create new restock order item and add to the existing list
        for (StockIdQuantityMap stockIdQuantityMap : loopStockIdQuantityMaps) {
            productStock = productService.retrieveProductStockById(stockIdQuantityMap.getProductStockId());
            InStoreRestockOrderItem inStoreRestockOrderItem = new InStoreRestockOrderItem(stockIdQuantityMap.getOrderQuantity(), productStock);
            inStoreRestockOrderItemRepository.save(inStoreRestockOrderItem);
            inStoreRestockOrder.getInStoreRestockOrderItems().add(inStoreRestockOrderItem);
        }
        return retrieveAllInStoreRestockOrder();
    }

    public List<InStoreRestockOrder> fulfillRestockOrder() {
        return retrieveAllInStoreRestockOrder();
    }

    public List<InStoreRestockOrder> deleteInStoreRestockOrder() {
        // can delete if no delivery
        // can delete if less than 24 hours
        return retrieveAllInStoreRestockOrder();
    }

    private void lazilyLoadInStoreRestockOrder(List<InStoreRestockOrder> inStoreRestockOrders) {
        for (InStoreRestockOrder order : inStoreRestockOrders) {
            order.getDeliveries().size();
            order.getInStoreRestockOrderItems().size();
        }
    }
}
