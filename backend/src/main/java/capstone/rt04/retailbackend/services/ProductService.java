package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.discount.DiscountNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.*;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.TagNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final DiscountService discountService;
    private final PromoCodeService promoCodeService;
    private final ValidationService validationService;

    @Autowired
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductStockRepository productStockRepository;
    private final ProductVariantRepository productVariantRepository;

    public ProductService(ValidationService validationService, TagService tagService, CategoryService categoryService, ProductRepository productRepository, ProductVariantRepository productVariantRepository, ProductStockRepository productStockRepository, ProductImageRepository productImageRepository, DiscountService discountService, PromoCodeService promoCodeService) {
        this.validationService = validationService;
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productStockRepository = productStockRepository;
        this.productImageRepository = productImageRepository;
        this.discountService = discountService;
        this.promoCodeService = promoCodeService;
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

    public Product updateProduct(Product newProduct) throws ProductNotFoundException {

        Product product = retrieveProductByProductId(newProduct.getProductId());
        product.setPrice(newProduct.getPrice());
        product.setProductName(newProduct.getProductName());
        product.setCost(newProduct.getCost());
        product.setDescription(newProduct.getDescription());

//        product.setProductVariants(newProduct.getProductVariants()); -> createProductVariant / deleteProductVariant
//        product.setPromoCodes(newProduct.getPromoCodes()); -> add/remove promoCode
//        product.setCategory(newProduct.getCategory());
//        product.setTags(newProduct.getTags()); -> add/remove discount
//
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
        productToRemove.getTags().clear();

        // TODO: Clear product variant
        List<ProductVariant> productVariants = productToRemove.getProductVariants();
        productToRemove.setProductVariants(null);
        for (ProductVariant productVariant : productVariants){
            productVariant.setProduct(null);
            productVariantRepository.delete(productVariant);
            //TODO: have to search all shoppingcartItems and remove ref to productVariant
        }
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

                // TODO: link to productImage and sizeDetails?
                productVariantRepository.save(productVariant);
                product.getProductVariants().add(productVariant);

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

    public ProductVariant retrieveProductVariantById(Long productVariantId) throws ProductVariantNotFoundException {
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

    public ProductVariant updateProductVariant(ProductVariant newProductVariant, Long productVariantId) throws ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);
        productVariant.setColour(newProductVariant.getColour());
        productVariant.setSKU(newProductVariant.getSKU());
//        productVariant.setProduct(); - change product - is this necessary?
//        productVariant.setProductImages(); - add/remove productImage
//        productVariant.setSizeDetails(); - add/remove sizeDetails
        return productVariant;
    }

    public ProductVariant deleteProductVariant(Long productVariantId) throws ProductVariantNotFoundException {

        ProductVariant productVariant = retrieveProductVariantById(productVariantId);

        productVariant.setProductImages(null);
        productVariant.setSizeDetails(null);
        productVariant.getProduct().getProductVariants().remove(productVariant);
        productVariant.setProduct(null);

        productVariantRepository.delete(productVariant);
        return productVariant;
    }

    // TODO : Call this method for createWarehouse / createStore
    /**
     * Conditions:
     * 1. new product -> assign to List<Warehouse> and List<Store>
     * 2. new store -> retrieve List<Product> and assign to Store
     * 3. new warehouse -> retrieve List<Product> and assign to Warehouse
     *
     * @return void
     * TODO: uncomment warehouseService and storeService
     */

    public void assignProductStock(List<Long> warehouseIds, List<Long> storeIds) throws CreateNewProductStockException, InputDataValidationException {
        Warehouse warehouse = new Warehouse();
        Store store = new Store();
        List<ProductVariant> productVariants = productVariantRepository.findAll();

        for(Long warehouseId: warehouseIds ) {
//            warehouse = warehouseService.retrieveById(warehouseId);

            for (ProductVariant productVariant: productVariants ) {
                ProductStock productStock = new ProductStock(0, null, null);
                productStock.setProductVariant(productVariant);
                ProductStock newProductStock = createProductStock(productStock, productVariant.getProductVariantId(), warehouseId, null);

                warehouse.getProductStocks().add(newProductStock);
                newProductStock.setWarehouse(warehouse);
            }
        }

        for(Long storeId: storeIds) {
//            store = storeService.retrieveById(storeId);

            for (ProductVariant productVariant: productVariants ) {
                ProductStock productStock = new ProductStock(0, null, null);
                productStock.setProductVariant(productVariant);
                ProductStock newProductStock = createProductStock(productStock, productVariant.getProductVariantId(), null, storeId);

                store.getProductStocks().add(newProductStock);
                newProductStock.setStore(store);
            }
        }
    }

    /**
     * Called in:
     * 1. createProductVariant
     * 2. createWarehouse / createStore ( to retrieve all productVariant and call createProductStock for each product variant
     *
     * @return productStock created
     */
    public ProductStock createProductStock(ProductStock productStock, Long productVariantId, Long warehouseId, Long storeId) throws InputDataValidationException, CreateNewProductStockException {

        Map<String, String> errorMap = validationService.generateErrorMap(productStock);

        if (errorMap == null) {

            try {
                ProductVariant productVariant = retrieveProductVariantById(productVariantId);
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

        // TODO: Uncomment the codes when store and warehouse is done
        productStock.setProductVariant(null);
//        productStock.getStore().getProductStocks().remove(productStock);
        productStock.setStore(null);
//        productStock.getWarehouse().getProductStocks().remove(productStock);
        productStock.setWarehouse(null);

        productStockRepository.delete(productStock);
        return productStock;
    }

    public ProductImage createProductImage(String imgUrl, Long productVariantId) throws ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);
        ProductImage productImage = new ProductImage(imgUrl);
        productImageRepository.save(productImage);
        productVariant.getProductImages().add(productImage);
        return productImage;
    }

    public ProductImage retrieveProductImageById(Long productImageId) throws ProductImageNotFoundException {
        ProductImage productImage = productImageRepository.findById(productImageId)
                .orElseThrow(()-> new ProductImageNotFoundException("Product image " + productImageId + " not found!"));
        return productImage;
    }

    public ProductImage updateProductImage(ProductImage newProductImage) throws ProductImageNotFoundException {
        ProductImage productImage = retrieveProductImageById(newProductImage.getProductImageId());
        productImage.setProductImageUrl(newProductImage.getProductImageUrl());
        return productImage;
    }

    public ProductImage deleteProductImage(Long productImageId, Long productVariantId) throws ProductImageNotFoundException, ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);
        ProductImage productImage = retrieveProductImageById(productImageId);
        productVariant.getProductImages().remove(productImage);
        productImageRepository.delete(productImage);
        return productImage;
    }

    /**
     * List of update operations for relationships of Product
     */
    public void changeCategory(Long categoryId, Long productId) throws CategoryNotFoundException, ProductNotFoundException {
        Category newCategory = categoryService.retrieveCategoryByCategoryId(categoryId);
        Product product = retrieveProductByProductId(productId);
        Category oldCategory = product.getCategory();

        oldCategory.getProducts().remove(product);
        product.setCategory(newCategory);
        newCategory.getProducts().add(product);
    }

    public void addTag(Long tagId, Long productId) throws ProductNotFoundException, TagNotFoundException {
        Tag tag = tagService.retrieveTagByTagId(tagId);
        Product product = retrieveProductByProductId(productId);
        product.getTags().add(tag);
        tag.getProducts().add(product);
    }

    public void removeTag(Long tagId, Long productId) throws ProductNotFoundException, TagNotFoundException {
        Tag tag = tagService.retrieveTagByTagId(tagId);
        Product product = retrieveProductByProductId(productId);
        product.getTags().remove(tag);
        tag.getProducts().remove(product);
    }

    public void addPromoCode(Long promoCodeId, Long productId) throws PromoCodeNotFoundException, ProductNotFoundException {
        PromoCode promoCode = promoCodeService.retrievePromoCodeById(promoCodeId);
        Product product = retrieveProductByProductId(productId);
        product.getPromoCodes().add(promoCode);
        promoCode.getProducts().add(product);
    }

    public void removePromoCode(Long promoCodeId, Long productId) throws PromoCodeNotFoundException, ProductNotFoundException {
        PromoCode promoCode = promoCodeService.retrievePromoCodeById(promoCodeId);
        Product product = retrieveProductByProductId(productId);
        product.getPromoCodes().remove(promoCode);
        promoCode.getProducts().remove(product);
    }

    public void addDiscount(Long discountId, Long productId) throws ProductNotFoundException, DiscountNotFoundException {
        Discount discount = discountService.retrieveDiscountById(discountId);
        Product product = retrieveProductByProductId(productId);
        product.getDiscounts().add(discount);
        discount.getProducts().add(product);
    }

    public void removeDiscount(Long discountId, Long productId) throws ProductNotFoundException, DiscountNotFoundException {
        Discount discount = discountService.retrieveDiscountById(discountId);
        Product product = retrieveProductByProductId(productId);
        product.getDiscounts().remove(discount);
        discount.getProducts().remove(product);
    }

    /**
     * List of update operations for relationships of ProductVariant
     */
    //        productVariant.setProduct(); - change product - is this necessary?
    //        productVariant.setProductImages(); - add/remove productImage
    //        productVariant.setSizeDetails(); - add/remove sizeDetails
    public void addProductImage(Long productImageId, Long productVariantId) throws ProductVariantNotFoundException, ProductImageNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);
        productVariant.getProductImages().add(retrieveProductImageById(productImageId));
    }

    public void removeProductImage(Long productImageId, Long productVariantId) throws ProductVariantNotFoundException, ProductImageNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);
        productVariant.getProductImages().remove(retrieveProductImageById(productImageId));
    }

    public void addSizeDetails(Long sizeDetailId, Long productVariantId) throws ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);
//        SizeDetails sizeDetails = sizeDetailsService.retrieveSizeDetailsById(sizeDetailId);
//        productVariant.setSizeDetails(sizeDetails);
    }

    public void removeSizeDetails(Long productVariantId) throws ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);
        productVariant.setSizeDetails(null);
    }

//    updateProduct() - done
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
//    createProductStock() - done
//    updateProductStock()
//    retrieveProductStock() - done
//    retrieveAllProductStock() - done
//    deleteProductStock() - done
}
