package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.InStoreRestockOrderItemRepository;
import capstone.rt04.retailbackend.repositories.InStoreRestockOrderRepository;
import capstone.rt04.retailbackend.request.inStoreRestockOrder.StockIdQuantityMap;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.ItemDeliveryStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.delivery.DeliveryHasAlreadyBeenConfirmedException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderItemNotFoundException;
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
    private final DeliveryService deliveryService;

    public InStoreRestockOrderService(ValidationService validationService, InStoreRestockOrderRepository inStoreRestockOrderRepository, InStoreRestockOrderItemRepository inStoreRestockOrderItemRepository, ProductService productService, StoreService storeService, WarehouseService warehouseService, DeliveryService deliveryService) {
        this.validationService = validationService;
        this.inStoreRestockOrderRepository = inStoreRestockOrderRepository;
        this.inStoreRestockOrderItemRepository = inStoreRestockOrderItemRepository;
        this.productService = productService;
        this.storeService = storeService;
        this.warehouseService = warehouseService;
        this.deliveryService = deliveryService;
    }

    // TODO: Create stock order, create restock line item
    public List<InStoreRestockOrder> createInStoreRestockOrder(Long storeId, List<StockIdQuantityMap> stockIdQuantityMaps) throws StoreNotFoundException, ProductStockNotFoundException {

        ProductStock productStock;
        List<InStoreRestockOrderItem> inStoreRestockOrderItems = new ArrayList<>();

        Timestamp createdDateTime = new Timestamp(System.currentTimeMillis());
        // Creating restock order item
        for (StockIdQuantityMap stockIdQuantityMap : stockIdQuantityMaps) {
            productStock = productService.retrieveProductStockById(stockIdQuantityMap.getProductStockId());
            InStoreRestockOrderItem inStoreRestockOrderItem = new InStoreRestockOrderItem(stockIdQuantityMap.getOrderQuantity(), productStock, createdDateTime);
            inStoreRestockOrderItemRepository.save(inStoreRestockOrderItem);
            inStoreRestockOrderItems.add(inStoreRestockOrderItem);
        }

        Store store = storeService.retrieveStoreById(storeId);
        Warehouse warehouse = warehouseService.retrieveAllWarehouses().get(0);
        InStoreRestockOrder inStoreRestockOrder = new InStoreRestockOrder(inStoreRestockOrderItems, store, warehouse, createdDateTime);
        // Bi-directional relationship
        for (InStoreRestockOrderItem inStoreRestockOrderItem : inStoreRestockOrderItems) {
            inStoreRestockOrderItem.setInStoreRestockOrder(inStoreRestockOrder);
        }
        inStoreRestockOrderRepository.save(inStoreRestockOrder);

        return retrieveAllInStoreRestockOrder(store.getStoreId());
    }

    @Transactional(readOnly = true)
    public List<InStoreRestockOrder> retrieveAllInStoreRestockOrderForWarehouse() {
        List<InStoreRestockOrder> inStoreRestockOrders = inStoreRestockOrderRepository.findAll();

        // TODO: Find the stock in warehouse and return a custom object
        for (InStoreRestockOrder inStoreRestockOrder : inStoreRestockOrders) {
            for (InStoreRestockOrderItem inStoreRestockOrderItem : inStoreRestockOrder.getInStoreRestockOrderItems()) {
                for (ProductStock productStock : inStoreRestockOrderItem.getProductStock().getProductVariant().getProductStocks()) {
                    if (productStock.getWarehouse() != null) {
                        inStoreRestockOrderItem.setWarehouseStockQuantity(productStock.getQuantity());
                    }
                }
            }
        }
        return inStoreRestockOrders;
    }


    public List<InStoreRestockOrder> retrieveAllInStoreRestockOrder(Long storeId) {
        List<InStoreRestockOrder> inStoreRestockOrders = inStoreRestockOrderRepository.findAllByStore_StoreId(storeId);

        lazilyLoadInStoreRestockOrder(inStoreRestockOrders);
        return inStoreRestockOrders;
    }

    // Retrieve by ID
    public InStoreRestockOrder retrieveInStoreRestockOrderById(Long inStoreRestockOrderId) throws InStoreRestockOrderNotFoundException {
        InStoreRestockOrder inStoreRestockOrder = inStoreRestockOrderRepository.findById(inStoreRestockOrderId).orElseThrow(() -> new InStoreRestockOrderNotFoundException());
        List<InStoreRestockOrder> list = new ArrayList<>();
        list.add(inStoreRestockOrder);
        lazilyLoadInStoreRestockOrder(list);
        return inStoreRestockOrder;
    }

    public List<InStoreRestockOrder> updateRestockOrder(Long inStoreRestockOrderId, List<StockIdQuantityMap> stockIdQuantityMaps) throws InStoreRestockOrderNotFoundException, ProductVariantNotFoundException, ProductStockNotFoundException, InStoreRestockOrderUpdateException {

        InStoreRestockOrder inStoreRestockOrder = retrieveInStoreRestockOrderById(inStoreRestockOrderId);

        if (!inStoreRestockOrder.getDeliveryStatus().equals(DeliveryStatusEnum.PROCESSING)) {
            throw new InStoreRestockOrderUpdateException("Unable to update restock order that has already been processed");
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
                inStoreRestockOrderItem.setInStoreRestockOrder(null);
                // inStoreRestockOrderItem.setDelivery(null); --> try-catch persistence exception
                inStoreRestockOrderItemRepository.delete(inStoreRestockOrderItem);
            }
        }

        // Remaining in skuQuantityMaps are the new items in the list, loop through, create new restock order item and add to the existing list
        for (StockIdQuantityMap stockIdQuantityMap : loopStockIdQuantityMaps) {
            productStock = productService.retrieveProductStockById(stockIdQuantityMap.getProductStockId());
            InStoreRestockOrderItem inStoreRestockOrderItem = new InStoreRestockOrderItem(stockIdQuantityMap.getOrderQuantity(), productStock, new Timestamp(System.currentTimeMillis()));
            inStoreRestockOrderItemRepository.save(inStoreRestockOrderItem);
            inStoreRestockOrderItem.setInStoreRestockOrder(inStoreRestockOrder);
            inStoreRestockOrder.getInStoreRestockOrderItems().add(inStoreRestockOrderItem);
        }
        return retrieveAllInStoreRestockOrder(storeId);
    }

    public List<InStoreRestockOrder> fulfillRestockOrder(Long inStoreRestockOrderId) throws InStoreRestockOrderNotFoundException, InsufficientStockException {
        InStoreRestockOrder inStoreRestockOrder = retrieveInStoreRestockOrderById(inStoreRestockOrderId);
        Long storeId = inStoreRestockOrder.getStore().getStoreId();
        Warehouse warehouse = inStoreRestockOrder.getWarehouse();
        Long productVariantId;
        ProductStock productStock;
        Boolean insufficient = Boolean.FALSE, updated = Boolean.FALSE;
        ItemDeliveryStatusEnum itemDeliveryStatus;

        // Deduct all the stock from warehouse
        for (InStoreRestockOrderItem inStoreRestockOrderItem : inStoreRestockOrder.getInStoreRestockOrderItems()) {
            itemDeliveryStatus = inStoreRestockOrderItem.getItemDeliveryStatus();

            if (itemDeliveryStatus == ItemDeliveryStatusEnum.DELIVERED || itemDeliveryStatus.equals(ItemDeliveryStatusEnum.TO_BE_DELIVERED) ||
                    itemDeliveryStatus == ItemDeliveryStatusEnum.IN_TRANSIT) continue;

            productVariantId = inStoreRestockOrderItem.getProductStock().getProductVariant().getProductVariantId();
            productStock = productService.retrieveProductStockByWarehouseAndProductVariantId(warehouse.getWarehouseId(), productVariantId);
            if (productStock.getQuantity() < inStoreRestockOrderItem.getQuantity()) {
                insufficient = Boolean.TRUE;
                inStoreRestockOrderItem.setItemDeliveryStatus(ItemDeliveryStatusEnum.DELAYED);
                continue;
            }
            productStock.setQuantity(productStock.getQuantity() - inStoreRestockOrderItem.getQuantity());
            inStoreRestockOrderItem.setItemDeliveryStatus(ItemDeliveryStatusEnum.TO_BE_DELIVERED);
            updated = Boolean.TRUE;
        }
        if (!updated)
            throw new InsufficientStockException("Insufficient stock to fulfill at least 1 restock order item!");

        // in restock order has been partially fulfilled, don't update the delivery status anymore
        DeliveryStatusEnum deliveryStatus = inStoreRestockOrder.getDeliveryStatus();
        if (deliveryStatus.equals(DeliveryStatusEnum.PARTIALLY_FULFILLED)) {
        } else if (!deliveryStatus.equals(DeliveryStatusEnum.PARTIALLY_IN_TRANSIT)) {
            if (insufficient) {
                inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.PARTIALLY_TO_BE_DELIVERED);
            } else {
                inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.TO_BE_DELIVERED);
            }
        }
        return retrieveAllInStoreRestockOrder(storeId);
    }

    public void receiveRestockOrderItemThroughDelivery(List<Long> inStoreRestockOrderItemIds) throws InStoreRestockOrderItemNotFoundException, DeliveryHasAlreadyBeenConfirmedException {
        InStoreRestockOrderItem inStoreRestockOrderItem = new InStoreRestockOrderItem();
        Integer quantity;
        for (Long id : inStoreRestockOrderItemIds) {
            inStoreRestockOrderItem = retrieveInStoreRestockOrderItemById(id);
            if (!inStoreRestockOrderItem.getItemDeliveryStatus().equals(ItemDeliveryStatusEnum.DELIVERED)) {
                inStoreRestockOrderItem.setItemDeliveryStatus(ItemDeliveryStatusEnum.DELIVERED);
                quantity = inStoreRestockOrderItem.getProductStock().getQuantity() + inStoreRestockOrderItem.getQuantity();
                inStoreRestockOrderItem.getProductStock().setQuantity(quantity);
                inStoreRestockOrderItem.setDeliveryDateTime(new Timestamp(System.currentTimeMillis()));
            } else {
                throw new DeliveryHasAlreadyBeenConfirmedException("Items has already been delivered");
            }
        }
        InStoreRestockOrder inStoreRestockOrder = inStoreRestockOrderItem.getInStoreRestockOrder();

        Boolean orderCompleted = checkAllItemDelivered(inStoreRestockOrder);
        if (orderCompleted) {
            inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
            inStoreRestockOrder.setDeliveryDateTime(new Timestamp(System.currentTimeMillis()));
        } else {
            inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.PARTIALLY_FULFILLED);
        }
    }

    public List<InStoreRestockOrder> deleteInStoreRestockOrder(Long inStoreRestockOrderId) throws InStoreRestockOrderNotFoundException, InStoreRestockOrderUpdateException {
        // delivery will only be set 24 hours later
        // can delete if less than 24 hours
        InStoreRestockOrder inStoreRestockOrder = retrieveInStoreRestockOrderById(inStoreRestockOrderId);
        DeliveryStatusEnum deliveryStatus = inStoreRestockOrder.getDeliveryStatus();
        if (!deliveryStatus.equals(DeliveryStatusEnum.PROCESSING)) {
            throw new InStoreRestockOrderUpdateException("Unable to delete restock order that has been processed");
        }
        Long storeId = inStoreRestockOrder.getStore().getStoreId();
        Timestamp timestamp = new Timestamp(inStoreRestockOrder.getOrderDateTime().getTime() + TimeUnit.DAYS.toMillis(1));
        Timestamp current = new Timestamp(System.currentTimeMillis());
        // If order date + 1 > current date, cannot delete
        if (timestamp.compareTo(current) > 0) {
            inStoreRestockOrderItemRepository.deleteAll(inStoreRestockOrder.getInStoreRestockOrderItems());
        } else {
            throw new InStoreRestockOrderUpdateException("Unable to delete restock order that has been created for more than 24 hours");
        }
        inStoreRestockOrderRepository.delete(inStoreRestockOrder);
        return retrieveAllInStoreRestockOrder(storeId);
    }

    private Boolean checkAllItemDelivered(InStoreRestockOrder inStoreRestockOrder) {
        for (InStoreRestockOrderItem inStoreRestockOrderItem : inStoreRestockOrder.getInStoreRestockOrderItems()) {
            if (!inStoreRestockOrderItem.getItemDeliveryStatus().equals(ItemDeliveryStatusEnum.DELIVERED)) {
                return Boolean.FALSE;
            }
        }
        return Boolean.TRUE;
    }

    private void lazilyLoadInStoreRestockOrder(List<InStoreRestockOrder> inStoreRestockOrders) {
        for (InStoreRestockOrder order : inStoreRestockOrders) {
            order.getInStoreRestockOrderItems().size();
        }
    }

    public InStoreRestockOrderItem retrieveInStoreRestockOrderItemById(Long inStoreRestockOrderItemId) throws InStoreRestockOrderItemNotFoundException {
        return inStoreRestockOrderItemRepository.findById(inStoreRestockOrderItemId).orElseThrow(() ->
                new InStoreRestockOrderItemNotFoundException("Item " + inStoreRestockOrderItemId + "not found!"));
    }

    public List<InStoreRestockOrderItem> retrieveAllRestockOrderItemToDeliver() {
        List<InStoreRestockOrderItem> inStoreRestockOrderItems =
                inStoreRestockOrderItemRepository.findAllByItemDeliveryStatusEquals(ItemDeliveryStatusEnum.TO_BE_DELIVERED);
        return inStoreRestockOrderItems;
    }
}
