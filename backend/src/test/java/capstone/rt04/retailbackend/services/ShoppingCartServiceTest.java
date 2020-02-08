package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ShoppingCartServiceTest {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;
    private static Long categoryId;
    private static Long productId;
    private static Long productVariantId;

    @Before
    public void beforeEachTest() throws Exception{
        Customer expectedValidCustomer = new Customer("Tony", "Stark", "tonystark@gmail.com", "spiderman");
        Customer testValidCustomer = customerService.createNewCustomer(expectedValidCustomer);
        assertThat(testValidCustomer.getCustomerId()).isNotNull();
        assertThat(testValidCustomer).isEqualTo(expectedValidCustomer);
        assertThat(testValidCustomer.getOnlineShoppingCart()).isNotNull();
        assertThat(testValidCustomer.getInStoreShoppingCart()).isNotNull();

        Product validProduct = new Product("Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
        Category category = categoryService.createNewCategory(new Category("Shoes"), null);
        validProduct.setCategory(category);

        Product result = productService.createNewProduct(validProduct, category.getCategoryId(), null);
        assertThat(result).isEqualTo(validProduct);
        categoryId = category.getCategoryId();
        productId = result.getProductId();

        Product product = productService.retrieveProductById(productId);
        ProductVariant validProductVariant = new ProductVariant("SKU001", "White", null, product, null);

        ProductVariant productVariant = productService.createProductVariant(validProductVariant);
        productVariantId = productVariant.getProductVariantId();
        assertThat(productVariant).isEqualTo(validProductVariant);
    }

    @After
    public void afterEachTest() throws Exception{
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        Customer removedCustomer = customerService.removeCustomer(validCustomer.getCustomerId());
        assertThat(removedCustomer.getCustomerId()).isEqualTo(validCustomer.getCustomerId());

        Product productToRemove = productService.retrieveProductById(productId);
        Product removedProduct = productService.deleteProduct(productToRemove.getProductId()); //deletes prod variant also
        assertThat(removedProduct.getProductId()).isEqualTo(productToRemove.getProductId());

        Category categoryToRemove = categoryService.retrieveCategoryByCategoryId(categoryId);
        Long categoryId = categoryToRemove.getCategoryId();
        Category removedCategory = categoryService.deleteCategory(categoryId);
        assertThat(removedCategory.getCategoryId()).isEqualTo(categoryId);

        productId = null;
        categoryId = null;
        productVariantId = null;
    }

    @Test
    public void addUpdateRemoveProductVariantToShoppingCart() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");

        //add
        ShoppingCart shoppingCart = shoppingCartService.updateQuantityOfProductVariant(1, productVariantId, validCustomer.getCustomerId(), "online");
        shoppingCart = shoppingCartService.getShoppingCart(validCustomer.getCustomerId(), "online");
        assertThat(shoppingCart.getShoppingCartItems().size()).isEqualTo(1);

        //update
        shoppingCartService.updateQuantityOfProductVariant(2, productVariantId, validCustomer.getCustomerId(), "online");
        shoppingCart = shoppingCartService.getShoppingCart(validCustomer.getCustomerId(), "online");
        assertThat(shoppingCart.getShoppingCartItems().size()).isEqualTo(1);
        assertThat(shoppingCart.getShoppingCartItems().get(0).getQuantity()).isEqualTo(2);

        //delete
        shoppingCartService.updateQuantityOfProductVariant(0, productVariantId, validCustomer.getCustomerId(), "online");
        shoppingCart = shoppingCartService.getShoppingCart(validCustomer.getCustomerId(), "online");
        assertThat(shoppingCart.getShoppingCartItems().size()).isEqualTo(0);
    }



}
