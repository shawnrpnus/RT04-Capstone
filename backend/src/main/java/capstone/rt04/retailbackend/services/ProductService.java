package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.ProductImageRepository;
import capstone.rt04.retailbackend.repositories.ProductRepository;
import capstone.rt04.retailbackend.repositories.ProductStockRepository;
import capstone.rt04.retailbackend.repositories.ProductVariantRepository;
import capstone.rt04.retailbackend.request.product.ColourToImageUrlsMap;
import capstone.rt04.retailbackend.response.ColourToSizeImageMap;
import capstone.rt04.retailbackend.response.ProductDetailsResponse;
import capstone.rt04.retailbackend.response.SizeToProductVariantAndStockMap;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.discount.DiscountNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.*;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.TagNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.math.BigDecimal;
import java.util.*;

@Service
@Transactional
@Slf4j
public class ProductService {

    private final TagService tagService;
    private final CategoryService categoryService;
    private final DiscountService discountService;
    private final PromoCodeService promoCodeService;
    private final ValidationService validationService;
    private final StyleService styleService;
    private final StoreService storeService;
    private final WarehouseService warehouseService;
    private final SizeDetailsService sizeDetailsService;
    private final TransactionService transactionService;

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductStockRepository productStockRepository;
    private final ProductVariantRepository productVariantRepository;

    public ProductService(ValidationService validationService, TagService tagService, CategoryService categoryService, StyleService styleService,
                          StoreService storeService, ProductRepository productRepository, ProductVariantRepository productVariantRepository,
                          ProductStockRepository productStockRepository, ProductImageRepository productImageRepository, DiscountService discountService,
                          PromoCodeService promoCodeService, WarehouseService warehouseService, SizeDetailsService sizeDetailsService, TransactionService transactionService) {
        this.validationService = validationService;
        this.tagService = tagService;
        this.categoryService = categoryService;
        this.styleService = styleService;
        this.storeService = storeService;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productStockRepository = productStockRepository;
        this.productImageRepository = productImageRepository;
        this.discountService = discountService;
        this.promoCodeService = promoCodeService;
        this.warehouseService = warehouseService;
        this.sizeDetailsService = sizeDetailsService;
        this.transactionService = transactionService;
    }

