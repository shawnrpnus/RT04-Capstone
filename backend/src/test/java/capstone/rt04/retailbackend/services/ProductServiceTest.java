package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Product;
import org.junit.Before;
import org.junit.BeforeClass;
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
public class ProductServiceTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;

    private static boolean initialized = false;

    @Before
    public void setUpClass() throws Exception {
        if (!initialized) {
            Product validProduct = new Product("Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));

            Category category = categoryService.createNewCategory(new Category("Shoes"), null);
            validProduct.setCategory(category);
            initialized = true;
        }
    }

    @Test
    public void testCreateNewProduct() throws Exception {
        Product validProduct = new Product("Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));

        Category category = categoryService.createNewCategory(new Category("Shoes"), null);
        validProduct.setCategory(category);

        Product result = productService.createNewProduct(validProduct, category.getCategoryId(), null);
        assertThat(result).isEqualTo(validProduct);

        // Remove from db
        Product removedProduct = productService.deleteProduct(result.getProductId());
        assertThat(removedProduct.getProductId()).isEqualTo(result.getProductId());

        Long categoryId = category.getCategoryId();
        Category removedCategory = categoryService.deleteCategory(categoryId);
        assertThat(removedCategory.getCategoryId()).isEqualTo(categoryId);

    }

    @Test
    public void testRetrieveAllProducts() throws Exception {
        List<Product> result = productService.retrieveAllProducts();
        assertThat(result).isNotNull();
    }

    @Test
    public void testRetrieveProductByProductId() throws Exception {
    }

    @Test
    public void testDeleteProduct() throws Exception {
    }

    @Test
    public void testSetProductPrice() throws Exception {
    }

    @Test
    public void testCreateProductVariant() throws Exception {
    }

    @Test
    public void testViewProductVariant() throws Exception {
    }

    @Test
    public void testViewProductVariants() throws Exception {
    }

}
