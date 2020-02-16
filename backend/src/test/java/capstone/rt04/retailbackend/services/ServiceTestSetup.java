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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ServiceTestSetup {

    protected static final String VALID_CUST_EMAIL = "tonystark@gmail.com";

    @Autowired
    protected CustomerService customerService;

    @Autowired
    protected CategoryService categoryService;

    @Autowired
    protected ProductService productService;

    @Autowired
    protected StyleService styleService;


    protected static Long categoryId;
    protected static Long productId;
    protected static Long productVariantId;
    protected static Long styleId;
    protected static Long productId2;

    @Before
    public void beforeEachTest() throws Exception {
        Customer expectedValidCustomer = new Customer("Tony", "Stark", VALID_CUST_EMAIL, "spiderman");
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
        ProductVariant validProductVariant = new ProductVariant("SKU001", "White", null, null, null);

        ProductVariant productVariant = productService.createProductVariant(validProductVariant, product.getProductId());
        productVariantId = productVariant.getProductVariantId();
        assertThat(productVariant).isEqualTo(validProductVariant);

        Style style = styleService.createNewStyle(new Style("Bold"));
        assertThat(style.getStyleId()).isNotNull();
        styleId = style.getStyleId();

        // 2nd product
        Product validProduct2 = new Product("Adidas Alpha Bounce", "Adidas", BigDecimal.valueOf(299.90), BigDecimal.valueOf(59.90));
        validProduct.setCategory(categoryService.retrieveCategoryByCategoryId(categoryId));
        Product product2 = productService.createNewProduct(validProduct2, categoryId, null);
        productId2 = product2.getProductId();

        ProductVariant validProductVariant2 = new ProductVariant("SKU002", "Pink", null, null, null);
        productService.createProductVariant(validProductVariant2, product2.getProductId());
    }

    @After
    public void afterEachTest() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        Customer removedCustomer = customerService.removeCustomer(validCustomer.getCustomerId());
        assertThat(removedCustomer.getCustomerId()).isEqualTo(validCustomer.getCustomerId());

        Product productToRemove = productService.retrieveProductById(productId);
        Product removedProduct = productService.deleteProduct(productToRemove.getProductId()); // deletes prod variant also
        assertThat(removedProduct.getProductId()).isEqualTo(productToRemove.getProductId());

        Product productToRemove2 = productService.retrieveProductById(productId2); // productId2
        Product removedProduct2 = productService.deleteProduct(productToRemove2.getProductId());
        assertThat(removedProduct2.getProductId()).isEqualTo(productToRemove2.getProductId());

        Category categoryToRemove = categoryService.retrieveCategoryByCategoryId(categoryId);
        Long categoryId = categoryToRemove.getCategoryId();
        Category removedCategory = categoryService.deleteCategory(categoryId);
        assertThat(removedCategory.getCategoryId()).isEqualTo(categoryId);

        Style styleToRemove = styleService.retrieveStyleByStyleId(styleId);
        styleService.deleteStyle(styleToRemove.getStyleId());
        List<Style> allStyles = styleService.retrieveAllStyles();
        assertThat(allStyles.size()).isZero();

        productId = null;
        categoryId = null;
        productVariantId = null;
        styleId = null;


    }

    @Test
    public void setup() {
        System.out.println("Customer Product Category Style Setup");
    }
}
