package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.product.*;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
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

    public StartUpService(ProductService productService, CategoryService categoryService, WarehouseService warehouseService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.warehouseService = warehouseService;
    }

    @PostConstruct
    public void init() throws InputDataValidationException, CreateNewCategoryException, CategoryNotFoundException, CreateNewProductException, ProductVariantNotFoundException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException {
        createCategoryIfNotFound();
        createProductIfNotFound();
        createWarehouseAndStoreIfNotFound();
    }

    private void createCategoryIfNotFound() throws CategoryNotFoundException, CreateNewCategoryException, InputDataValidationException {
        List<Category> categories = categoryService.retrieveAllCategories();
        if (categories.size() == 0) {
            Category category = categoryService.createNewCategory(new Category("Shoes"), null);
            Category leafCategory = categoryService.createNewCategory(new Category("Sneakers"), category.getCategoryId());
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

    private void createWarehouseAndStoreIfNotFound() throws InputDataValidationException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException {
        if (warehouseService.retrieveAllWarehouses().size() == 0) {

            Warehouse warehouse = new Warehouse();
            Address address = new Address("Pasir Ris Drive 1", "#01-01", "S123456", "Pasir Ris Building");
            warehouseService.createWarehouse(warehouse, address);
            List<Warehouse> warehouses = warehouseService.retrieveAllWarehouseInventory();

            productService.assignProductStock(warehouses, null, null);

            // TODO: Create store?
        }
    }
}
