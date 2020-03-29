package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.ProductImage;
import capstone.rt04.retailbackend.request.productImage.ProductImageCreateRequest;
import capstone.rt04.retailbackend.request.productImage.ProductImageDeleteRequest;
import capstone.rt04.retailbackend.request.productImage.ProductImageUpdateRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.util.exceptions.product.ProductImageNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.ProductImageControllerRoutes.*;

@RestController
@RequestMapping(PRODUCT_IMAGE_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ProductImageController {

    private final ProductService productService;

    public ProductImageController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping(RETRIEVE_PRODUCT_IMAGE_BY_ID)
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

    @GetMapping(RETRIEVE_PRODUCT_IMAGES_BY_PRODUCT_VARIANT)
    public ResponseEntity<?> retrieveProductImagesByProductVariant(@PathVariable Long productVariantId) {
        try {
            List<ProductImage> productImages = productService.retrieveProductImageByProductVariant(productVariantId);
            return new ResponseEntity<>(productImages, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(CREATE_PRODUCT_IMAGE)
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

    @PutMapping(UPDATE_PRODUCT_IMAGE)
    public ResponseEntity<?> updateProductVariantImages(@RequestBody ProductImageUpdateRequest productImageUpdateRequest) throws ProductNotFoundException,
            ProductVariantNotFoundException, ProductImageNotFoundException {

            List<String> imageUrls = productService.updateProductVariantImages(productImageUpdateRequest.getProductId(),
                    productImageUpdateRequest.getColour(), productImageUpdateRequest.getImageUrls());
            return new ResponseEntity<>(imageUrls, HttpStatus.OK);
    }

    @DeleteMapping(DELETE_PRODUCT_IMAGES)
    public ResponseEntity<?> deleteProductImage(@RequestBody ProductImageDeleteRequest productImageDeleteRequest) {
        try {
            List<ProductImage> productImages = productService.deleteProductImage(productImageDeleteRequest.getProductImages(),
                    productImageDeleteRequest.getProductVariantId());
            return new ResponseEntity<>(productImages, HttpStatus.OK);
        } catch (ProductVariantNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (ProductImageNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
