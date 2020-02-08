package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ProductServiceTest {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ProductService productService;

    private static boolean initialized = false;
    private static Long categoryId;
    private static Long productId;
    private static Long productVariantId;


    /**
     * Test for create/delete Product
     * Test for create/delete ProductVariant
     **/
    @Before
    public void beforeEachTest() throws Exception {
        Product validProduct = new Product("Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
        Product invalidProduct = new Product("Adidas Alpha Bounce", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(59.90));

        Category category = categoryService.createNewCategory(new Category("Shoes"), null);
        validProduct.setCategory(category);
        invalidProduct.setCategory(category);

        Product product = productService.createNewProduct(validProduct, category.getCategoryId(), null);

        ProductVariant validProductVariant = new ProductVariant("SKU001", "White", null, product, null);
        ProductVariant productVariant = productService.createProductVariant(validProductVariant);

        if (!initialized) {
            assertThat(product).isEqualTo(validProduct);
            assertThat(product).isNotEqualTo(invalidProduct);
            assertThat(productVariant).isEqualTo(validProductVariant);
        }

        categoryId = category.getCategoryId();
        productId = product.getProductId();
        productVariantId = productVariant.getProductVariantId();
        initialized = true;
    }

    @After
    public void afterEachTest() throws Exception {

        Product productToRemove = productService.retrieveProductById(productId);
        Product removedProduct = productService.deleteProduct(productToRemove.getProductId());
        assertThat(removedProduct.getProductId()).isEqualTo(productToRemove.getProductId());

        Category categoryToRemove = categoryService.retrieveCategoryByCategoryId(categoryId);
        Category removedCategory = categoryService.deleteCategory(categoryToRemove.getCategoryId());
        assertThat(removedCategory.getCategoryId()).isEqualTo(categoryId);

//        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
//        ProductVariant deletedProductVariant = productService.deleteProductVariant(productVariant.getProductVariantId());
//        assertThat(deletedProductVariant.getProductVariantId()).isEqualTo(productVariant.getProductVariantId());
    }

    @Test
    public void testCreateNewProduct() throws Exception {
        try {
            Product invalidProduct = new Product(null, "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
            invalidProduct.setCategory(categoryService.retrieveCategoryByCategoryId(categoryId));
            productService.createNewProduct(invalidProduct, categoryId, null);
        } catch (InputDataValidationException ex) {
            Map<String, String> expectedErrorMap = new HashMap<>();
            expectedErrorMap.put("productName", "must not be null");
            assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
        }
    }

    @Test
    public void testRetrieveAllProducts() throws Exception {
        List<Product> result = productService.retrieveAllProducts();
        assertThat(result).isNotNull();
    }

    @Test(expected = ProductVariantNotFoundException.class)
    public void testCDProductVariant() throws Exception {

        Product product = productService.retrieveProductById(productId);
        ProductVariant validProductVariant = new ProductVariant("SKU002", "Black", null, product, null);

        ProductVariant productVariant = productService.createProductVariant(validProductVariant);
        assertThat(productVariant).isEqualTo(validProductVariant);

        ProductVariant deletedProductVariant = productService.deleteProductVariant(productVariant.getProductVariantId());
        productService.retrieveProductVariantById(deletedProductVariant.getProductVariantId());
    }

    @Test(expected = ProductStockNotFoundException.class)
    public void testCDProductStock() throws Exception {

        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);

        ProductStock validProductStock = new ProductStock(50, 100, 10);
        validProductStock.setProductVariant(productVariant);

        ProductStock productStock = productService.createProductStock(validProductStock, productVariant.getProductVariantId());
        assertThat(productStock).isEqualTo(validProductStock);

        ProductStock deletedProductStock = productService.deleteProductStock(productStock.getProductStockId());
        productService.retrieveProductStockById(deletedProductStock.getProductStockId());
    }

    // TODO: test assignProductStock - need to create store and warehouse service before

    /**
     * To test for productImage, you need productVariant
     * To test for productStock, you need productVariant
     *
     **/

}
