package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.request.product.ProductCreateRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = {"http://localhost:3000"})
public class ProductController {

    @Autowired
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/retrieveProductById/{productId}")
    public ResponseEntity<?> retrieveProductById(@PathVariable Long productId) {
        try {
            Product product = productService.retrieveProductById(productId);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (ProductNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/retrieveAllProduct")
    public ResponseEntity<?> retrieveAllProduct() {
        try {
            List<Product> products = productService.retrieveAllProducts();
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/createNewProduct")
    public ResponseEntity<?> createNewProduct(@RequestBody ProductCreateRequest productCreateRequest) {
        try {
            Product newProduct = productService.createNewProduct(productCreateRequest.getProduct(),
                    productCreateRequest.getCategoryId(), null);
            return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (CreateNewProductException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateProduct")
    public ResponseEntity<?> updateProduct(@RequestBody Product newProduct) {
        try {
            Product product = productService.updateProduct(newProduct);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (ProductNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PutMapping("/addOrRemovePromoCodeToAProduct")
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
//    @PutMapping("/addOrRemovePromoCodeForAListOfProducts")
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
//    @PutMapping("/addOrRemoveTagToAProduct")
//    public ResponseEntity<?> addOrRemoveTagToAProduct(@RequestBody ProductTagRequest productTagRequest) {
//        try {
//            if (productTagRequest.getIsAppend()) {
//                productService.addOrRemoveTag(null, productTagRequest.getProductId(),
//                        productTagRequest.getTagIds(), null, true);
//                return new ResponseEntity<>(new GenericErrorResponse("Success!"), HttpStatus.CREATED);
//            } else {
//                productService.addOrRemoveTag(null, productTagRequest.getProductId(),
//                        productTagRequest.getTagIds(), null, false);
//                return new ResponseEntity<>(new GenericErrorResponse("Failed"), HttpStatus.CREATED);
//            }
//        } catch (ProductNotFoundException ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
//        } catch (TagNotFoundException ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
//        } catch (Exception ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @PutMapping("/addOrRemoveTagForAListOfProducts")
//    public ResponseEntity<?> addOrRemoveTagForAListOfProducts(@RequestBody ProductTagRequest productTagRequest) {
//        try {
//            if (productTagRequest.getIsAppend()) {
//                productService.addOrRemoveTag(productTagRequest.getTagId(), null,
//                        null, productTagRequest.getProductIds(), true);
//                return new ResponseEntity<>(new GenericErrorResponse("Success!"), HttpStatus.CREATED);
//            } else {
//                productService.addOrRemoveTag(productTagRequest.getTagId(), null,
//                        null, productTagRequest.getProductIds(), true);
//                return new ResponseEntity<>(new GenericErrorResponse("Failed"), HttpStatus.CREATED);
//            }
//        } catch (ProductNotFoundException ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
//        } catch (TagNotFoundException ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
//        } catch (Exception ex) {
//            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @DeleteMapping("/deleteProduct/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        try {
            Product product = productService.deleteProduct(productId);
            return new ResponseEntity<>(product, HttpStatus.CREATED);
        } catch (ProductNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
