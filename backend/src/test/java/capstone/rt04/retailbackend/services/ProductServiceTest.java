package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
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

    @Before // testCreateNewProduct
    public void beforeEachTest() throws Exception {
        Product validProduct = new Product("Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
        Product invalidProduct = new Product("Adidas Alpha Bounce", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(59.90));

        Category category = categoryService.createNewCategory(new Category("Shoes"), null);
        validProduct.setCategory(category);
        invalidProduct.setCategory(category);

        Product result = productService.createNewProduct(validProduct, category.getCategoryId(), null);

        if (!initialized) {
            assertThat(result).isEqualTo(validProduct);
            assertThat(result).isNotEqualTo(invalidProduct);
        }

        categoryId = category.getCategoryId();
        productId = result.getProductId();
        initialized = true;
    }

    @After
    public void afterEachTest() throws Exception {

        Product productToRemove = productService.retrieveProductByProductId(productId);
        Product removedProduct = productService.deleteProduct(productToRemove.getProductId());
        if (!initialized) assertThat(removedProduct.getProductId()).isEqualTo(productToRemove.getProductId());

        Category categoryToRemove = categoryService.retrieveCategoryByCategoryId(categoryId);
        Long categoryId = categoryToRemove.getCategoryId();
        Category removedCategory = categoryService.deleteCategory(categoryId);
        if (!initialized) assertThat(removedCategory.getCategoryId()).isEqualTo(categoryId);
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

    @Test
    public void testDeleteProduct() throws Exception {
    }

    @Test
    public void testSetProductPrice() throws Exception {
    }

    @Test
    public void testCDProductVariant() throws Exception {

        Product product = productService.retrieveProductByProductId(productId);
        ProductVariant validProductVariant = new ProductVariant("SKU001", "White", null, product, null);

        ProductVariant productVariant = productService.createProductVariant(validProductVariant);
        assertThat(productVariant).isEqualTo(validProductVariant);

        ProductVariant deletedProductVariant = productService.deleteProductVariant(productVariant.getProductVariantId());
        assertThat(deletedProductVariant.getProductVariantId()).isEqualTo(productVariant.getProductVariantId());
    }

    @Test
    public void testCDProductStock() throws Exception {

        Product product = productService.retrieveProductByProductId(productId);

        ProductVariant validProductVariant = new ProductVariant("SKU001", "White", null, product, null);
        ProductVariant productVariant = productService.createProductVariant(validProductVariant);

        ProductStock validProductStock = new ProductStock(50, 100, 10);
        validProductStock.setProductVariant(productVariant);

        ProductStock productStock = productService.createProductStock(validProductStock, productVariant.getProductVariantId(), null, null);
        assertThat(productStock).isEqualTo(validProductStock);

        ProductStock deletedProductStock = productService.deleteProductStock(productStock.getProductStockId());
        assertThat(deletedProductStock.getProductStockId()).isEqualTo(productStock.getProductStockId());
    }

}

//    @Test
//    public void testCreateNewProduct() throws Exception {
//        Product validProduct = new Product("Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
//
//        Category category = categoryService.createNewCategory(new Category("Shoes"), null);
//        validProduct.setCategory(category);
//
//        Product result = productService.createNewProduct(validProduct, category.getCategoryId(), null);
//        assertThat(result).isEqualTo(validProduct);
//
//        // Remove from db
//        Product removedProduct = productService.deleteProduct(result.getProductId());
//        assertThat(removedProduct.getProductId()).isEqualTo(result.getProductId());
//
//        Long categoryId = category.getCategoryId();
//        Category removedCategory = categoryService.deleteCategory(categoryId);
//        assertThat(removedCategory.getCategoryId()).isEqualTo(categoryId);
//    }
