package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.repositories.ProductRepository;
import capstone.rt04.retailbackend.repositories.ProductVariantRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductVariantException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ProductService {

    private final ValidationService validationService;

    private final TagService tagService;

    private final CategoryService categoryService;

    private final ProductRepository productRepository;

    private final ProductVariantRepository productVariantRepository;

    public ProductService(ValidationService validationService, TagService tagService, CategoryService categoryService, ProductRepository productRepository, ProductVariantRepository productVariantRepository) {
        this.validationService = validationService;
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
    }

    public Product createNewProduct(Product product, Long categoryId, List<Long> tagIds) throws InputDataValidationException, CreateNewProductException {

        Map<String, String> errorMap = validationService.generateErrorMap(product);

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

    public ProductVariant createProductVariant(ProductVariant productVariant, Long productId) throws ProductNotFoundException, CreateNewProductVariantException, InputDataValidationException {

        Map<String, String> errorMap = validationService.generateErrorMap(productVariant);

        if (errorMap == null) {

            try {
                Product product = retrieveProductByProductId(productId);
                productVariant.setProduct(product);

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

    public ProductVariant viewProductVariant(Long productVariantId) throws ProductVariantNotFoundException {
        if (productVariantId == null) {
            throw new ProductVariantNotFoundException("Product variant ID not provided");
        }

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ProductVariantNotFoundException("Product variant ID " + productVariantId + " does not exist!"));

        productVariant.getProductImages();
        return productVariant;
    }

    public List<ProductVariant> viewProductVariants() {

        List<ProductVariant> productVariance = productVariantRepository.findAll();

        for (ProductVariant productVariant : productVariance) {
            productVariant.getProductImages();
            productVariant.getProduct();
            productVariant.getSizeDetails();
        }

        return productVariance;
    }

    public ProductVariant deleteProductVariant(Long productVariantId) throws ProductVariantNotFoundException {

        ProductVariant productVariant = viewProductVariant(productVariantId);

        productVariant.setProductImages(null);
        productVariant.setSizeDetails(null);
        productVariant.getProduct().getProductVariants().remove(productVariant);
        productVariant.setProduct(null);

        productVariantRepository.delete(productVariant);
        return productVariant;
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
//    viewProductVariant() - done
//    viewProductVariance() - done
//
//    createProductStock()
//    updateProductStock()
//    viewProductStock()
//    viewAllProductStock()
//    deleteProductStock()
}