    public Product createNewProduct(Product product, Long categoryId, List<Long> tagIds, List<Long> styleIds, List<SizeEnum> sizes, List<ColourToImageUrlsMap> colourToImageUrlsMaps) throws InputDataValidationException, CreateNewProductException, CategoryNotFoundException {

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

                if (styleIds != null && (!styleIds.isEmpty())) {
                    for (Long styleId : styleIds) {
                        Style style = styleService.retrieveStyleByStyleId(styleId);
                        product.addStyle(style);
                    }
                }
                createMultipleProductVariants(product.getProductId(), colourToImageUrlsMaps, sizes);

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

    public List<ProductDetailsResponse> retrieveProductDetailsForCategory(Long storeOrWarehouseId, Long categoryId) throws ProductNotFoundException {
        List<ProductDetailsResponse> productDetailsResponses = retrieveProductsDetails(storeOrWarehouseId, null);
        List<ProductDetailsResponse> result = new ArrayList<>();
        for (ProductDetailsResponse p : productDetailsResponses) {
            Category c = p.getProduct().getCategory();
            if (checkIfCategoryIsInside(c, categoryId)) {
                result.add(p);
            }
        }
        return result;
    }

    private boolean checkIfCategoryIsInside(Category categoryToCheck, Long categoryId) {
        if (categoryToCheck.getCategoryId().equals(categoryId)) return true;
        if (categoryToCheck.getParentCategory() == null) return false;
        return checkIfCategoryIsInside(categoryToCheck.getParentCategory(), categoryId);
    }

    @Transactional(readOnly = true)
    public List<ProductDetailsResponse> retrieveProductsDetails(Long storeOrWarehouseId, Long productId) throws ProductNotFoundException {
        // Each product can have multiple colour
        // Each colours will have a list of sizes
        // Every sizes of each colour will show the productVariantId and productStock

        List<Product> products = new ArrayList<>();
        if (productId != null) {
            products.add(retrieveProductById(productId));
        } else {
            products = retrieveAllProducts();
        }
        String colour;
        List<String> colours = new ArrayList<>();

        ProductStock prodStock = new ProductStock();

        ProductDetailsResponse productDetailsResponse;
        SizeToProductVariantAndStockMap sizeToProductVariantAndStockMap;
        ColourToSizeImageMap colourToSizeImageMap = new ColourToSizeImageMap();

        List<SizeToProductVariantAndStockMap> sizeToProductVariantAndStockMaps = new ArrayList<>();
        List<ProductDetailsResponse> productDetailsResponses = new ArrayList<>();

        for (Product product : products) {
            productDetailsResponse = new ProductDetailsResponse();
            colours.clear();

            for (ProductVariant productVariant : product.getProductVariants()) {
                // Find product stock that belongs to the specified store/ warehouse

                if (storeOrWarehouseId != null) { // no need to return product stock if no store/warehouse ID provided
                    prodStock = new ProductStock();
                    for (ProductStock productStock : productVariant.getProductStocks()) {
                        if (productStock.getStore() != null && productStock.getStore().getStoreId() == storeOrWarehouseId) {
                            prodStock = productStock;
                            break;
                        } else if (productStock.getWarehouse() != null && productStock.getWarehouse().getWarehouseId() == storeOrWarehouseId) {
                            prodStock = productStock;
                            break;
                        }
                    }
                }

                sizeToProductVariantAndStockMap = new SizeToProductVariantAndStockMap(productVariant.getSizeDetails().getProductSize(),
                        productVariant.getProductVariantId(), prodStock);

                colour = productVariant.getColour();
                if (!colours.contains(colour)) {
                    colours.add(colour);
                    sizeToProductVariantAndStockMaps = new ArrayList<>();
                    // to make it an array
                    sizeToProductVariantAndStockMaps.add(sizeToProductVariantAndStockMap);

                    // for every new colour, add the colour to size map to product
                    colourToSizeImageMap = new ColourToSizeImageMap(colour, productVariant.getProductImages(), sizeToProductVariantAndStockMaps);
                    productDetailsResponse.getColourToSizeImageMaps().add(colourToSizeImageMap);
                } else {
                    // add a new size to the SELECTED colour.
                    if (colourToSizeImageMap.getColour().equals(colour)) {
                        colourToSizeImageMap.getSizeMaps().add(sizeToProductVariantAndStockMap);
                    } else {
                        for (ColourToSizeImageMap csMap : productDetailsResponse.getColourToSizeImageMaps()) {
                            if (csMap.getColour().equals(colour)) {
                                colourToSizeImageMap = csMap;
                                colourToSizeImageMap.getSizeMaps().add(sizeToProductVariantAndStockMap);
                                break;
                            }
                        }
                    }
                }
            }

            for (ColourToSizeImageMap csMap : productDetailsResponse.getColourToSizeImageMaps()) {
                Collections.sort(csMap.getSizeMaps(), Comparator.comparingInt(SizeToProductVariantAndStockMap::getSizeValue));
            }

            productDetailsResponse.setLeafNodeName(categoryService.generateLeafNodeName(product.getCategory(), ""));
            productDetailsResponse.setProduct(product);
            productDetailsResponses.add(productDetailsResponse);
        }
        return productDetailsResponses;
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

    public List<Product> retrieveProductByCategory(Category category) {
        List<Product> products = productRepository.findAllByCategoryId(category.getCategoryId());
        lazilyLoadProduct(products);
        return products;
    }

    public List<Product> retrieveProductByCriteria(Category category, List<Tag> tags, List<String> colours, List<SizeEnum> sizes,
                                                   BigDecimal minPrice, BigDecimal maxPrice, SortEnum sortEnum) {
        List<Product> products = new ArrayList<>();
        List<Product> productsByTag = null;

        if (tags == null || tags.size() == 0) {
            productsByTag = productRepository.findAllByCategoryId(category.getCategoryId());
        } else {
            productsByTag = productRepository.findAllByTagsIn(tags);
        }

        Boolean matchColour, matchSize, matchPriceRange;

        for (Product product : productsByTag) {
            matchSize = false;
            matchPriceRange = false;
            matchColour = false;

            if (product.getPrice().compareTo(minPrice) >= 0 && product.getPrice().compareTo(maxPrice) <= 0)
                matchPriceRange = true;

            for (ProductVariant productVariant : product.getProductVariants()) {

                if (colours != null && colours.size() > 0) {
                    if (colours.contains(productVariant.getColour())) {
                        matchColour = true;
                        if (sizes != null && sizes.size() > 0) {
                            for (SizeEnum size : sizes) {
                                if (size.equals(productVariant.getSizeDetails().getProductSize())) {
                                    matchSize = true;
                                    break;
                                }
                            }
                        } else {
                            matchSize = true;
                        }
                    }
                } else {
                    matchColour = true;
                }
            }
            if (matchColour && matchSize && matchPriceRange) {
                products.add(product);
            }
        }

        if (sortEnum == SortEnum.PRICE_LOW_TO_HIGH) {
            Collections.sort(products, Comparator.comparing(Product::getPrice));
        } else if (sortEnum == SortEnum.PRICE_HIGH_TO_LOW) {
            Collections.sort(products, Comparator.comparing(Product::getPrice).reversed());
//            products.sort((Product product1, Product product2)->product2.getPrice().compareTo(product1.getPrice()));
//        } else if (sortEnum == SortEnum.RATING_HIGH_TO_LOW) {
//            // Find average
//        } else if (sortEnum == SortEnum.RATING_LOW_TO_HIGH) {
//            // Find average
        } else {
            Collections.sort(products, Comparator.comparing(Product::getProductId).reversed());
        }

        lazilyLoadProduct(products);
        return products;
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
            product.getCategory();
            product.getTags().size();
            product.getReviews().size();
            product.getDiscounts().size();
            product.getPromoCodes().size();
            product.getProductVariants().size();
            product.getStyles().size();
        }
    }

    public Product updateProduct(Product newProduct) throws ProductNotFoundException, TagNotFoundException, StyleNotFoundException, CategoryNotFoundException {

        Product product = retrieveProductById(newProduct.getProductId());
        product.setPrice(newProduct.getPrice());
        product.setProductName(newProduct.getProductName());
        product.setCost(newProduct.getCost());
        product.setDescription(newProduct.getDescription());

        addOrRemoveTag(null, newProduct.getProductId(), newProduct.getTags(), null);
        addOrRemoveStyle(null, newProduct.getProductId(), newProduct.getStyles(), null);
        changeCategoryForProduct(newProduct.getCategory().getCategoryId(), newProduct.getProductId());

//        product.setProductVariants(newProduct.getProductVariants()); -> createProductVariant / deleteProductVariant
//        product.setPromoCodes(newProduct.getPromoCodes()); -> add/remove promoCode
//        product.setCategory(newProduct.getCategory());
//        product.setTags(newProduct.getTags()); -> add/remove discount
//        product.setStyles();
//        product.setDiscounts();
//        product.setReviews();
        return product;
    }

    public Product deleteProduct(Long productId) throws ProductNotFoundException, ProductVariantNotFoundException, ProductStockNotFoundException, DeleteProductVariantException//, DeleteProductException
    {
        Product productToRemove = retrieveProductById(productId);

        // Clear product variant
        List<ProductVariant> productVariants = new ArrayList<>(productToRemove.getProductVariants());
        for (ProductVariant productVariant : productVariants) {
            deleteProductVariant(productVariant.getProductVariantId());
        }

        productToRemove.getCategory().getProducts().remove(productToRemove);
        productToRemove.getTags().forEach(tag -> tag.getProducts().remove(productToRemove));
        productToRemove.getStyles().forEach(style -> style.getProducts().remove(productToRemove));
        productToRemove.getPromoCodes().forEach(promoCode -> promoCode.getProducts().remove(productToRemove));
        productToRemove.getDiscounts().forEach(discount -> discount.getProducts().remove(productToRemove));

        productRepository.delete(productToRemove);
        return productToRemove;
    }

    public ProductVariant createProductVariant(ProductVariant productVariant, Long productId) throws ProductNotFoundException, InputDataValidationException, PersistenceException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException, ProductVariantNotFoundException {
        Product product = retrieveProductById(productId);
        productVariant.setProduct(product);
        productVariant.toString();

        Map<String, String> errorMap = validationService.generateErrorMap(productVariant);

        if (errorMap == null) {
            productVariantRepository.save(productVariant);
            product.getProductVariants().add(productVariant);

            List<Warehouse> warehouses = warehouseService.retrieveAllWarehouses();
            List<Store> stores = storeService.retrieveAllStores();

            assignProductStock(warehouses, stores, productVariant);
            return productVariant;
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Category");
        }
    }

    public List<ProductVariant> createMultipleProductVariants(Long productId, List<ColourToImageUrlsMap> colourToImageUrlsMaps, List<SizeEnum> sizes) throws ProductNotFoundException, InputDataValidationException, CreateNewProductStockException, StoreNotFoundException, WarehouseNotFoundException, ProductVariantNotFoundException, ProductImageNotFoundException {
        Product product = retrieveProductById(productId);

        List<ProductVariant> productVariants = new ArrayList<>();
        List<ProductVariant> productVariantsToAssignImages = new ArrayList<>();
        List<ProductImage> productImages;
        ProductVariant productVariant;
        SizeDetails sizeDetails;
        Boolean imageCreated;
        String sku, colour;
        Integer position;

        for (ColourToImageUrlsMap colourToImageUrlsMap : colourToImageUrlsMaps) {

            colour = colourToImageUrlsMap.getColour();
            productImages = new ArrayList<>();
            position = 0;
            imageCreated = Boolean.FALSE;

            for (String imageUrl : colourToImageUrlsMap.getImageUrls()) {
                productImages.add(new ProductImage(imageUrl, position));
                position++;
            }

            for (SizeEnum size : sizes) {
                sku = product.getSerialNumber() + "-" + colour + "-" + size;
                sizeDetails = new SizeDetails(size);
                productVariant = new ProductVariant(sku, colour, product);
                productVariant.setSizeDetails(sizeDetailsService.createSizeDetails(sizeDetails));
                productVariant = createProductVariant(productVariant, product.getProductId());

                productVariants.add(productVariant);
                // Create and persist a ProductImage object
                if (!imageCreated) { // -> New colour create image once
                    productImages = createProductImage(productImages, productVariant.getProductVariantId());
                    imageCreated = Boolean.TRUE;
                    productVariantsToAssignImages = new ArrayList<>();
                } else {
                    productVariantsToAssignImages.add(productVariant);
                }
            }
            // Associate productVariant of the same colour but different sizes to the created ProductImage
            assignProductImages(productImages, productVariantsToAssignImages);
        }
        return productVariants;
    }

    public ProductVariant retrieveProductVariantById(Long productVariantId) throws ProductVariantNotFoundException {
        if (productVariantId == null) {
            throw new ProductVariantNotFoundException("Product variant ID not provided");
        }

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ProductVariantNotFoundException("Product variant ID " + productVariantId + " does not exist!"));

        List<ProductVariant> productVariants = new ArrayList<>();
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

        List<ProductVariant> productVariants = productVariantRepository.findAllByProduct_ProductId(productId);
        lazilyLoadProductVariant(productVariants);
        return productVariants;
    }

