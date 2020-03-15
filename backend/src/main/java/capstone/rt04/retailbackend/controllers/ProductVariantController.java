package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.request.productVariant.ProductVariantCreateRequest;
import capstone.rt04.retailbackend.request.productVariant.RetrieveBySkuRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.*;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.ProductVariantControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ProductVariantControllerRoutes.PRODUCT_VARIANT_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ProductVariantController {

    private final ProductService productService;
    private final ValidationService validationService;

    public ProductVariantController(ProductService productService, ValidationService validationService) {
        this.productService = productService;
        this.validationService = validationService;
    }

    @GetMapping(ProductVariantControllerRoutes.RETRIEVE_PRODUCT_VARIANT_BY_ID)
    public ResponseEntity<?> retrieveProductVariantById(@PathVariable Long productVariantId) {
        try {
            ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
            return new ResponseEntity<>(productVariant, HttpStatus.OK);
        } catch (ProductVariantNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(ProductVariantControllerRoutes.RETRIEVE_PRODUCT_VARIANT_BY_PRODUCT)
    public ResponseEntity<?> retrieveProductVariantByProduct(@PathVariable Long productId) {
        try {
            List<ProductVariant> productVariant = productService.retrieveProductVariantByProduct(productId);
            return new ResponseEntity<>(productVariant, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(ProductVariantControllerRoutes.RETRIEVE_ALL_PRODUCT_VARIANTS)
    public ResponseEntity<?> retrieveAllProductVariants() {
        try {
            List<ProductVariant> productVariants = productService.retrieveAllProductVariant();
            return new ResponseEntity<>(productVariants, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(ProductVariantControllerRoutes.CREATE_MULTIPLE_PRODUCT_VARIANTS)
    public ResponseEntity<?> createMultipleProductVariants(@RequestBody ProductVariantCreateRequest productVariantCreateRequest) throws WarehouseNotFoundException, ProductNotFoundException, ProductVariantNotFoundException, InputDataValidationException, CreateNewProductStockException, StoreNotFoundException, ProductImageNotFoundException {
        List<ProductVariant> productVariants = productService.createMultipleProductVariants(productVariantCreateRequest.getProductId(), productVariantCreateRequest.getColourToImageUrlsMaps(),
                productVariantCreateRequest.getSizes());
        return new ResponseEntity<>(productVariants, HttpStatus.CREATED);
    }

    @PutMapping(ProductVariantControllerRoutes.UPDATE_PRODUCT_VARIANT)
    public ResponseEntity<?> updateProductVariant(@RequestBody ProductVariant productVariant) {
        try {
            ProductVariant newProductVariant = productService.updateProductVariant(productVariant);
            return new ResponseEntity<>(newProductVariant, HttpStatus.OK);
        } catch (ProductVariantNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(ProductVariantControllerRoutes.DELETE_PRODUCT_VARIANT)
    public ResponseEntity<?> deleteProductVariant(@PathVariable Long productVariantId) throws ProductVariantNotFoundException, ProductStockNotFoundException, DeleteProductVariantException {
        ProductVariant productVariant = productService.deleteProductVariant(productVariantId);
        return new ResponseEntity<>(productVariant, HttpStatus.OK);
    }

    @PostMapping(ProductVariantControllerRoutes.RETRIEVE_PRODUCT_VARIANT_BY_SKU)
    public ResponseEntity<?> retrieveProdVarBySku(@RequestBody RetrieveBySkuRequest req) throws ProductVariantNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(req);
        ProductVariant pv = productService.retrieveProductVariantBySku(req.getSku());
        clearProductVariantRelationships(pv);
        return new ResponseEntity<>(pv, HttpStatus.OK);
    }

    @GetMapping(ProductVariantControllerRoutes.RETRIEVE_STOCKS_FOR_PROD_VARIANT)
    public List<Map<String, String>> retrieveStocksForProductVariant(@RequestParam Long productVariantId) throws ProductVariantNotFoundException {
        return productService.retrieveStocksForProductVariant(productVariantId);
    }

    @GetMapping(ProductVariantControllerRoutes.RETRIEVE_ALL_SKUS)
    public List<String> retrieveAllSku(){
        return productService.retrieveProductVariantSKUs();
    }

    private void clearProductVariantRelationships(ProductVariant pv){
        Product p = pv.getProduct();
        p.setCategory(null);
        p.setStyles(null);
        p.setPromoCodes(null);
        p.setReviews(null);
        p.setTags(null);
        p.setProductVariants(null);
        pv.setProductStocks(null);
    }
}
