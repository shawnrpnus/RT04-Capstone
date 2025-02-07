package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.ShoppingCartItemRepository;
import capstone.rt04.retailbackend.repositories.ShoppingCartRepository;
import capstone.rt04.retailbackend.repositories.WarehouseRepository;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InsufficientStockException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static capstone.rt04.retailbackend.util.Constants.IN_STORE_SHOPPING_CART;
import static capstone.rt04.retailbackend.util.Constants.ONLINE_SHOPPING_CART;

@Service
@Transactional
@Slf4j
public class ShoppingCartService {

    private final ProductService productService;
    private final CustomerService customerService;
    private final StoreService storeService;

    private final ShoppingCartRepository shoppingCartRepository;
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final WarehouseRepository warehouseRepository;


    public ShoppingCartService(@Lazy ProductService productService, @Lazy CustomerService customerService, StoreService storeService, ShoppingCartRepository shoppingCartRepository, ShoppingCartItemRepository shoppingCartItemRepository, WarehouseRepository warehouseRepository) {
        this.productService = productService;
        this.customerService = customerService;
        this.storeService = storeService;
        this.shoppingCartRepository = shoppingCartRepository;
        this.shoppingCartItemRepository = shoppingCartItemRepository;
        this.warehouseRepository = warehouseRepository;
    }


    public void initializeShoppingCarts(Long customerId) throws CustomerNotFoundException {
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);

        // In-store
        ShoppingCart inStoreShoppingCart = new ShoppingCart();
        inStoreShoppingCart = shoppingCartRepository.save(inStoreShoppingCart);
        customer.setInStoreShoppingCart(inStoreShoppingCart);

