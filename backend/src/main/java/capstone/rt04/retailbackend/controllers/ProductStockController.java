package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.request.productStock.ProductStockCreateRequest;
import capstone.rt04.retailbackend.request.productStock.ProductStockQtyUpdateRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.ProductStockControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ProductStockControllerRoutes.PRODUCT_STOCK_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class ProductStockController {

    private final ProductService productService;

    public ProductStockController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping(ProductStockControllerRoutes.RETRIEVE_PRODUCT_STOCK_BY_ID)
    public ResponseEntity<?> retrieveProductStockById(@PathVariable Long productStockId) {
        try {
            ProductStock productStock = productService.retrieveProductStockById(productStockId);
            return new ResponseEntity<>(productStock, HttpStatus.OK);
        } catch (ProductStockNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Returning product with filtered result instead of product stock to allow traversing down instead of up
    @GetMapping(ProductStockControllerRoutes.RETRIEVE_PRODUCT_STOCKS_THROUGH_PRODUCT_BY_PARAMETER)
    public ResponseEntity<?> retrieveProductStocksThroughProductByParameter(@RequestParam(required = false) Long warehouseId,
                                                                            @RequestParam(required = false) Long storeId,
                                                                            @RequestParam(required = false) Long productVariantId) {
        try {
            List<Product> products = productService.retrieveProductStocksByParameter(storeId,
                    warehouseId, productVariantId);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(ProductStockControllerRoutes.CREATE_PRODUCT_STOCK)
    public ResponseEntity<?> createProductStock(@RequestBody ProductStockCreateRequest productStockCreateRequest) throws ProductVariantNotFoundException, InputDataValidationException {
        ProductStock productStock = productService.createProductStock(productStockCreateRequest.getProductStock(), productStockCreateRequest.getProductVariantId());
        return new ResponseEntity<>(productStock, HttpStatus.CREATED);
    }

    @PutMapping(ProductStockControllerRoutes.UPDATE_PRODUCT_STOCK)
    public ResponseEntity<?> updateProductStock(@RequestBody ProductStock productStock) {
        try {
            ProductStock newProductStock = productService.updateProductStock(productStock);
            return new ResponseEntity<>(newProductStock, HttpStatus.OK);
        } catch (ProductStockNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(ProductStockControllerRoutes.UPDATE_PRODUCT_STOCK_QTY)
    public ResponseEntity<?> updateProductStockQty(@RequestBody ProductStockQtyUpdateRequest productStockQtyUpdateRequest) throws ProductStockNotFoundException {
        ProductStock updateProductStock = productService.updateProductStockQty(productStockQtyUpdateRequest.getProductStockId(), productStockQtyUpdateRequest.getQty());
        return new ResponseEntity<>(updateProductStock, HttpStatus.OK);
    }

    @DeleteMapping(ProductStockControllerRoutes.DELETE_PRODUCT_STOCK)
    public ResponseEntity<?> deleteProductStock(@PathVariable Long productStockId) {
        try {
            ProductStock productStock = productService.deleteProductStock(productStockId);
            return new ResponseEntity<>(productStock, HttpStatus.OK);
        } catch (ProductStockNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
