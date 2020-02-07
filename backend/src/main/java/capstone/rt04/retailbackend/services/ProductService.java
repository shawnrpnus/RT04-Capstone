package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.ProductRepository;
import capstone.rt04.retailbackend.repositories.ProductStockRepository;
import capstone.rt04.retailbackend.repositories.ProductVariantRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ProductService {

    private final TagService tagService;
    private final CategoryService categoryService;
    private final ProductRepository productRepository;
    private final ValidationService validationService;
    private final ProductStockRepository productStockRepository;
    private final ProductVariantRepository productVariantRepository;

    public ProductService(ValidationService validationService, TagService tagService, CategoryService categoryService, ProductRepository productRepository, ProductVariantRepository productVariantRepository, ProductStockRepository productStockRepository) {
        this.validationService = validationService;
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productStockRepository = productStockRepository;
    }

    public Product createNewProduct(Product product, Long categoryId, List<Long> tagIds) throws InputDataValidationException, CreateNewProductException {

        Map<String, String> errorMap = validationService.generateErrorMap(product);
        System.out.println(errorMap);

        if (errorMap == null) {
            try {
                if (categoryId == null) {
                    throw new CreateNewProductException("The new product must be associated a leaf category");
                }

                Category category = categoryService.retrieveCategoryByCategoryId(categoryId);

                if (!category.getChildCategories().isEmpty()) {
                    throw new CreateNewProductException("Selected category for the new product is not a leaf category");
                }

                product.setCategory(category);
                productRepository.save(product);

                category.getProducts().add(product);

                if (tagIds != null && (!tagIds.isEmpty())) {
                    for (Long tagId : tagIds) {
                        Tag tag = tagService.retrieveTagByTagId(tagId);
                        product.addTag(tag);
                    }
                }

                return product;

            } catch (PersistenceException ex) {
                if (ex.getCause() != null
                        && ex.getCause().getCause() != null
                        && ex.getCause().getCause().getClass().getSimpleName().equals("SQLIntegrityConstraintViolationException")) {
                    throw new CreateNewProductException("Product with same SKU code already exist");
                } else {
                    throw new CreateNewProductException("An unexpected error has occurred: " + ex.getMessage());
                }
            } catch (Exception ex) {
                throw new CreateNewProductException("An unexpected error has occurred: " + ex.getMessage());
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid data");
        }
    }

    public List<Product> retrieveAllProducts() {

        List<Product> productEntities = productRepository.findAll();

        for (Product product : productEntities) {
            product.getProductName();
            product.getCategory();
            product.getTags().size();
            product.getReviews().size();
            product.getDiscounts().size();
        }
        return productEntities;
    }

    public Product retrieveProductByProductId(Long productId) throws ProductNotFoundException {
        if (productId == null) {
            throw new ProductNotFoundException("Product ID not provided");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product ID " + productId + " does not exist!"));

        product.getCategory();
        product.getTags().size();
        return product;
    }


    public Product deleteProduct(Long productId) throws ProductNotFoundException//, DeleteProductException
    {
        Product productToRemove = retrieveProductByProductId(productId);

//        List<TransactionLineItem> saleTransactionLineItemEntities = saleTransactionEntityControllerLocal.retrieveSaleTransactionLineItemsByProductId(productId);
//        List<Review> reviewEntities = reviewEntityControllerLocal.retrieveReviewsForProduct(productId);
//        if (saleTransactionLineItemEntities.isEmpty() && reviewEntities.isEmpty()) {
        productToRemove.getCategory().getProducts().remove(productToRemove);

        for (Tag tag : productToRemove.getTags()) {
            tag.getProducts().remove(productToRemove);
        }

        // TODO: Clear product variant
        productToRemove.getTags().clear();

        productRepository.delete(productToRemove);

        return productToRemove;
//        } else {
//            throw new DeleteProductException("Product ID " + productId + " is associated with existing sale transaction line item(s) and cannot be deleted!");
//        }
    }

    public void setProductPrice(Long productId, BigDecimal price) throws ProductNotFoundException {
        Product product = retrieveProductByProductId(productId);
        product.setPrice(price);
    }

    public ProductVariant createProductVariant(ProductVariant productVariant) throws ProductNotFoundException, CreateNewProductVariantException, InputDataValidationException {

        Map<String, String> errorMap = validationService.generateErrorMap(productVariant);

        if (errorMap == null) {

            try {
                Product product = retrieveProductByProductId(productVariant.getProduct().getProductId());

                productVariantRepository.save(productVariant);
                product.getProductVariants().add(productVariant);

                // TODO: link to productImage and sizeDetails

                return productVariant;
            } catch (PersistenceException ex) {
                if (ex.getCause() != null
                        && ex.getCause().getCause() != null
                        && ex.getCause().getCause().getClass().getSimpleName().equals("SQLIntegrityConstraintViolationException")) {
                    throw new CreateNewProductVariantException("Product variant with SKU already exist");
                } else {
                    throw new CreateNewProductVariantException("An unexpected error has occurred: " + ex.getMessage());
                }
            } catch (Exception ex) {
                throw new CreateNewProductVariantException("An unexpected error has occurred: " + ex.getMessage());
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Category");
        }
    }

    public ProductVariant retrieveProductVariant(Long productVariantId) throws ProductVariantNotFoundException {
        if (productVariantId == null) {
            throw new ProductVariantNotFoundException("Product variant ID not provided");
        }

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ProductVariantNotFoundException("Product variant ID " + productVariantId + " does not exist!"));

        productVariant.getProductImages();
        return productVariant;
    }

    public List<ProductVariant> retrieveAllProductVariant() {

        List<ProductVariant> productVariance = productVariantRepository.findAll();

        for (ProductVariant productVariant : productVariance) {
            productVariant.getProductImages();
            productVariant.getProduct();
            productVariant.getSizeDetails();
        }

        return productVariance;
    }

    public ProductVariant deleteProductVariant(Long productVariantId) throws ProductVariantNotFoundException {

        ProductVariant productVariant = retrieveProductVariant(productVariantId);

        productVariant.setProductImages(null);
        productVariant.setSizeDetails(null);
        productVariant.getProduct().getProductVariants().remove(productVariant);
        productVariant.setProduct(null);

        productVariantRepository.delete(productVariant);
        return productVariant;
    }

    // TODO : Retrieve all warehouse and store
    // TODO : For each warehouse, create product stock

    // 1. new product -> assign to all warehouse and store
    // 2. new store -> retrieve all products and assign to store
    // 3. new warehouse -> retrieve all the products and assign to warehouse

    public void assignProductStock(Long warehouseId, Long storeId) {
        Warehouse warehouse;
        Store store;

        if (warehouseId != null) {
//            warehouse = warehouseRepository.findById(warehouseId);
        } else if (storeId != null) {
//            store = storeRepository.findById(storeId);
        }
    }


    /**
     * Called in 1. createProductVariant
     *           2. createWarehouse / createStore ( to retrieve all productVariant and call createProductStock for each product variant
     *
     * @return productStock created
     */

    public ProductStock createProductStock(ProductStock productStock, Long productVariantId, Long warehouseId, Long storeId) throws InputDataValidationException, CreateNewProductStockException {

        Map<String, String> errorMap = validationService.generateErrorMap(productStock);

        if (errorMap == null) {

            try {
                ProductVariant productVariant = retrieveProductVariant(productVariantId);
                productStock.setProductVariant(productVariant);

                // TODO: link to warehouse OR store

                productStockRepository.save(productStock);

                return productStock;
            } catch (Exception ex) {
                throw new CreateNewProductStockException("An unexpected error has occurred: " + ex.getMessage());
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Category");
        }
    }

    public ProductStock retrieveProductStockById(Long productStockId) throws ProductStockNotFoundException {

        ProductStock productStock = productStockRepository.findById(productStockId)
                .orElseThrow(() -> new ProductStockNotFoundException("Product stock ID " + productStockId + " does not exist!"));

        productStock.getProductVariant();
        productStock.getStore();
        productStock.getWarehouse();
        return productStock;
    }

    public List<ProductStock> retrieveAllProductStock() {
        return (List<ProductStock>) productStockRepository.findAll();
    }

    public ProductStock deleteProductStock(Long productStockId) throws ProductStockNotFoundException {
        ProductStock productStock = retrieveProductStockById(productStockId);

        productStock.setProductVariant(null);
        productStock.getStore().getProductStocks().remove(productStock);
        productStock.setStore(null);
        productStock.getWarehouse().getProductStocks().remove(productStock);
        productStock.setWarehouse(null);

        productStockRepository.delete(productStock);
        return productStock;
    }

    //    updateProduct()
//
//    setProductPrice() - done
//    updateProductPrice() - same as setProductPrice()
//    viewProductPrice() - redundant (get from the entity)
//
//    createProductVariant() - done
//    editProductVariant()
//    deleteProductVariant() - done
//    retrieveProductVariant() - done
//    retrieveProductVariance() - done
//
//    createProductStock()
//    updateProductStock()
//    retrieveProductStock()
//    retrieveAllProductStock()
//    deleteProductStock()
}
