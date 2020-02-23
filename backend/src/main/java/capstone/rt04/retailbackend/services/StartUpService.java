package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.product.*;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.tag.CreateNewTagException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
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

    public StartUpService(ProductService productService, CategoryService categoryService, WarehouseService warehouseService, TagService tagService, StyleService styleService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.warehouseService = warehouseService;
        this.tagService = tagService;
        this.styleService = styleService;
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
        List<Category> categories = categoryService.retrieveAllCategories();
        if (categories.size() == 0) {
            Category category = categoryService.createNewCategory(new Category("Shoes"), null);
            Category leafCategory = categoryService.createNewCategory(new Category("Sneakers"), category.getCategoryId());
            Category men = categoryService.createNewCategory(new Category("Men"), null);
            Category clothingmen = categoryService.createNewCategory(new Category("Clothing"), men.getCategoryId());
            Category shirts = categoryService.createNewCategory(new Category("Shirts"), clothingmen.getCategoryId());
            Category shorts = categoryService.createNewCategory(new Category("Shorts"), clothingmen.getCategoryId());
            Category socks = categoryService.createNewCategory(new Category("Socks"), clothingmen.getCategoryId());
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
            Product product = new Product("0010", "Stan Smith", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category = categoryService.retrieveCategoryByName("Sneakers");
            product.setCategory(category);
            List<SizeEnum> sizes = new ArrayList<>();
            sizes.add(SizeEnum.S);
            sizes.add(SizeEnum.M);
            sizes.add(SizeEnum.L);
            List<String> colors = new ArrayList<>();
            colors.add("Black");
            colors.add("Green");
            colors.add("Red");
            Product newProduct = productService.createNewProduct(product, category.getCategoryId(), null, sizes, colors);

            Product product2 = new Product("0011", "Fila Disruptor II", "Fila", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category2 = categoryService.retrieveCategoryByName("Shirts");
            product2.setCategory(category2);
            Product newProduct2 = productService.createNewProduct(product2, category2.getCategoryId(), null, sizes, colors);

            Product product3 = new Product("0012", "Nike Air Max", "Nike", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category3 = categoryService.retrieveCategoryByName("Socks");
            product3.setCategory(category);
            Product newProduct3 = productService.createNewProduct(product3, category3.getCategoryId(), null, sizes, colors);

            // Product images
            ProductImage productImage1 = new ProductImage("https://i8.amplience.net/i/jpl/jd_347293_a?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage2 = new ProductImage("https://i8.amplience.net/i/jpl/jd_347293_b?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage3 = new ProductImage("https://i8.amplience.net/i/jpl/jd_347293_c?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage4 = new ProductImage("https://i8.amplience.net/i/jpl/jd_347293_d?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage5 = new ProductImage("https://i8.amplience.net/i/jpl/jd_347293_e?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage6 = new ProductImage("https://i8.amplience.net/i/jpl/jd_M20324_a?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage7 = new ProductImage("https://i8.amplience.net/i/jpl/jd_M20324_b?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage8 = new ProductImage("https://i8.amplience.net/i/jpl/jd_M20324_c?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage9 = new ProductImage("https://i8.amplience.net/i/jpl/jd_M20324_d?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage10 = new ProductImage("https://i8.amplience.net/i/jpl/jd_M20324_e?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage11 = new ProductImage("https://i8.amplience.net/i/jpl/jd_EE5801_a?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage12 = new ProductImage("https://i8.amplience.net/i/jpl/jd_EE5801_b?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage13 = new ProductImage("https://i8.amplience.net/i/jpl/jd_EE5801_c?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage14 = new ProductImage("https://i8.amplience.net/i/jpl/jd_EE5801_d?qlt=92&w=750&h=531&v=1&fmt=webp");
            ProductImage productImage15 = new ProductImage("https://i8.amplience.net/i/jpl/jd_EE5801_e?qlt=92&w=750&h=531&v=1&fmt=webp");

            List<ProductImage> blacks = new ArrayList<>();
            blacks.add(productImage1);
            blacks.add(productImage2);
            blacks.add(productImage3);
            blacks.add(productImage4);
            blacks.add(productImage5);

            List<ProductImage> greens = new ArrayList<>();
            greens.add(productImage6);
            greens.add(productImage7);
            greens.add(productImage8);
            greens.add(productImage9);
            greens.add(productImage10);

            List<ProductImage> reds = new ArrayList<>();
            reds.add(productImage11);
            reds.add(productImage12);
            reds.add(productImage13);
            reds.add(productImage14);
            reds.add(productImage15);

            Boolean blackCreated = false;
            Boolean greenCreated = false;
            Boolean redCreated = false;

            List<ProductImage> blackProductImages= new ArrayList<>();;
            List<ProductImage> greenProductImages = new ArrayList<>();
            List<ProductImage> redProductImages= new ArrayList<>();;

            for (ProductVariant productVariant : newProduct.getProductVariants()) {
                if (productVariant.getColour() == "Black") {
                    if (!blackCreated) {
                        blackProductImages = productService.createProductImage(blacks, productVariant.getProductVariantId());
                        blackCreated = true;
                    } else {
                        productVariant.getProductImages().addAll(blackProductImages);
                    }
                } else if (productVariant.getColour() == "Green") {
                    if (!greenCreated) {
                        greenProductImages = productService.createProductImage(greens, productVariant.getProductVariantId());
                        greenCreated = true;
                    } else {
                        productVariant.getProductImages().addAll(greenProductImages);
                    }
                } else if (productVariant.getColour() == "Red") {
                    if (!redCreated) {
                        redProductImages = productService.createProductImage(reds, productVariant.getProductVariantId());
                        redCreated = true;
                    } else {
                        productVariant.getProductImages().addAll(redProductImages);
                    }
                }
            }
        }
    }

    private void createWarehouseAndStoreIfNotFound() throws InputDataValidationException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException, ProductVariantNotFoundException {
        if (warehouseService.retrieveAllWarehouses().size() == 0) {

            Warehouse warehouse = new Warehouse();
            Address address = new Address("Pasir Ris Drive 1", "#01-01", 510144, "Pasir Ris Building");
            Warehouse w = warehouseService.createWarehouse(warehouse, address);
            List<Warehouse> warehouses = warehouseService.retrieveAllWarehouseInventory();

            productService.assignProductStock(warehouses, null, null);

            // TODO: Create store?
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
