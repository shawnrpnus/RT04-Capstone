package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.product.ColourToImageUrlsMap;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import lombok.extern.slf4j.Slf4j;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
@Slf4j
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
    @Autowired
    protected StoreService storeService;
    @Autowired
    protected WarehouseService warehouseService;

    protected static Long categoryFilaId;
    protected static Long categoryMenId;
    protected static Long categoryNikeId;
    protected static Long categoryShoesId;
    protected static Long productId1;
    protected static Long styleId;
    protected static Long productVariantId;
    protected static Long productId2;
    protected static Long createdCustomerId;
    protected static Long storeId1;
    protected static Long storeId2;

    protected  List<SizeEnum> sizes = new ArrayList<>();
    protected List<ColourToImageUrlsMap> colourToImageUrlsMaps = new ArrayList<>();
    protected List<ColourToImageUrlsMap> colourToImageUrlsMaps2 = new ArrayList<>();
    protected List<ProductVariant> productVariants = new ArrayList<>();

    @Before
    public void beforeEachTest() throws Exception {
        Customer expectedValidCustomer = new Customer("Tony", "Stark", VALID_CUST_EMAIL, "spiderman");
        Customer testValidCustomer = customerService.createNewCustomer(expectedValidCustomer);
        assertThat(testValidCustomer.getCustomerId()).isNotNull();
        assertThat(testValidCustomer).isEqualTo(expectedValidCustomer);
        assertThat(testValidCustomer.getOnlineShoppingCart()).isNotNull();
        assertThat(testValidCustomer.getInStoreShoppingCart()).isNotNull();
        createdCustomerId = testValidCustomer.getCustomerId();

        Product validProduct = new Product("0001","Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
        Category men = categoryService.createNewCategory(new Category("Men"), null);
        Category shoes = categoryService.createNewCategory(new Category("Shoes"), men.getCategoryId());
        Category nike = categoryService.createNewCategory(new Category("Nike"), shoes.getCategoryId());
        Category fila = categoryService.createNewCategory(new Category("Fila"), shoes.getCategoryId());
        validProduct.setCategory(fila);

        // Adding
        // colors and sizes
        sizes.add(SizeEnum.S);
        sizes.add(SizeEnum.M);
        colourToImageUrlsMaps.add(new ColourToImageUrlsMap("White", new ArrayList<>()));
        colourToImageUrlsMaps.add(new ColourToImageUrlsMap("Gold", new ArrayList<>()));
        colourToImageUrlsMaps2.add(new ColourToImageUrlsMap("Ginger", new ArrayList<>()));
        colourToImageUrlsMaps2.add(new ColourToImageUrlsMap("Magenta", new ArrayList<>()));

        Product product1 = productService.createNewProduct(validProduct, fila.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);
        assertThat(product1).isEqualTo(validProduct);
        categoryFilaId = fila.getCategoryId();
        categoryMenId = men.getCategoryId();
        categoryNikeId = nike.getCategoryId();
        categoryShoesId = shoes.getCategoryId();
        productId1 = product1.getProductId();

        /* Adding colour for product1 */
        productVariants = productService.createMultipleProductVariants(productId1, colourToImageUrlsMaps2, sizes);
        assertThat(productVariants.size()).isNotEqualTo(0);

        productVariantId = productVariants.get(0).getProductVariantId();

        Style style = styleService.createNewStyle(new Style("Bold"));
        assertThat(style.getStyleId()).isNotNull();
        styleId = style.getStyleId();

        // 2nd product
        Product validProduct2 = new Product("0002","Adidas Alpha Bounce", "Adidas", BigDecimal.valueOf(299.90), BigDecimal.valueOf(59.90));
        validProduct.setCategory(categoryService.retrieveCategoryByCategoryId(categoryFilaId));

        Product product2 = productService.createNewProduct(validProduct2, categoryFilaId, null, null, sizes, colourToImageUrlsMaps);
        productId2 = product2.getProductId();
        /* Adding colour for product2 */
        List<ProductVariant> productVariants2 = productService.createMultipleProductVariants(productId2, colourToImageUrlsMaps2, sizes);

        // Create store
        Store expectedValidStore = new Store("Store 1", 8, 4, Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 2, 6, null);
        Store store1 = storeService.createNewStore(expectedValidStore);
        storeId1 = store1.getStoreId();
//
        Store store2 = storeService.createNewStore(new Store("Store 2", 8, 4, Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 2, 6, null));
        storeId2 = store2.getStoreId();

        Warehouse warehouse = warehouseService.createWarehouse(new Warehouse(null), new Address("Pasir Ris Drive 1", "#01-01", 510144, "Pasir Ris Building"));

        assertThat(store1.getStoreId()).isNotNull();
        assertThat(store1).isEqualTo(expectedValidStore);
    }

    @After
    public void afterEachTest() throws Exception {
        System.out.println("******** Starting tear down ************");

        Customer removedCustomer = customerService.removeCustomer(createdCustomerId);
        assertThat(removedCustomer.getCustomerId()).isEqualTo(createdCustomerId);

        Product productToRemove = productService.retrieveProductById(productId1);
        Product removedProduct = productService.deleteProduct(productToRemove.getProductId()); // deletes prod variant also
        assertThat(removedProduct.getProductId()).isEqualTo(productToRemove.getProductId());

        Product productToRemove2 = productService.retrieveProductById(productId2); // productId2
        Product removedProduct2 = productService.deleteProduct(productToRemove2.getProductId());
        assertThat(removedProduct2.getProductId()).isEqualTo(productToRemove2.getProductId());

        Category categoryToRemove = categoryService.retrieveCategoryByCategoryId(categoryFilaId);
        Long categoryId = categoryToRemove.getCategoryId();
        Category removedCategory = categoryService.deleteCategory(categoryId);
        assertThat(removedCategory.getCategoryId()).isEqualTo(categoryId);

        Category removedNikeCategory = categoryService.deleteCategory(categoryNikeId);
        assertThat(removedNikeCategory.getCategoryId()).isEqualTo(categoryNikeId);

        Category removedShoesCategory = categoryService.deleteCategory(categoryShoesId);
        assertThat(removedShoesCategory.getCategoryId()).isEqualTo(categoryShoesId);

        Category removedMenCategory = categoryService.deleteCategory(categoryMenId);
        assertThat(removedMenCategory.getCategoryId()).isEqualTo(categoryMenId);

        Style styleToRemove = styleService.retrieveStyleByStyleId(styleId);
        styleService.deleteStyle(styleToRemove.getStyleId());
        List<Style> allStyles = styleService.retrieveAllStyles();
        assertThat(allStyles.size()).isZero();

        productId1 = null;
        categoryFilaId = null;
        styleId = null;
        createdCustomerId = null;

        // Remove store
        Store storeToRemove = storeService.retrieveStoreById(storeId1);
        Store removedStore = storeService.deleteStore(storeToRemove.getStoreId());
        assertThat(removedStore.getStoreId()).isEqualTo(storeToRemove.getStoreId());
        storeId1 = null;
    }

    @Test
    public void setup() {
        System.out.println("Service Setup");
    }
}
