package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.InStoreRestockOrderItemRepository;
import capstone.rt04.retailbackend.repositories.InStoreRestockOrderRepository;
import capstone.rt04.retailbackend.request.inStoreRestockOrder.StockIdQuantityMap;
import capstone.rt04.retailbackend.response.InStoreRestockOrderForWarehouse;
import capstone.rt04.retailbackend.response.InStoreRestockOrderItemsForWarehouse;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderUpdateException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InsufficientStockException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

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
            productStock = productService.retrieveProductStockById(stockIdQuantityMap.getProductStockId());
            InStoreRestockOrderItem inStoreRestockOrderItem = new InStoreRestockOrderItem(stockIdQuantityMap.getOrderQuantity(), productStock);
            inStoreRestockOrderItemRepository.save(inStoreRestockOrderItem);
            inStoreRestockOrderItems.add(inStoreRestockOrderItem);
        }

        Store store = storeService.retrieveStoreById(storeId);
        Warehouse warehouse = warehouseService.retrieveAllWarehouses().get(0);
        InStoreRestockOrder inStoreRestockOrder = new InStoreRestockOrder(inStoreRestockOrderItems, store, warehouse);
        inStoreRestockOrderRepository.save(inStoreRestockOrder);

        return retrieveAllInStoreRestockOrder(store.getStoreId());
    }

    @Transactional(readOnly = true)
    public List<InStoreRestockOrderForWarehouse> retrieveAllInStoreRestockOrderForWarehouse() {
        List<InStoreRestockOrder> inStoreRestockOrders = inStoreRestockOrderRepository.findAll();
        List<InStoreRestockOrderForWarehouse> inStoreRestockOrdersForWarehouse = new ArrayList<>();
        InStoreRestockOrder order;
        InStoreRestockOrderItem item;
        InStoreRestockOrderForWarehouse inStoreRestockOrderForWarehouse;
        InStoreRestockOrderItemsForWarehouse inStoreRestockOrderItemsForWarehouse = new InStoreRestockOrderItemsForWarehouse();

        // TODO: Find the stock in warehouse and return a custom object
        for (InStoreRestockOrder inStoreRestockOrder : inStoreRestockOrders) {
            order = inStoreRestockOrder;
            inStoreRestockOrderForWarehouse = new InStoreRestockOrderForWarehouse(order.getInStoreRestockOrderId(), order.getOrderDateTime(), order.getDeliveryDateTime(),
                    order.getDeliveryStatus(), new ArrayList<>(), order.getStore(), order.getWarehouse());
            for (InStoreRestockOrderItem inStoreRestockOrderItem : inStoreRestockOrder.getInStoreRestockOrderItems()) {
                item = inStoreRestockOrderItem;
                for (ProductStock productStock : inStoreRestockOrderItem.getProductStock().getProductVariant().getProductStocks()) {
                    if (productStock.getWarehouse() != null) {
                        inStoreRestockOrderItemsForWarehouse = new InStoreRestockOrderItemsForWarehouse(item.getInStoreRestockOrderItemId(),
                                item.getQuantity(), item.getProductStock(), productStock.getQuantity(), item.getDeliveryDateTime(),
                                item.getDeliveryStatus(), item.getDelivery());
                    }
                }
                inStoreRestockOrderForWarehouse.getInStoreRestockOrderItemsForWarehouse().add(inStoreRestockOrderItemsForWarehouse);
            }
            inStoreRestockOrdersForWarehouse.add(inStoreRestockOrderForWarehouse);
        }
        return inStoreRestockOrdersForWarehouse;
    }

    public List<InStoreRestockOrder> retrieveAllInStoreRestockOrder(Long storeId) {
        List<InStoreRestockOrder> inStoreRestockOrders = inStoreRestockOrderRepository.findAllByStore_StoreId(storeId);

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

    public List<InStoreRestockOrder> updateRestockOrder(Long inStoreRestockOrderId, List<StockIdQuantityMap> stockIdQuantityMaps) throws InStoreRestockOrderNotFoundException, ProductVariantNotFoundException, ProductStockNotFoundException, InStoreRestockOrderUpdateException {

        InStoreRestockOrder inStoreRestockOrder = retrieveInStoreRestockOrderByInStoreRestockOrderId(inStoreRestockOrderId);
        if (inStoreRestockOrder.getDeliveryStatus().equals(DeliveryStatusEnum.IN_TRANSIT)) {
            throw new InStoreRestockOrderUpdateException("Unable to update restock order that is already in transit");
        }
        List<InStoreRestockOrderItem> loopInStoreRestockOrderItems = new ArrayList<>(inStoreRestockOrder.getInStoreRestockOrderItems());
        List<StockIdQuantityMap> loopStockIdQuantityMaps = new ArrayList<>(stockIdQuantityMaps);
        Boolean presentInExistingList;
        ProductStock productStock;
        Long storeId = inStoreRestockOrder.getStore().getStoreId();

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
        System.out.println(storeId);
        return retrieveAllInStoreRestockOrder(storeId);
    }

    public List<InStoreRestockOrder> fulfillRestockOrder(Long inStoreRestockOrderId) throws InStoreRestockOrderNotFoundException, InsufficientStockException {
        InStoreRestockOrder inStoreRestockOrder = retrieveInStoreRestockOrderByInStoreRestockOrderId(inStoreRestockOrderId);
        Long storeId = inStoreRestockOrder.getStore().getStoreId();
        Warehouse warehouse = inStoreRestockOrder.getWarehouse();
        Long productVariantId;
        ProductStock productStock;
        Boolean insufficient = Boolean.FALSE;

        // Deduct all the stock from warehouse
        for (InStoreRestockOrderItem inStoreRestockOrderItem : inStoreRestockOrder.getInStoreRestockOrderItems()) {

            if (inStoreRestockOrderItem.getDeliveryStatus() == DeliveryStatusEnum.DELIVERED ||
                    inStoreRestockOrderItem.getDeliveryStatus() == DeliveryStatusEnum.IN_TRANSIT) continue;

            productVariantId = inStoreRestockOrderItem.getProductStock().getProductVariant().getProductVariantId();
            productStock = productService.retrieveProductStockByWarehouseAndProductVariantId(warehouse.getWarehouseId(), productVariantId);
            if (productStock.getQuantity() < inStoreRestockOrderItem.getQuantity()) {
                insufficient = Boolean.TRUE;
                inStoreRestockOrderItem.setDeliveryStatus(DeliveryStatusEnum.DELAYED);
                continue;
            }
            productStock.setQuantity(productStock.getQuantity() - inStoreRestockOrderItem.getQuantity());
            inStoreRestockOrderItem.setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
        }

        if (insufficient) {
            inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.PARTIALLY_IN_TRANSIT);
        } else {
            inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
        }
        return retrieveAllInStoreRestockOrder(storeId);
    }

    public List<InStoreRestockOrder> receiveStock(Long inStoreRestockOrderId) throws InStoreRestockOrderNotFoundException {
        // TODO: Change to retrieve by delivery instead
        InStoreRestockOrder inStoreRestockOrder = retrieveInStoreRestockOrderByInStoreRestockOrderId(inStoreRestockOrderId);
        Integer quantity;
        ProductStock productStock;
        Long storeId = inStoreRestockOrder.getStore().getStoreId();
        // Update the quantity of product stock with the restock order line of the specified store
        for (InStoreRestockOrderItem inStoreRestockOrderItem : inStoreRestockOrder.getInStoreRestockOrderItems()) {
            productStock = inStoreRestockOrderItem.getProductStock();
            quantity = inStoreRestockOrderItem.getQuantity() + productStock.getQuantity();
            productStock.setQuantity(quantity);
        }
        // Set delivery to DELIVERED + time delivered
        inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
        inStoreRestockOrder.setDeliveryDateTime(new Timestamp(System.currentTimeMillis()));
        return retrieveAllInStoreRestockOrder(storeId);
    }

    public List<InStoreRestockOrder> deleteInStoreRestockOrder(Long inStoreRestockOrderId) throws InStoreRestockOrderNotFoundException, InStoreRestockOrderUpdateException {
        // delivery will only be set 24 hours later
        // can delete if less than 24 hours
        InStoreRestockOrder inStoreRestockOrder = retrieveInStoreRestockOrderByInStoreRestockOrderId(inStoreRestockOrderId);
        if (inStoreRestockOrder.getDeliveryStatus().equals(DeliveryStatusEnum.IN_TRANSIT)) {
            throw new InStoreRestockOrderUpdateException("Unable to update restock order that is already in transit");
        }
        Long storeId = inStoreRestockOrder.getStore().getStoreId();
        Timestamp timestamp = new Timestamp(inStoreRestockOrder.getOrderDateTime().getTime() + TimeUnit.HOURS.toMillis(1));
        Timestamp current = new Timestamp(System.currentTimeMillis());
        // If order date + 1 > current date, cannot delete
        if (timestamp.compareTo(current) < 0) {
            inStoreRestockOrderItemRepository.deleteAll(inStoreRestockOrder.getInStoreRestockOrderItems());
        }
        inStoreRestockOrderRepository.delete(inStoreRestockOrder);
        return retrieveAllInStoreRestockOrder(storeId);
    }

    private void lazilyLoadInStoreRestockOrder(List<InStoreRestockOrder> inStoreRestockOrders) {
        for (InStoreRestockOrder order : inStoreRestockOrders) {
            order.getInStoreRestockOrderItems().size();
        }
    }
}
