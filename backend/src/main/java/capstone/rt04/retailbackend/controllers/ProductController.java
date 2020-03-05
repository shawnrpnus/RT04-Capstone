package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.request.algolia.AlgoliaProductDetailsResponse;
import capstone.rt04.retailbackend.request.product.ProductCreateRequest;
import capstone.rt04.retailbackend.request.product.ProductRetrieveRequest;
import capstone.rt04.retailbackend.request.product.ProductTagRequest;
import capstone.rt04.retailbackend.response.ColourToSizeImageMap;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.response.ProductDetailsResponse;
import capstone.rt04.retailbackend.response.SizeToProductVariantAndStockMap;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.*;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.TagNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.ProductControllerRoutes;
import com.algolia.search.SearchIndex;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(ProductControllerRoutes.PRODUCT_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
@Slf4j
public class ProductController {

    private final ProductService productService;

    @Autowired
    private SearchIndex<AlgoliaProductDetailsResponse> index;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping(ProductControllerRoutes.RETRIEVE_PRODUCT_BY_ID)
    public ResponseEntity<?> retrieveProductById(@PathVariable Long productId) throws ProductNotFoundException {
        try {
            List<ProductDetailsResponse> products = productService.retrieveProductsDetails(null, productId, null);
            if (products.size() == 0) throw new ProductNotFoundException();
            clearPdrRelationships(products, true);
            return new ResponseEntity<>(products.get(0), HttpStatus.OK);
        } catch (ProductNotFoundException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @GetMapping(ProductControllerRoutes.RETRIEVE_PRODUCTS_BY_CRITERIA)
//    public ResponseEntity<?> retrieveProductsByCriteria(@RequestBody ProductRetrieveRequest productRetrieveRequest) {
//            List<Product> products = productService.retrieveProductByCriteria(productRetrieveRequest.getCategory(), productRetrieveRequest.getTags(),
//                    productRetrieveRequest.getColours(), productRetrieveRequest.getSizes(),
//                    productRetrieveRequest.getMinPrice(), productRetrieveRequest.getMaxPrice(), productRetrieveRequest.getSortEnum());
//            return new ResponseEntity<>(products, HttpStatus.OK);
//    }

    @GetMapping(ProductControllerRoutes.RETRIEVE_PRODUCTS_DETAILS)
    public ResponseEntity<?> retrieveProductsDetails(@RequestParam(required = false) Long storeOrWarehouseId, @RequestParam(required = false) Long categoryId) throws ProductNotFoundException {
        if (categoryId != null) {
            List<ProductDetailsResponse> products = productService.retrieveProductDetailsForCategory(storeOrWarehouseId, categoryId);
            clearPdrRelationships(products, false);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } else {
            List<ProductDetailsResponse> products = productService.retrieveProductsDetails(storeOrWarehouseId, null, null);
            clearPdrRelationships(products, false);
            return new ResponseEntity<>(products, HttpStatus.OK);
        }
    }


    @PostMapping(ProductControllerRoutes.RETRIEVE_PRODUCTS_DETAILS_BY_CRITERIA)
    public ResponseEntity<?> retrieveProductsDetailsByCriteria(@RequestBody ProductRetrieveRequest productRetrieveRequest) throws ProductNotFoundException, StyleNotFoundException {
        List<ProductDetailsResponse> products = productService.retrieveProductsDetailsByCriteria(productRetrieveRequest.getCategoryId(),
                productRetrieveRequest.getTags(), productRetrieveRequest.getColours(), productRetrieveRequest.getSizes(),
                productRetrieveRequest.getMinPrice(), productRetrieveRequest.getMaxPrice(),
                productRetrieveRequest.getSortEnum(), productRetrieveRequest.getStyle());
        clearPdrRelationships(products, false);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping(ProductControllerRoutes.RETRIEVE_ALL_PRODUCTS)
    public ResponseEntity<?> retrieveAllProducts() {
        try {
            List<Product> products = productService.retrieveAllProducts();
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(ProductControllerRoutes.CREATE_PRODUCT)
    public ResponseEntity<?> createProduct(@RequestBody ProductCreateRequest productCreateRequest) {
        try {
            Product newProduct = productService.createNewProduct(productCreateRequest.getProduct(),
                    productCreateRequest.getCategoryId(), productCreateRequest.getTagIds(), productCreateRequest.getStyleIds(),
                    productCreateRequest.getSizes(), productCreateRequest.getColourToImageUrlsMaps());
            clearSingleProductRelationship(newProduct);
            return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (CreateNewProductException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(ProductControllerRoutes.UPDATE_PRODUCT)
    public ResponseEntity<?> updateProduct(@RequestBody Product newProduct) throws ProductNotFoundException, CategoryNotFoundException,
            TagNotFoundException, StyleNotFoundException {
        Product product = productService.updateProduct(newProduct);
        clearSingleProductRelationship(product);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }



    //    @PutMapping(ProductControllerRoutes.ADD_REMOVE_PROMOCODE_TO_A_PRODUCT)
//    public ResponseEntity<?> addOrRemovePromoCodeToAProduct(@RequestBody ProductPromoCodeRequest productPromoCodeRequest) {
//        try {
//            if (productPromoCodeRequest.getIsAppend()) {
//                productService.addOrRemovePromoCode(null, productPromoCodeRequest.getProductId(),
//                        productPromoCodeRequest.getPromoCodeIds(), null, true);
//                return new ResponseEntity<>(new GenericErrorResponse("Promo code(s) successfully added to product"), HttpStatus.CREATED);
//            } else {
//                productService.addOrRemovePromoCode(null, productPromoCodeRequest.getProductId(),
//                        productPromoCodeRequest.getPromoCodeIds(), null, false);
//                return new ResponseEntity<>(new GenericErrorResponse("Promo code(s) successfully removed from product"), HttpStatus.CREATED);
//            }
//        } catch (PromoCodeNotFoundException ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
//        } catch (ProductNotFoundException ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
//        } catch (Exception ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @PutMapping(ProductControllerRoutes.ADD_REMOVE_PROMOCODE_FOR_A_LIST_OF_PRODUCTS)
//    public ResponseEntity<?> addOrRemovePromoCodeForAListOfProducts(@RequestBody ProductPromoCodeRequest productPromoCodeRequest) {
//        try {
//            if (productPromoCodeRequest.getIsAppend()) {
//                productService.addOrRemovePromoCode(null, null, null, null, true);
//                return new ResponseEntity<>(new GenericErrorResponse("Promo code(s) successfully added to product"), HttpStatus.CREATED);
//            } else {
//                productService.addOrRemovePromoCode(productPromoCodeRequest.getPromoCodeId(), null, null, null, false);
//                return new ResponseEntity<>(new GenericErrorResponse("Promo code(s) successfully removed from product"), HttpStatus.CREATED);
//            }
//        } catch (PromoCodeNotFoundException ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
//        } catch (ProductNotFoundException ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
//        } catch (Exception ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
    @PutMapping(ProductControllerRoutes.ADD_REMOVE_TAG_TO_PRODUCT)
    public ResponseEntity<?> addOrRemoveTagToAProduct(@RequestBody ProductTagRequest productTagRequest) throws ProductNotFoundException, TagNotFoundException {
        productService.addOrRemoveTag(null, productTagRequest.getProductId(),
                productTagRequest.getTags(), null);
        return new ResponseEntity<>(new GenericErrorResponse("Success!"), HttpStatus.OK);
    }

    @PutMapping(ProductControllerRoutes.ADD_REMOVE_TAG_FOR_A_LIST_OF_PRODUCTS)
    public ResponseEntity<?> addOrRemoveTagForAListOfProducts(@RequestBody ProductTagRequest productTagRequest) throws ProductNotFoundException, TagNotFoundException {
        productService.addOrRemoveTag(productTagRequest.getTagId(), null,
                null, productTagRequest.getProducts());
        return new ResponseEntity<>(new GenericErrorResponse("Success!"), HttpStatus.OK);
    }

    @DeleteMapping(ProductControllerRoutes.DELETE_PRODUCT)
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) throws ProductVariantNotFoundException, ProductStockNotFoundException, ProductNotFoundException, DeleteProductVariantException {
        Product product = productService.deleteProduct(productId);
        clearSingleProductRelationship(product);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping(ProductControllerRoutes.UPDATE_ALGOLIA)
    public ResponseEntity<?> updateAlgolia() throws ProductNotFoundException {
        List<ProductDetailsResponse> PDRs = productService.retrieveProductsDetails(null, null, null);

        clearPdrRelationships(PDRs, false);

        List<AlgoliaProductDetailsResponse> aPDRs = new ArrayList<>();

        for (ProductDetailsResponse PDR : PDRs){
            AlgoliaProductDetailsResponse aPDR = new AlgoliaProductDetailsResponse();
            aPDR.setObjectID(PDR.getProduct().getProductId());
            aPDR.setProduct(PDR.getProduct());
            aPDR.setColourToSizeImageMaps(PDR.getColourToSizeImageMaps());
            aPDR.setLeafNodeName(PDR.getLeafNodeName());
            aPDRs.add(aPDR);
        }

// Sync version
        index.replaceAllObjects(aPDRs, true);
        log.info("Algolia index updated");

        return new ResponseEntity<>("Aloglia index updated", HttpStatus.OK);
    }

    private void clearSingleProductRelationship(Product product){
        for (ProductVariant pv: product.getProductVariants()){
            pv.setProductStocks(null);
        }
        for (Tag tag : product.getTags()) {
            tag.setProducts(null);
        }
        product.getCategory().setProducts(null);
        product.getCategory().setParentCategory(null);
        product.getCategory().setChildCategories(null);
    }

    private void clearPdrRelationships(List<ProductDetailsResponse> PDRs, boolean needProductProductVariants) {
        for (ProductDetailsResponse pdr : PDRs) {
            if (!needProductProductVariants) {
                pdr.getProduct().setProductVariants(null);
            } else {
                for (ProductVariant pv: pdr.getProduct().getProductVariants()){
                    pv.setProductStocks(null);
                }
            }
            for (Tag tag : pdr.getProduct().getTags()) {
                tag.setProducts(null);
            }
            pdr.getProduct().getCategory().setProducts(null);
            pdr.getProduct().getCategory().setParentCategory(null);
            pdr.getProduct().getCategory().setChildCategories(null);
            for (ColourToSizeImageMap csiMap : pdr.getColourToSizeImageMaps()) {
                for (SizeToProductVariantAndStockMap spvsMap : csiMap.getSizeMaps()) {
                    if (spvsMap.getProductStock() != null) {
                        spvsMap.getProductStock().setStore(null);
                        if (spvsMap.getProductStock().getProductVariant() != null) {
                            spvsMap.getProductStock().getProductVariant().setProductStocks(null);
                            spvsMap.getProductStock().getProductVariant().setProductImages(null);
                            spvsMap.getProductStock().getProductVariant().setProduct(null);
                            spvsMap.getProductStock().getProductVariant().setSizeDetails(null);
                            spvsMap.getProductStock().setWarehouse(null);
                        }
                    }
                }
            }
        }
    }


}
