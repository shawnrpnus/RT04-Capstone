package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.request.algolia.AlgoliaProductDetailsResponse;
import capstone.rt04.retailbackend.request.product.ProductCreateRequest;
import capstone.rt04.retailbackend.request.product.ProductRetrieveRequest;
import capstone.rt04.retailbackend.request.product.ProductTagRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.response.ProductDetailsResponse;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(ProductControllerRoutes.PRODUCT_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final RelationshipService relationshipService;
    @Autowired
    private SearchIndex<AlgoliaProductDetailsResponse> index;

    public ProductController(ProductService productService, RelationshipService relationshipService) {
        this.productService = productService;
        this.relationshipService = relationshipService;
    }

    @GetMapping(ProductControllerRoutes.RETRIEVE_PRODUCT_BY_ID)
    public ResponseEntity<?> retrieveProductById(@PathVariable Long productId) throws IOException, ProductNotFoundException {
        List<ProductDetailsResponse> products = productService.retrieveProductsDetails(null, productId, null);
        if (products.size() == 0) throw new ProductNotFoundException();
        relationshipService.clearPdrRelationships(products, true);
        for(ProductDetailsResponse response:products) {
            relationshipService.clearPdrRelationships(response.getRecommendedProducts(), false);
        }
        return new ResponseEntity<>(products.get(0), HttpStatus.OK);
    }

//    @GetMapping(ProductControllerRoutes.RETRIEVE_PRODUCTS_BY_CRITERIA)
//    public ResponseEntity<?> retrieveProductsByCriteria(@RequestBody ProductRetrieveRequest productRetrieveRequest) {
//            List<Product> products = productService.retrieveProductByCriteria(productRetrieveRequest.getCategory(), productRetrieveRequest.getTags(),
//                    productRetrieveRequest.getColours(), productRetrieveRequest.getSizes(),
//                    productRetrieveRequest.getMinPrice(), productRetrieveRequest.getMaxPrice(), productRetrieveRequest.getSortEnum());
//            return new ResponseEntity<>(products, HttpStatus.OK);
//    }

    @GetMapping(ProductControllerRoutes.RETRIEVE_PRODUCTS_DETAILS)
    public ResponseEntity<?> retrieveProductsDetails(@RequestParam(required = false) Long storeOrWarehouseId, @RequestParam(required = false) Long categoryId) throws ProductNotFoundException, IOException {
        if (categoryId != null) {
            List<ProductDetailsResponse> products = productService.retrieveProductDetailsForCategory(storeOrWarehouseId, categoryId);
            relationshipService.clearPdrRelationships(products, false);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } else {
            List<ProductDetailsResponse> products = productService.retrieveProductsDetails(storeOrWarehouseId, null, null);
            relationshipService.clearPdrRelationships(products, false);
            return new ResponseEntity<>(products, HttpStatus.OK);
        }
    }


    @PostMapping(ProductControllerRoutes.RETRIEVE_PRODUCTS_DETAILS_BY_CRITERIA)
    public ResponseEntity<?> retrieveProductsDetailsByCriteria(@RequestBody ProductRetrieveRequest productRetrieveRequest) throws ProductNotFoundException, StyleNotFoundException, IOException {
        List<ProductDetailsResponse> products = productService.retrieveProductsDetailsByCriteria(productRetrieveRequest.getCategoryId(),
                productRetrieveRequest.getTags(), productRetrieveRequest.getColours(), productRetrieveRequest.getSizes(),
                productRetrieveRequest.getMinPrice(), productRetrieveRequest.getMaxPrice(),
                productRetrieveRequest.getSortEnum(), productRetrieveRequest.getStyle());
        relationshipService.clearPdrRelationships(products, false);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // For Instagram list to associate products to instagram post
    @GetMapping(ProductControllerRoutes.RETRIEVE_ALL_PRODUCTS)
    public ResponseEntity<?> retrieveAllProducts() {
        List<Product> products = productService.retrieveAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
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
    public ResponseEntity<?> updateAlgolia() throws ProductNotFoundException, IOException {
        List<ProductDetailsResponse> PDRs = productService.retrieveProductsDetails(null, null, null);

        relationshipService.clearPdrRelationships(PDRs, false);

        List<AlgoliaProductDetailsResponse> aPDRs = new ArrayList<>();

        for (ProductDetailsResponse PDR : PDRs) {
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

    private void clearSingleProductRelationship(Product product) {
        for (ProductVariant pv : product.getProductVariants()) {
            pv.setProductStocks(null);
        }
        for (Tag tag : product.getTags()) {
            tag.setProducts(null);
        }
        product.getCategory().setProducts(null);
        product.getCategory().setParentCategory(null);
        product.getCategory().setChildCategories(null);
    }


}
