package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.product.ColourToImageUrlsMap;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductStockException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.tag.CreateNewTagException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Component
@Profile("dev")
public class StartUpService {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final WarehouseService warehouseService;
    private final TagService tagService;
    private final StyleService styleService;
    private final StoreService storeService;

    private static Long sneakerCategoryId;
    private static Long shirtCategoryId;
    private static Long socksCategoryId;

    public StartUpService(ProductService productService, CategoryService categoryService, WarehouseService warehouseService, TagService tagService, StyleService styleService, StoreService storeService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.warehouseService = warehouseService;
        this.tagService = tagService;
        this.styleService = styleService;
        this.storeService = storeService;
    }

    @PostConstruct
    public void init() throws InputDataValidationException, CreateNewCategoryException, CategoryNotFoundException, CreateNewProductException, ProductVariantNotFoundException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException, CreateNewTagException, CreateNewStyleException {
        createCategoryIfNotFound();
        createProductIfNotFound();
        createWarehouseAndStoreIfNotFound();
        createTagIfNotFound();
        createStyleIfNotFound();
    }

    private void createCategoryIfNotFound() throws CategoryNotFoundException, CreateNewCategoryException, InputDataValidationException {
        List<Category> categories = categoryService.retrieveAllRootCategories();
        if (categories.size() == 0) {
            Category category = categoryService.createNewCategory(new Category("Shoes"), null);
            Category leafCategory = categoryService.createNewCategory(new Category("Sneakers"), category.getCategoryId());
            sneakerCategoryId = leafCategory.getCategoryId();
            Category men = categoryService.createNewCategory(new Category("Men"), null);
            Category clothingmen = categoryService.createNewCategory(new Category("Clothing"), men.getCategoryId());
            Category shirts = categoryService.createNewCategory(new Category("Shirts"), clothingmen.getCategoryId());
            shirtCategoryId = shirts.getCategoryId();
            Category shorts = categoryService.createNewCategory(new Category("Shorts"), clothingmen.getCategoryId());
            Category socks = categoryService.createNewCategory(new Category("Socks"), clothingmen.getCategoryId());
            socksCategoryId = socks.getCategoryId();
            Category women = categoryService.createNewCategory(new Category("Women"), null);
            Category clothingwomen = categoryService.createNewCategory(new Category("Clothing"), women.getCategoryId());
            Category shorts2 = categoryService.createNewCategory(new Category("Shorts"), clothingwomen.getCategoryId());
            Category dresses = categoryService.createNewCategory(new Category("Dresses"), clothingwomen.getCategoryId());
            Category skirts = categoryService.createNewCategory(new Category("Skirts"), clothingwomen.getCategoryId());
        }
    }

    private void createProductIfNotFound() throws CategoryNotFoundException, InputDataValidationException, CreateNewProductException, ProductVariantNotFoundException {
        List<Product> products = productService.retrieveAllProducts();
        if (products.size() == 0) {

            // Product images
            List<String> blackProductImageUrls = new ArrayList<>();
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_a?qlt=92&w=750&h=531&v=1&fmt=webp");
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_b?qlt=92&w=750&h=531&v=1&fmt=webp");
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_c?qlt=92&w=750&h=531&v=1&fmt=webp");
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_d?qlt=92&w=750&h=531&v=1&fmt=webp");
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_e?qlt=92&w=750&h=531&v=1&fmt=webp");
            List<String> greenProductImageUrls = new ArrayList<>();
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_a?qlt=92&w=750&h=531&v=1&fmt=webp");
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_b?qlt=92&w=750&h=531&v=1&fmt=webp");
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_c?qlt=92&w=750&h=531&v=1&fmt=webp");
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_d?qlt=92&w=750&h=531&v=1&fmt=webp");
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_e?qlt=92&w=750&h=531&v=1&fmt=webp");
            List<String> redProductImageUrls = new ArrayList<>();
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_a?qlt=92&w=750&h=531&v=1&fmt=webp");
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_b?qlt=92&w=750&h=531&v=1&fmt=webp");
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_c?qlt=92&w=750&h=531&v=1&fmt=webp");
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_d?qlt=92&w=750&h=531&v=1&fmt=webp");
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_e?qlt=92&w=750&h=531&v=1&fmt=webp");

            List<SizeEnum> sizes = new ArrayList<>();
            sizes.add(SizeEnum.S);
            sizes.add(SizeEnum.M);
            sizes.add(SizeEnum.L);
            List<ColourToImageUrlsMap> colourToImageUrlsMaps = new ArrayList<>();
            colourToImageUrlsMaps.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls));
            colourToImageUrlsMaps.add(new ColourToImageUrlsMap("#1CD3A2", greenProductImageUrls));
            colourToImageUrlsMaps.add(new ColourToImageUrlsMap("#CB4154", redProductImageUrls));

            Category category = categoryService.retrieveCategoryByCategoryId(sneakerCategoryId); //sneakers

            Product product = new Product("0010", "Stan Smith", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            product.setCategory(category);
            Product newProduct = productService.createNewProduct(product, category.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product2 = new Product("0011", "Fila Disruptor II", "Fila", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category2 = categoryService.retrieveCategoryByCategoryId(shirtCategoryId); //shirt
            product2.setCategory(category2);
            Product newProduct2 = productService.createNewProduct(product2, category2.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product3 = new Product("0012", "Nike Air Max", "Nike", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category3 = categoryService.retrieveCategoryByCategoryId(socksCategoryId); // socks
            product3.setCategory(category);
            Product newProduct3 = productService.createNewProduct(product3, category3.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);
        }
    }

    private void createWarehouseAndStoreIfNotFound() throws InputDataValidationException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException, ProductVariantNotFoundException {
        if (warehouseService.retrieveAllWarehouses().size() == 0) {

            warehouseService.createWarehouse(new Warehouse(),
                    new Address("Pasir Ris Drive 1", "#01-01", 510144, "Pasir Ris Building"));
            List<Warehouse> warehouses = warehouseService.retrieveAllWarehouses();

            storeService.createNewStore(new Store("Store 1", 8, 4,
                    Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 2, 6, null));

            storeService.createNewStore(new Store("Store 2", 5, 2,
                    Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 1, 3, null));
            List<Store> stores = storeService.retrieveAllStores();

            productService.assignProductStock(warehouses, stores, null);
        }
    }

    private void createTagIfNotFound() throws CreateNewTagException, InputDataValidationException {
        if (tagService.retrieveAllTags().size() != 0) return;
        tagService.createNewTag(new Tag("Promotion"));
        tagService.createNewTag(new Tag("Popular"));
        tagService.createNewTag(new Tag("Sales"));
        tagService.createNewTag(new Tag("New Arrival"));
    }

    private void createStyleIfNotFound() throws CreateNewStyleException, InputDataValidationException {
        if (styleService.retrieveAllStyles().size() != 0) return;
        styleService.createNewStyle(new Style("Vintage"));
        styleService.createNewStyle(new Style("Bohemian"));
        styleService.createNewStyle(new Style("Chic"));
        styleService.createNewStyle(new Style("Artsy"));
        styleService.createNewStyle(new Style("Sophisticated"));
    }
}