    public List<ProductVariant> retrieveAllProductVariant() {
        List<ProductVariant> productVariants = (List<ProductVariant>) productVariantRepository.findAll();
        lazilyLoadProductVariant(productVariants);
        return productVariants;
    }


    private List<ProductVariant> lazilyLoadProductVariant(List<ProductVariant> productVariants) {
        for (ProductVariant productVariant : productVariants) {
            if (productVariant.getProductImages() != null) productVariant.getProductImages().size();
            productVariant.getProduct();
            productVariant.getSizeDetails();
            productVariant.getProductStocks().size();
        }
        return productVariants;
    }

    public ProductVariant updateProductVariant(ProductVariant newProductVariant) throws ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(newProductVariant.getProductVariantId());
        productVariant.setColour(newProductVariant.getColour());
        productVariant.setSKU(newProductVariant.getSKU());
        return productVariant;
    }

    public ProductVariant deleteProductVariant(Long productVariantId) throws ProductVariantNotFoundException, ProductStockNotFoundException, DeleteProductVariantException {

        ProductVariant productVariant = retrieveProductVariantById(productVariantId);

        for (Transaction transaction : transactionService.retrievePastOrders()) {
            for (TransactionLineItem transactionLineItem : transaction.getTransactionLineItems()) {
                if (transactionLineItem.getProductVariant().getProductVariantId().equals(productVariantId)) {
                    throw new DeleteProductVariantException("Transaction line item tied to product");
                }
            }
        }
        // To prevent concurrent modification
        List<ProductStock> productStocks = new ArrayList<>(productVariant.getProductStocks());

        for (ProductStock productStock : productStocks) {
            deleteProductStock(productStock.getProductStockId());
        }

        productVariant.setProductImages(null);
        productVariant.setSizeDetails(null);
        productVariant.getProduct().getProductVariants().remove(productVariant);
        productVariant.setProduct(null);

        productVariantRepository.delete(productVariant);
        return productVariant;
    }

    /**
     * Scenarios:
     * 1. new product -> assign to List<Warehouse> and List<Store>
     * 2. new store -> retrieve List<Product> and assign to Store
     * 3. new warehouse -> retrieve List<Product> and assign to Warehouse
     *
     * @return void
     */
    public void assignProductStock(List<Warehouse> warehouses, List<Store> stores, ProductVariant inputProductVariant) throws InputDataValidationException, WarehouseNotFoundException, StoreNotFoundException, ProductVariantNotFoundException {
        List<ProductVariant> productVariants;
        if (inputProductVariant == null) {
            productVariants = retrieveAllProductVariant();
        } else {
            productVariants = new ArrayList<>();
            productVariants.add(inputProductVariant);
        }

        if (warehouses != null) {
            for (Warehouse w : warehouses) {
                Warehouse warehouse = warehouseService.retrieveWarehouseById(w.getWarehouseId());

                for (ProductVariant productVariant : productVariants) {
                    ProductStock productStock = new ProductStock(0, 0, 0, 0);
                    productStock.setWarehouse(warehouse);
                    ProductStock newProductStock = createProductStock(productStock, productVariant.getProductVariantId());
                    warehouse.getProductStocks().add(newProductStock);
                }
            }
        }

        if (stores != null) {
            for (Store s : stores) {
                Store store = storeService.retrieveStoreById(s.getStoreId());

                for (ProductVariant productVariant : productVariants) {
                    ProductStock productStock = new ProductStock(0, 0, 0, 0);
                    ProductStock newProductStock = createProductStock(productStock, productVariant.getProductVariantId());
                    productStock.setStore(store);
                    store.getProductStocks().add(newProductStock);
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
    public ProductStock createProductStock(ProductStock productStock, Long productVariantId) throws InputDataValidationException, ProductVariantNotFoundException {
        Map<String, String> errorMap = validationService.generateErrorMap(productStock);
        if (errorMap == null) {
            ProductVariant productVariant = retrieveProductVariantById(productVariantId);
            productStock.setProductVariant(productVariant);
            productVariant.getProductStocks().add(productStock);
            productStockRepository.save(productStock);
            return productStock;
        } else {
            throw new InputDataValidationException(errorMap, "Invalid input data");
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

    public ProductStock retrieveProductStockByStoreIdAndProductVariantId(Long storeId, Long productVariantId) {
        ProductStock productStock = null;
        if (storeId != null && productVariantId != null) {
            productStock = productStockRepository.findAllByStoreStoreIdAndProductVariantProductVariantId(storeId, productVariantId);
        }
        return productStock;
    }

    @Transactional(readOnly = true)
    public List<Product> retrieveProductStocksByParameter(Long storeId, Long warehouseId, Long productVariantId) {

        List<Product> products = new ArrayList<>(retrieveAllProducts());
        List<ProductStock> productStocks = new ArrayList<>();

        for (Product product : products) {
            for (ProductVariant productVariant : product.getProductVariants()) {
                productStocks = new ArrayList<>();

                if (productVariant != null) {

                    for (ProductStock productStock : productVariant.getProductStocks()) {

                        if (productStock.getStore() != null && productStock.getStore().getStoreId().equals(storeId) ||
                                productStock.getWarehouse() != null && productStock.getWarehouse().getWarehouseId().equals(warehouseId) ||
                                productStock.getProductVariant() != null && productStock.getProductVariant().getProductVariantId().equals(productVariantId)) {
                            productStocks.add(productStock);
                        }
                    }
                    productVariant.setProductStocks(productStocks);
                }
            }
        }
        lazilyLoadProduct(products);
        return products;
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

    public List<ProductStock> retrieveProductStockQuantityLessThanRequired(Long warehouseId) {
        List<ProductStock> productStocks = productStockRepository.findAllQuantityLessThanNotificationLevel(warehouseId);
        lazilyLoadProductStock(productStocks);
        return productStocks;
    }

    public ProductStock updateProductStock(ProductStock newProductStock) throws ProductStockNotFoundException {

        ProductStock productStock = retrieveProductStockById(newProductStock.getProductStockId());
        productStock.setQuantity(newProductStock.getQuantity());
        productStock.setMaxQuantity(newProductStock.getMaxQuantity());
        productStock.setNotificationLevel(newProductStock.getNotificationLevel());
        productStock.setQRcode(newProductStock.getQRcode());
        productStock.setReorderQuantity(newProductStock.getReorderQuantity());
        return productStock;
    }

    public ProductStock deleteProductStock(Long productStockId) throws ProductStockNotFoundException {
        ProductStock productStock = retrieveProductStockById(productStockId);
        productStock.getProductVariant().getProductStocks().remove(productStock);
        productStock.setProductVariant(null);

        if (productStock.getStore() != null) {
            productStock.getStore().getProductStocks().remove(productStock);
            productStock.setStore(null);
        }
        if (productStock.getWarehouse() != null) {
            productStock.getWarehouse().getProductStocks().remove(productStock);
            productStock.setWarehouse(null);
        }
        productStockRepository.delete(productStock);
        return productStock;
    }

    public List<ProductImage> createProductImage(List<ProductImage> productImages, Long productVariantId) throws ProductVariantNotFoundException {
        ProductVariant productVariant = retrieveProductVariantById(productVariantId);

        if (productVariant.getProductImages() != null && productVariant.getProductImages().size() > 0) {
            productVariant.getProductImages().clear();
        }

        for (ProductImage productImage : productImages) {
            productImageRepository.save(productImage);
            productVariant.getProductImages().add(productImage);
        }
        return productImages;
    }

    private void assignProductImages(List<ProductImage> productImages, List<ProductVariant> productVariants) throws ProductVariantNotFoundException, ProductImageNotFoundException {
        for (ProductVariant productVariant : productVariants) {
            productVariant.getProductImages().addAll(productImages);
        }
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

    public  List<String>  updateProductVariantImages(Long productId, String colour, List<String> imageUrls) throws ProductImageNotFoundException, ProductNotFoundException, ProductVariantNotFoundException {
        Product product = retrieveProductById(productId);

        List<ProductVariant> productVariantsToAssignImages = new ArrayList<>();
        List<ProductImage> productImages = new ArrayList<>();
        Boolean imageCreated = Boolean.FALSE;
        Integer position = 0;

        for (String imageUrl : imageUrls) {
            productImages.add(new ProductImage(imageUrl, position));
            position++;
        }

        for (ProductVariant productVariant : product.getProductVariants()) {
            if (productVariant.getColour().equals(colour)) {
                if (!imageCreated) {
                    productImages = createProductImage(productImages, productVariant.getProductVariantId());
                    imageCreated = Boolean.TRUE;
                } else {
                    productVariantsToAssignImages.add(productVariant);
                }
            }
        }
        // Associate productVariant of that matches the input colour but different sizes to the updated ProductImage
        assignProductImages(productImages, productVariantsToAssignImages);
        return imageUrls;
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

        if (categoryId == oldCategory.getCategoryId()) return;

        oldCategory.getProducts().remove(product);
        product.setCategory(newCategory);
        newCategory.getProducts().add(product);
    }

    public void addOrRemoveTag(Long tagId, Long productId, List<Tag> tags, List<Product> products) throws ProductNotFoundException, TagNotFoundException, TagNotFoundException, TagNotFoundException {
        // Adding / removing tag for a list of products
        if (tagId != null) {
            Tag tag = tagService.retrieveTagByTagId(tagId);
            List<Product> tagProducts = tag.getProducts();
            List<Product> persistentInputProducts = new ArrayList<>();

            for (Product product : products) {
                persistentInputProducts.add(retrieveProductById(product.getProductId()));
            }

            for (Product tagProduct : new ArrayList<>(tagProducts)) {
                if (persistentInputProducts.contains(tagProduct)) {
                    persistentInputProducts.remove(tagProduct);
                } else {
                    tagProduct.getTags().remove(tag);
                    tag.getProducts().remove(tagProduct);
                }
            }

            for (Product product : persistentInputProducts) {
                product.getTags().add(tag);
                tag.getProducts().add(product);
            }

        } else if (productId != null) {
            Product product = retrieveProductById(productId);
            List<Tag> productTags = product.getTags();
            List<Tag> persistentInputTags = new ArrayList<>();

            for (Tag tag : tags) {
                persistentInputTags.add(tagService.retrieveTagByTagId(tag.getTagId()));
            }

            for (Tag productTag : new ArrayList<>(productTags)) {
                if (persistentInputTags.contains(productTag)) {
                    persistentInputTags.remove(productTag);
                } else {
                    product.getTags().remove(productTag);
                    productTag.getProducts().remove(product);
                }
            }
            for (Tag tag : persistentInputTags) {
                product.getTags().add(tag);
                tag.getProducts().add(product);
            }
        }
    }

    public void addOrRemovePromoCode(Long promoCodeId, Long productId, List<PromoCode> promoCodes, List<Product> products, Boolean isAppend) throws PromoCodeNotFoundException, ProductNotFoundException, PromoCodeNotFoundException, PromoCodeNotFoundException, PromoCodeNotFoundException {
        // Adding / removing promoCode for a list of products
        if (promoCodeId != null) {
            PromoCode promoCode = promoCodeService.retrievePromoCodeById(promoCodeId);
            Product product = null;

            for (Product prod : products) {
                product = retrieveProductById(prod.getProductId());
                if (isAppend) {
                    promoCode.getProducts().add(product);
                    product.getPromoCodes().add(promoCode);
                } else {
                    promoCode.getProducts().remove(product);
                    product.getPromoCodes().remove(promoCode);
                }
            }
        }
        // Adding / removing a list of promoCodes for a product
        else if (productId != null) {
            Product product = retrieveProductById(productId);
            PromoCode promoCode = null;

            for (PromoCode code : promoCodes) {
                promoCode = promoCodeService.retrievePromoCodeById(code.getPromoCodeId());
                if (isAppend) {
                    product.getPromoCodes().add(promoCode);
                    promoCode.getProducts().add(product);
                } else {
                    product.getPromoCodes().remove(promoCode);
                    promoCode.getProducts().remove(product);
                }
            }
        }
    }

    public void addOrRemoveDiscount(Long discountId, Long productId, List<Discount> discounts, List<Product> products, Boolean isAppend) throws ProductNotFoundException, DiscountNotFoundException, DiscountNotFoundException, DiscountNotFoundException, DiscountNotFoundException {
        // Adding / removing discount for a list of products
        if (discountId != null) {
            Discount discount = discountService.retrieveDiscountById(discountId);
            Product product = null;

            for (Product prod : products) {
                product = retrieveProductById(prod.getProductId());
                if (isAppend) {
                    discount.getProducts().add(product);
                    product.getDiscounts().add(discount);
                } else {
                    discount.getProducts().remove(product);
                    product.getDiscounts().remove(discount);
                }
            }
        }
        // Adding / removing a list of discounts for a product
        else if (productId != null) {
            Product product = retrieveProductById(productId);
            Discount discount = null;
            for (Discount disc : discounts) {
                discount = discountService.retrieveDiscountById(disc.getDiscountId());
                if (isAppend) {
                    product.getDiscounts().add(discount);
                    discount.getProducts().add(product);
                } else {
                    product.getDiscounts().remove(discount);
                    discount.getProducts().remove(product);
                }
            }
        }
    }

    public void addOrRemoveStyle(Long styleId, Long productId, List<Style> styles, List<Product> products) throws ProductNotFoundException, TagNotFoundException, StyleNotFoundException {
        // Adding / removing style for a list of products
        if (styleId != null) {
            Style style = styleService.retrieveStyleByStyleId(styleId);
            List<Product> styleProducts = style.getProducts();
            List<Product> persistentInputProducts = new ArrayList<>();

            for (Product product : products) {
                // draw products from db and keep in inputProducts
                persistentInputProducts.add(retrieveProductById(product.getProductId()));
            }

            for (Product styleProduct : new ArrayList<>(styleProducts)) {
                if (persistentInputProducts.contains(styleProduct)) {
                    persistentInputProducts.remove(styleProduct);
                } else {
                    styleProduct.getStyles().remove(style);
                    style.getProducts().remove(styleProduct);
                }
            }

            for (Product product : persistentInputProducts) {
                product.getStyles().add(style);
                style.getProducts().add(product);
            }

        } else if (productId != null) {
            Product product = retrieveProductById(productId);
            List<Style> productStyles = product.getStyles();
            List<Style> persistentInputStyles = new ArrayList<>();

            for (Style style : styles) {
                // draw style from db and keep in inputStyles
                persistentInputStyles.add(styleService.retrieveStyleByStyleId(style.getStyleId()));
            }

            for (Style productStyle : new ArrayList<>(productStyles)) {
                if (persistentInputStyles.contains(productStyle)) {
                    persistentInputStyles.remove(productStyle);
                } else {
                    product.getStyles().remove(productStyle);
                    productStyle.getProducts().remove(product);
                }
            }

            for (Style style : persistentInputStyles) {
                product.getStyles().add(style);
                style.getProducts().add(product);
            }
        }
    }
}