package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.request.productVariant.ProductVariantCreateRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductVariantException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.ProductVariantControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ProductVariantControllerRoutes.PRODUCT_VARIANT_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class ProductVariantController {

    private final ProductService productService;

    public ProductVariantController(ProductService productService) {
        this.productService = productService;
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

    @PostMapping(ProductVariantControllerRoutes.CREATE_NEW_PRODUCT_VARIANT)
    public ResponseEntity<?> createNewProductVariant(@RequestBody ProductVariantCreateRequest productVariantCreateRequest) {
        try {
            ProductVariant productVariant = productService.createProductVariant(productVariantCreateRequest.getProductVariant(), productVariantCreateRequest.getProductId());
            return new ResponseEntity<>(productVariant, HttpStatus.CREATED);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (CreateNewProductVariantException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (ProductNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    public ResponseEntity<?> deleteProductVariant(@PathVariable Long productVariantId) {
        try {
            ProductVariant productVariant = productService.deleteProductVariant(productVariantId);
            return new ResponseEntity<>(productVariant, HttpStatus.OK);
        } catch (ProductVariantNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
