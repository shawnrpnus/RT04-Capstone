package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import static capstone.rt04.retailbackend.util.Constants.*;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ShoppingCartServiceTest extends ServiceTestSetup {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private CustomerService customerService;

    @Test
    public void addUpdateRemoveProductVariantToShoppingCart() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);

        //add
        Customer customer = shoppingCartService.updateQuantityOfProductVariant(1, productVariantId, validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        ShoppingCart shoppingCart = shoppingCartService.retrieveShoppingCart(validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        assertThat(shoppingCart.getShoppingCartItems().size()).isEqualTo(1);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(1);

        //update
        customer = shoppingCartService.updateQuantityOfProductVariant(2, productVariantId, validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        shoppingCart = shoppingCartService.retrieveShoppingCart(validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        assertThat(shoppingCart.getShoppingCartItems().size()).isEqualTo(1);
        assertThat(shoppingCart.getShoppingCartItems().get(0).getQuantity()).isEqualTo(2);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(1);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().get(0).getQuantity()).isEqualTo(2);

        //delete
        customer = shoppingCartService.updateQuantityOfProductVariant(0, productVariantId, validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        shoppingCart = shoppingCartService.retrieveShoppingCart(validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        assertThat(shoppingCart.getShoppingCartItems().size()).isEqualTo(0);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(0);

        customer = shoppingCartService.updateQuantityOfProductVariant(10, productVariantId, validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        shoppingCart = shoppingCartService.retrieveShoppingCart(validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        assertThat(shoppingCart.getShoppingCartItems().size()).isEqualTo(1);
        assertThat(shoppingCart.getShoppingCartItems().get(0).getQuantity()).isEqualTo(10);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(1);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().get(0).getQuantity()).isEqualTo(10);

        customer = shoppingCartService.clearShoppingCart(validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        shoppingCart = shoppingCartService.retrieveShoppingCart(validCustomer.getCustomerId(), ONLINE_SHOPPING_CART);
        assertThat(shoppingCart.getShoppingCartItems().size()).isEqualTo(0);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(0);
    }



}
