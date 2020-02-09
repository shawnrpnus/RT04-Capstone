package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.ProductImage;
import capstone.rt04.retailbackend.request.productImage.ProductImageCreateRequest;
import capstone.rt04.retailbackend.request.productImage.ProductImageDeleteRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.util.exceptions.product.ProductImageNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = {"http://localhost:3000"})
public class ProductImageController {

    private final ProductService productService;

    public ProductImageController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/retrieveProductImageById/{productImageId}")
    public ResponseEntity<?> retrieveProductImageById(@PathVariable Long productImageId) {
        try {
            ProductImage productImage = productService.retrieveProductImageById(productImageId);
            return new ResponseEntity<>(productImage, HttpStatus.OK);
        } catch (ProductImageNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/retrieveProductImageByProductVariant/{productVariantId}")
    public ResponseEntity<?> retrieveProductImageByProductVariant(@PathVariable Long productVariantId) {
        try {
            List<ProductImage> productImages = productService.retrieveProductImageByProductVariant(productVariantId);
            return new ResponseEntity<>(productImages, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/createProductImage")
    public ResponseEntity<?> createProductImage(@RequestBody ProductImageCreateRequest productImageCreateRequest) {
        try {
            List<ProductImage> productImages = productService.createProductImage(productImageCreateRequest.getProductImages(),
                    productImageCreateRequest.getProductVariantId());
            return new ResponseEntity<>(productImages, HttpStatus.CREATED);
        } catch (ProductVariantNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateProductImage")
    public ResponseEntity<?> updateProductImage(@RequestBody ProductImage productImage) {
        try {
            ProductImage newProductImage = productService.updateProductImage(productImage);
            return new ResponseEntity<>(newProductImage, HttpStatus.OK);
        } catch (ProductImageNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteProductImage/{productImageId}")
    public ResponseEntity<?> deleteProductImage(@PathVariable ProductImageDeleteRequest productImageDeleteRequest) {
        try {
            ProductImage productImage = productService.deleteProductImage(productImageDeleteRequest.getProductImageId(),
                    productImageDeleteRequest.getProductVariantId());
            return new ResponseEntity<>(productImage, HttpStatus.CREATED);
        } catch (ProductVariantNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (ProductImageNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
