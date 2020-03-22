package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.entities.ShoppingCart;
import capstone.rt04.retailbackend.entities.ShoppingCartItem;
import capstone.rt04.retailbackend.repositories.ShoppingCartItemRepository;
import capstone.rt04.retailbackend.repositories.ShoppingCartRepository;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import static capstone.rt04.retailbackend.util.Constants.IN_STORE_SHOPPING_CART;
import static capstone.rt04.retailbackend.util.Constants.ONLINE_SHOPPING_CART;

@Service
@Transactional
public class ShoppingCartService {

    private final ProductService productService;
    private final CustomerService customerService;

    private final ShoppingCartRepository shoppingCartRepository;
    private final ShoppingCartItemRepository shoppingCartItemRepository;


    public ShoppingCartService(@Lazy ProductService productService, @Lazy CustomerService customerService, ShoppingCartRepository shoppingCartRepository, ShoppingCartItemRepository shoppingCartItemRepository) {
        this.productService = productService;
        this.customerService = customerService;
        this.shoppingCartRepository = shoppingCartRepository;
        this.shoppingCartItemRepository = shoppingCartItemRepository;
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

    private ShoppingCartItem createShoppingCartItem(Integer quantity, Long productVariantId) throws ProductVariantNotFoundException {
        System.out.println("Creating cart item");
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        ShoppingCartItem shoppingCartItem = new ShoppingCartItem(quantity, productVariant);
        System.out.println(shoppingCartItem);
        return shoppingCartItemRepository.save(shoppingCartItem);
    }

    // use for adding, editing, deleting item from shopping cart
    public Customer updateQuantityOfProductVariant(Integer quantity, Long productVariantId, Long customerId, String cartType) throws CustomerNotFoundException, ProductVariantNotFoundException, InvalidCartTypeException {
        ShoppingCart shoppingCart = retrieveShoppingCart(customerId, cartType);

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

    public Customer clearShoppingCart(Long customerId, String cartType) throws CustomerNotFoundException, InvalidCartTypeException {
        ShoppingCart shoppingCart = retrieveShoppingCart(customerId, cartType);
        List<ShoppingCartItem> shoppingCartItems = shoppingCart.getShoppingCartItems();
        shoppingCart.setShoppingCartItems(new ArrayList<>());
        shoppingCart.calculateAndSetInitialTotal(productService);
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
            shoppingCartItem.setProductVariant(null);
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

    // For init checking
    public List<ShoppingCartItem> initRetrieveAllShoppingCartItem() {
        return (List<ShoppingCartItem>) shoppingCartItemRepository.findAll();
    }


}
