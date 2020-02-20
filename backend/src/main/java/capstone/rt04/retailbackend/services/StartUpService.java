package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
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
    public void init() throws InputDataValidationException, CreateNewCategoryException, CategoryNotFoundException, CreateNewProductException, ProductNotFoundException, ProductVariantNotFoundException, CreateNewProductStockException, CreateNewProductVariantException, WarehouseNotFoundException, StoreNotFoundException {
        createCategoryIfNotFound();
        createProductIfNotFound();
        createProductVariantAndProductStockIfNotFound();
    }

    private void createCategoryIfNotFound() throws CategoryNotFoundException, CreateNewCategoryException, InputDataValidationException {
        List<Category> categories = categoryService.retrieveAllCategories();
        if (categories.size() == 0) {
            Category category = categoryService.createNewCategory(new Category("Shoes"), null);
            Category leafCategory = categoryService.createNewCategory(new Category("Sneakers"), category.getCategoryId());
        }
    }

    private void createProductIfNotFound() throws CategoryNotFoundException, InputDataValidationException, CreateNewProductException {
        List<Product> products = productService.retrieveAllProducts();
        if (products.size() == 0) {
            Product product =  new Product("Stan Smith", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category = categoryService.retrieveCategoryByName("Sneakers");
            product.setCategory(category);
            productService.createNewProduct(product, category.getCategoryId(), null);
        }
    }

    private void createProductVariantAndProductStockIfNotFound() throws ProductNotFoundException, CreateNewProductVariantException, InputDataValidationException, ProductVariantNotFoundException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException {
        List<ProductVariant> productVariants = productService.retrieveAllProductVariant();
        if(productVariants.size() == 0) {

            ProductImage productImage1 = new ProductImage("https://www.adidas.com.sg/stan-smith-shoes/M20327.html");
            ProductImage productImage2 = new ProductImage("https://www.adidas.com.sg/stan-smith-shoes/M20325.html");

            List<ProductImage> productImages1 = new ArrayList<>();
            productImages1.add(productImage1);

            List<ProductImage> productImages2 = new ArrayList<>();
            productImages2.add(productImage2);

            ProductVariant productVariant1 = new ProductVariant("SKU0001", "Black", null, null, null);
            ProductVariant productVariant2 = new ProductVariant("SKU0002", "White", null, null, null);
            ProductVariant pv1 = productService.createProductVariant(productVariant1, 3l);
            ProductVariant pv2 = productService.createProductVariant(productVariant2,3l);
            productService.createProductImage(productImages1, pv1.getProductVariantId());
            productService.createProductImage(productImages2, pv2.getProductVariantId());


            Warehouse warehouse = new Warehouse();
            Address address = new Address("Pasir Ris Drive 1", "#01-01", 510144, "Pasir Ris Building");
            Warehouse w = warehouseService.createWarehouse(warehouse, address);
            List<Warehouse> warehouses = warehouseService.retrieveAllWarehouseInventory();

            productService.assignProductStock(warehouses, null, null);

        }

    }
}