        // Online
        ShoppingCart onlineShoppingCart = new ShoppingCart();
        onlineShoppingCart = shoppingCartRepository.save(onlineShoppingCart);
        customer.setOnlineShoppingCart(onlineShoppingCart);
    }

    public ShoppingCartItem createShoppingCartItem(Integer quantity, Long productVariantId) throws ProductVariantNotFoundException {
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        ShoppingCartItem shoppingCartItem = new ShoppingCartItem(quantity, productVariant);
        return shoppingCartItemRepository.save(shoppingCartItem);
    }

    // use for adding, editing, deleting item from shopping cart
    public Customer updateQuantityOfProductVariant(Integer quantity, Long productVariantId, Long customerId, String cartType) throws CustomerNotFoundException, ProductVariantNotFoundException, InvalidCartTypeException, InsufficientStockException {
        ShoppingCart shoppingCart = retrieveShoppingCart(customerId, cartType);
        Warehouse warehouse = warehouseRepository.findAll().get(0);

        ProductStock productStock = productService.retrieveProductStockByWarehouseIdAndProductVariantId(
                warehouse.getWarehouseId(), productVariantId);
        if (productStock.getQuantity() < quantity && cartType.equals(ONLINE_SHOPPING_CART)) throw new InsufficientStockException("Insufficient stock");

        for (ShoppingCartItem shoppingCartItem : shoppingCart.getShoppingCartItems()) {
            Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
            if (shoppingCartItem.getProductVariant().getProductVariantId().equals(productVariantId)) {
                if (quantity > 0) { //set to whatever input quantity
                    shoppingCartItem.setQuantity(quantity);
                    shoppingCart.setLastUpdated(new Timestamp(System.currentTimeMillis()));
                } else if (quantity == 0) { // delete
                    shoppingCartItem.setProductVariant(null);
                    shoppingCart.getShoppingCartItems().remove(shoppingCartItem);
                    shoppingCartItemRepository.delete(shoppingCartItem);
                    shoppingCart.setLastUpdated(new Timestamp(System.currentTimeMillis()));
                }
                shoppingCart.calculateAndSetInitialTotal(productService);
                return customerService.lazyLoadCustomerFields(customer);
            }
        }
        // does not exist in cart, so add  (first time adding)
        ShoppingCartItem shoppingCartItem = createShoppingCartItem(quantity, productVariantId);
        shoppingCart.getShoppingCartItems().add(shoppingCartItem);
        shoppingCart.setLastUpdated(new Timestamp(System.currentTimeMillis()));
        shoppingCart.calculateAndSetInitialTotal(productService);
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        return customerService.lazyLoadCustomerFields(customer);
    }

    public Customer updateQuantityOfProductVariantWithStore(Integer quantity, Long productVariantId, Long customerId, Long storeId) throws CustomerNotFoundException, InvalidCartTypeException, ProductVariantNotFoundException, StoreNotFoundException, InsufficientStockException {
        ShoppingCart currentCart = retrieveShoppingCart(customerId, IN_STORE_SHOPPING_CART);
        Store currentCartStore = currentCart.getStore();
        if (currentCartStore != null && !currentCartStore.getStoreId().equals(storeId)) {
            //shopping at different store, so reset the cart
            clearShoppingCart(customerId, IN_STORE_SHOPPING_CART);
        }
        ProductStock productStock = productService.retrieveProductStockByStoreIdAndProductVariantId(storeId, productVariantId);
        if (productStock.getQuantity() < quantity) throw new InsufficientStockException("Insufficient stock");
        Customer updatedCustomer = updateQuantityOfProductVariant(quantity, productVariantId, customerId, IN_STORE_SHOPPING_CART);
        updatedCustomer.getInStoreShoppingCart().setStore(storeService.retrieveStoreById(storeId));
        return updatedCustomer;
    }

    public Customer clearShoppingCart(Long customerId, String cartType) throws CustomerNotFoundException, InvalidCartTypeException {
        ShoppingCart shoppingCart = retrieveShoppingCart(customerId, cartType);
        List<ShoppingCartItem> shoppingCartItems = shoppingCart.getShoppingCartItems();
        shoppingCart.setShoppingCartItems(new ArrayList<>());
        shoppingCart.calculateAndSetInitialTotal(productService);
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
//        List<ShoppingCartItem> scis = shoppingCartItemRepository.findAll();
//        log.info("[Clear cart] : " + scis.size());
        for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
            //shoppingCartItem.setProductVariant(null);
            shoppingCartItemRepository.delete(shoppingCartItem);
        }
        return customerService.lazyLoadCustomerFields(customer);
    }

    public ShoppingCart retrieveShoppingCart(Long customerId, String cartType) throws CustomerNotFoundException, InvalidCartTypeException {
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        if (cartType.equals(ONLINE_SHOPPING_CART)) {
            customer.getOnlineShoppingCart().getShoppingCartItems().size();
            return customer.getOnlineShoppingCart();
        } else if (cartType.equals(IN_STORE_SHOPPING_CART)) {
            customer.getInStoreShoppingCart().getShoppingCartItems().size();
            return customer.getInStoreShoppingCart();
        } else {
            throw new InvalidCartTypeException("Cart type is invalid! Must be either instore or online");
        }
    }

    public Map<Long, Map<String, Object>> getShoppingCartItemsStock(Long customerId, String cartType, Boolean inStoreDeliverHome) throws CustomerNotFoundException, InvalidCartTypeException {
        ShoppingCart shoppingCart = retrieveShoppingCart(customerId, cartType);
        Map<Long, Map<String, Object>> result = new HashMap<>();
        Warehouse warehouse = warehouseRepository.findAll().get(0);
        for (ShoppingCartItem shoppingCartItem : shoppingCart.getShoppingCartItems()) {
            ProductVariant pv = shoppingCartItem.getProductVariant();
            Map<String, Object> stockAndName = new HashMap<>();
            ProductStock productStock;
            if (cartType.equals(ONLINE_SHOPPING_CART) || (inStoreDeliverHome != null && inStoreDeliverHome)) {
                productStock = productService.
                        retrieveProductStockByWarehouseAndProductVariantId(warehouse.getWarehouseId(), pv.getProductVariantId());
                stockAndName.put("quantity", productStock.getQuantity());
                stockAndName.put("location", "warehouse");
            } else if (cartType.equals(IN_STORE_SHOPPING_CART)) {
                productStock = productService
                        .retrieveProductStockByStoreIdAndProductVariantId(shoppingCart.getStore().getStoreId(), pv.getProductVariantId());
                stockAndName.put("quantity", productStock.getQuantity());
                stockAndName.put("location", shoppingCart.getStore().getStoreName());
            }
            result.put(shoppingCartItem.getShoppingCartItemId(), stockAndName);
        }
        return result;
    }

    // For init checking
    public List<ShoppingCartItem> initRetrieveAllShoppingCartItem() {
        return (List<ShoppingCartItem>) shoppingCartItemRepository.findAll();
    }


}
