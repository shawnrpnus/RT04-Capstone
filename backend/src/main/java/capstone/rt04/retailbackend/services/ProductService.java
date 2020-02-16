package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.ProductImageRepository;
import capstone.rt04.retailbackend.repositories.ProductRepository;
import capstone.rt04.retailbackend.repositories.ProductStockRepository;
import capstone.rt04.retailbackend.repositories.ProductVariantRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.*;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.math.BigDecimal;
import java.util.ArrayList;
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
    private final StoreService storeService;
    private final WarehouseService warehouseService;

    @Autowired
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductStockRepository productStockRepository;
    private final ProductVariantRepository productVariantRepository;

    public ProductService(ValidationService validationService, TagService tagService, CategoryService categoryService, StoreService storeService, ProductRepository productRepository, ProductVariantRepository productVariantRepository, ProductStockRepository productStockRepository, ProductImageRepository productImageRepository, DiscountService discountService, PromoCodeService promoCodeService, WarehouseService warehouseService) {
        this.validationService = validationService;
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.storeService = storeService;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productStockRepository = productStockRepository;
        this.productImageRepository = productImageRepository;
        this.discountService = discountService;
        this.promoCodeService = promoCodeService;
        this.warehouseService = warehouseService;
    }

    public Product createNewProduct(Product product, Long categoryId, List<Long> tagIds) throws InputDataValidationException, CreateNewProductException, CategoryNotFoundException {

        if (categoryId == null) {
            throw new CreateNewProductException("The new product must be associated a leaf category");
        }

        Category category = categoryService.retrieveCategoryByCategoryId(categoryId);
        product.setCategory(category);

        Map<String, String> errorMap = validationService.generateErrorMap(product);

        if (errorMap == null) {
            try {
                if (!category.getChildCategories().isEmpty()) {
                    throw new CreateNewProductException("Selected category for the new product is not a leaf category");
                }

                product.setCategory(category);
                productRepository.save(product);

                category.getProducts().add(product);

                if (tagIds != null && (!tagIds.isEmpty())) {
                    for (Long tagId : tagIds) {
                        Tag tag = tagService.retrieveTagByTagId(tagId);
                        // addTag is implemented in the entity
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

        List<Product> products = productRepository.findAll();
        lazilyLoadProduct(products);
        return products;
    }

    public Product retrieveProductById(Long productId) throws ProductNotFoundException {
        if (productId == null) {
            throw new ProductNotFoundException("Product ID not provided");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product ID " + productId + " does not exist!"));

        List<Product> products = new ArrayList<>();
        products.add(product);
        lazilyLoadProduct(products);
        return product;
    }

    public List<Product> retrieveListOfProductsById(List<Long> productIds) throws ProductNotFoundException {
        if (productIds == null) {
            throw new ProductNotFoundException("Product IDs not provided");
        }
        List<Product> products = (List<Product>) productRepository.findAllById(productIds);
        lazilyLoadProduct(products);
        return products;
    }

    private void lazilyLoadProduct(List<Product> products) {
        for (Product product : products) {
            product.getProductName();
            product.getCategory();
            product.getTags().size();
            product.getReviews().size();
            product.getDiscounts().size();
        }
    }

    public Product updateProduct(Product newProduct) throws ProductNotFoundException {

        Product product = retrieveProductById(newProduct.getProductId());
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
        Product productToRemove = retrieveProductById(productId);
        productToRemove.toString();
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
        for (ProductVariant productVariant : productVariants) {
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
        Product product = retrieveProductById(productId);
        product.setPrice(price);
    }

    public ProductVariant createProductVariant(ProductVariant productVariant, Long productId) throws ProductNotFoundException, CreateNewProductVariantException, InputDataValidationException {

        Product product = retrieveProductById(productId);
        productVariant.setProduct(product);

        Map<String, String> errorMap = validationService.generateErrorMap(productVariant);

        if (errorMap == null) {

            try {
                // SizeDetails will be added separately afterwards
                // TODO: Create ProductImage and link to Product before saving

                productVariantRepository.save(productVariant);
                product.getProductVariants().add(productVariant);

                // TODO: uncomment when warehouse and store services are done
//                List<Warehouse> warehouses = warehouseService.retrieveAllWarehouse();
//                List<Store> stores = storeService.retrieveAllStores();
//
//                assignProductStock(warehouses, stores);

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

        List<ProductVariant> productVariants = new ArrayList<ProductVariant>();
        productVariants.add(productVariant);
        lazilyLoadProductVariant(productVariants);
        return productVariant;
    }

    public ProductVariant retrieveProductVariantBySku(String sku) throws ProductVariantNotFoundException {
        if (sku == null) {
            throw new ProductVariantNotFoundException("Product variant SKU not provided");
        }

        ProductVariant productVariant = productVariantRepository.findBySKU(sku);

        if (productVariant == null) {
            throw new ProductVariantNotFoundException("Product variant with SKU " + sku + " does not exist!");
        }

        List<ProductVariant> productVariants = new ArrayList<ProductVariant>();
        productVariants.add(productVariant);
        lazilyLoadProductVariant(productVariants);
        return productVariant;
    }

    public List<ProductVariant> retrieveProductVariantByProduct(Long productId) {
        List<ProductVariant> productVariants = productVariantRepository.findAllByProduct(productId);
        lazilyLoadProductVariant(productVariants);
        return productVariants;
    }

    public List<ProductVariant> retrieveAllProductVariant() {
        List<ProductVariant> productVariants = productVariantRepository.findAll();
        lazilyLoadProductVariant(productVariants);
        return productVariants;
    }

    private List<ProductVariant> lazilyLoadProductVariant(List<ProductVariant> productVariants) {
        for (ProductVariant productVariant : productVariants) {
            productVariant.getProductImages().size();
            productVariant.getProduct();
            productVariant.getSizeDetails();
        }
        return productVariants;
    }

    public ProductVariant updateProductVariant(ProductVariant newProductVariant) throws ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(newProductVariant.getProductVariantId());
        productVariant.setColour(newProductVariant.getColour());
        productVariant.setSKU(newProductVariant.getSKU());
        return productVariant;
    }

    public ProductVariant deleteProductVariant(Long productVariantId) throws ProductVariantNotFoundException {

        ProductVariant productVariant = retrieveProductVariantById(productVariantId);
        productVariant.toString();
        productVariant.setProductImages(null);
        productVariant.setSizeDetails(null);
        productVariant.getProduct().getProductVariants().remove(productVariant);
        productVariant.setProduct(null);

        productVariantRepository.delete(productVariant);
        return productVariant;
    }

    // TODO : Call this method in createWarehouse / createStore

    /**
     * Scenarios:
     * 1. new product -> assign to List<Warehouse> and List<Store>
     * 2. new store -> retrieve List<Product> and assign to Store
     * 3. new warehouse -> retrieve List<Product> and assign to Warehouse
     *
     * @return void
     */
    public void assignProductStock(List<Warehouse> warehouses, List<Store> stores) throws CreateNewProductStockException, InputDataValidationException, WarehouseNotFoundException, StoreNotFoundException {
        List<ProductVariant> productVariants = productVariantRepository.findAll();

        if (warehouses != null ) {
            for (Warehouse warehouse : warehouses) {
                Warehouse realW = warehouseService.retrieveWarehouseById(warehouse.getWarehouseId());
                warehouseService.lazyLoadWarehouseFields(realW);
                for (ProductVariant productVariant : productVariants) {
                    ProductStock productStock = new ProductStock(0, 0, 0);
                    productStock.setProductVariant(productVariant);
                    ProductStock newProductStock = createProductStock(productStock, productVariant.getProductVariantId());

//                    System.out.println("QWERQWERQWERQWER" + warehouse.getProductStocks().size());
                    realW.getProductStocks().add(newProductStock);
                    newProductStock.setWarehouse(realW);
                }
            }
        }

        if (stores != null ) {
            for (Store s : stores) {
                Store store = storeService.retrieveStoreById(s.getStoreId());
                storeService.lazyLoadStoreFields(store);
                for (ProductVariant productVariant : productVariants) {
                    ProductStock productStock = new ProductStock(0, null, null);
                    productStock.setProductVariant(productVariant);
                    ProductStock newProductStock = createProductStock(productStock, productVariant.getProductVariantId());

                    store.getProductStocks().add(newProductStock);
                    newProductStock.setStore(store);
                }
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
    public ProductStock createProductStock(ProductStock productStock, Long productVariantId) throws InputDataValidationException, CreateNewProductStockException {

        Map<String, String> errorMap = validationService.generateErrorMap(productStock);
        System.out.println(errorMap + "HI WHERE DID I GO WRONG");
        if (errorMap == null) {
            try {
                ProductVariant productVariant = retrieveProductVariantById(productVariantId);
                productStock.setProductVariant(productVariant);

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

        List<ProductStock> productStocks = new ArrayList<>();
        productStocks.add(productStock);
        lazilyLoadProductStock(productStocks);
        return productStock;
    }

    public List<ProductStock> retrieveProductStocksByParameter(Long storeId, Long warehouseId, Long productVariantId) {
        List<ProductStock> productStocks = new ArrayList<>();
        if (storeId != null) productStocks = productStockRepository.findAllByStoreStoreId(storeId);
        else if (warehouseId != null) productStocks = productStockRepository.findAllByWarehouseWarehouseId(warehouseId);
        else if (productVariantId != null)
            productStocks = productStockRepository.findAllByProductVariantProductVariantId(productVariantId);
        lazilyLoadProductStock(productStocks);
        return productStocks;
    }

    public List<ProductStock> retrieveAllProductStock() {
        List<ProductStock> productStocks = (List<ProductStock>) productStockRepository.findAll();
        lazilyLoadProductStock(productStocks);
        return productStocks;
    }

    private List<ProductStock> lazilyLoadProductStock(List<ProductStock> productStocks) {
        for (ProductStock productStock : productStocks) {
            productStock.getWarehouse();
            productStock.getStore();
            productStock.getProductVariant();
        }
        return productStocks;
    }

    public ProductStock updateProductStock(ProductStock newProductStock) throws ProductStockNotFoundException {

        ProductStock productStock = retrieveProductStockById(newProductStock.getProductStockId());
        productStock.setQuantity(newProductStock.getQuantity());
        productStock.setMaxQuantity(newProductStock.getMaxQuantity());
        productStock.setNotificationLevel(newProductStock.getNotificationLevel());
        productStock.setQRcode(newProductStock.getQRcode());
        return productStock;
    }

    public ProductStock deleteProductStock(Long productStockId) throws ProductStockNotFoundException {
        ProductStock productStock = retrieveProductStockById(productStockId);
        productStock.toString();
        // TODO: Uncomment the codes when store and warehouse is done
        productStock.setProductVariant(null);
//        productStock.getStore().getProductStocks().remove(productStock);
        productStock.setStore(null);
//        productStock.getWarehouse().getProductStocks().remove(productStock);
        productStock.setWarehouse(null);

        productStockRepository.delete(productStock);
        return productStock;
    }

    public List<ProductImage> createProductImage(List<ProductImage> productImages, Long productVariantId) throws ProductVariantNotFoundException {
        // Uploading to Google Drive will be done at frontend
        List<ProductImage> productImageList = retrieveProductVariantById(productVariantId).getProductImages();

        for (ProductImage productImage : productImages) {
            productImageRepository.save(productImage);
            productImageList.add(productImage);
        }
        return productImages;
    }

    public ProductImage retrieveProductImageById(Long productImageId) throws ProductImageNotFoundException {
        ProductImage productImage = productImageRepository.findById(productImageId)
                .orElseThrow(() -> new ProductImageNotFoundException("Product image " + productImageId + " not found!"));
        return productImage;
    }

    public List<ProductImage> retrieveProductImageByProductVariant(Long productVariantId) throws ProductImageNotFoundException, ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);
        List<Long> productImageIds = new ArrayList<>();
        for (ProductImage productImage : productVariant.getProductImages()) {
            productImageIds.add(productImage.getProductImageId());
        }
        List<ProductImage> productImages = productImageRepository.findAllByProductImageIdIn(productImageIds);
        return productImages;
    }

    public ProductImage updateProductImage(ProductImage newProductImage) throws ProductImageNotFoundException {
        ProductImage productImage = retrieveProductImageById(newProductImage.getProductImageId());
        productImage.setProductImageUrl(newProductImage.getProductImageUrl());
        return productImage;
    }

    public List<ProductImage> deleteProductImage(List<ProductImage> productImages, Long productVariantId) throws ProductImageNotFoundException, ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);

        List<ProductImage> deletedProductImages = new ArrayList<>();
        ProductImage productImage;

        for (ProductImage prodImage : productImages) {
            productImage = retrieveProductImageById(prodImage.getProductImageId());
            productVariant.getProductImages().remove(productImage);
            productImageRepository.delete(productImage);
            deletedProductImages.add(productImage);
        }
        return deletedProductImages;
    }

    /**
     * List of update operations for relationships of Product
     */
    public void changeCategoryForProduct(Long categoryId, Long productId) throws CategoryNotFoundException, ProductNotFoundException {
        Category newCategory = categoryService.retrieveCategoryByCategoryId(categoryId);
        Product product = retrieveProductById(productId);
        Category oldCategory = product.getCategory();

        oldCategory.getProducts().remove(product);
        product.setCategory(newCategory);
        newCategory.getProducts().add(product);
    }

//    public void addOrRemoveTag(Long tagId, Long productId, List<Long> tagIds, List<Long> productIds, Boolean isAppend) throws ProductNotFoundException, TagNotFoundException, TagNotFoundException {
//        // Adding / removing tag for a list of products
//        if (tagId != null) {
//            Tag tag = tagService.retrieveTagByTagId(tagId);
//            List<Product> products = retrieveListOfProductsById(productIds);
//            if (isAppend) {
//                for (Product product : products) {
//                    product.getTags().add(tag);
//                    tag.getProducts().add(product);
//                }
//            } else {
//                for (Product product : products) {
//                    product.getTags().remove(tag);
//                    tag.getProducts().remove(product);
//                }
//            }
//        } else if (productId != null) {
//            Product product = retrieveProductById(productId);
//            List<Tag> tags = tagService.retrieveListOfTagsById(tagIds);
//            if (isAppend) {
//                for (Tag tag : tags) {
//                    product.getTags().add(tag);
//                    tag.getProducts().add(product);
//                }
//            } else {
//                for (Tag tag : tags) {
//                    product.getTags().remove(tag);
//                    tag.getProducts().remove(product);
//                }
//            }
//        }
//    }
//
//    public void addOrRemovePromoCode(Long promoCodeId, Long productId, List<Long> promoCodeIds, List<Long> productIds, Boolean isAppend) throws PromoCodeNotFoundException, ProductNotFoundException, PromoCodeNotFoundException {
//        // Adding / removing promoCode for a list of products
//        if (promoCodeId != null) {
//            PromoCode promoCode = promoCodeService.retrievePromoCodeById(promoCodeId);
//            List<Product> products = retrieveListOfProductsById(productIds);
//            if (isAppend) {
//                for (Product product : products) {
//                    promoCode.getProducts().add(product);
//                    product.getPromoCodes().add(promoCode);
//                }
//            } else {
//                for (Product product : products) {
//                    promoCode.getProducts().remove(product);
//                    product.getPromoCodes().remove(promoCode);
//                }
//            }
//        }
//        // Adding / removing a list of promoCodes for a product
//        else if (productId != null) {
//            Product product = retrieveProductById(productId);
//            List<PromoCode> promoCodes = promoCodeService.retrieveListOfPromoCodesById(promoCodeIds);
//            if (isAppend) {
//                for (PromoCode promoCode : promoCodes) {
//                    product.getPromoCodes().add(promoCode);
//                    promoCode.getProducts().add(product);
//                }
//            } else {
//                for (PromoCode promoCode : promoCodes) {
//                    product.getPromoCodes().remove(promoCode);
//                    promoCode.getProducts().remove(product);
//                }
//            }
//        }
//    }
//
//    public void addOrRemoveDiscount(Long discountId, Long productId, List<Long> discountIds, List<Long> productIds, Boolean isAppend) throws ProductNotFoundException, DiscountNotFoundException, DiscountNotFoundException {
//        // Adding / removing discount for a list of products
//        if (discountId != null) {
//            Discount discount = discountService.retrieveDiscountById(discountId);
//            List<Product> products = retrieveListOfProductsById(productIds);
//            if (isAppend) {
//                for (Product product : products) {
//                    discount.getProducts().add(product);
//                    product.getDiscounts().add(discount);
//                }
//            } else {
//                for (Product product : products) {
//                    discount.getProducts().remove(product);
//                    product.getDiscounts().remove(discount);
//                }
//            }
//        }
//        // Adding / removing a list of discounts for a product
//        else if (productId != null) {
//            Product product = retrieveProductById(productId);
//            List<Discount> discounts = discountService.retrieveListOfDiscountsById(discountIds);
//            if (isAppend) {
//                for (Discount discount : discounts) {
//                    product.getDiscounts().add(discount);
//                    discount.getProducts().add(product);
//                }
//            } else {
//                for (Discount discount : discounts) {
//                    product.getDiscounts().remove(discount);
//                    discount.getProducts().remove(product);
//                }
//            }
//        }
//    }
}