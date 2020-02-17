package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.services.WarehouseService;
import capstone.rt04.retailbackend.util.routeconstants.WarehouseControllerRoutes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(WarehouseControllerRoutes.WAREHOUSE_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class WarehouseController {

    @Autowired
    private final WarehouseService warehouseService;
    @Autowired
    private final ProductService productService;

    public WarehouseController(WarehouseService warehouseService, ProductService productService) {
        this.warehouseService = warehouseService;
        this.productService = productService;
    }

    @GetMapping(WarehouseControllerRoutes.RETRIEVE_ALL_WAREHOUSE_INVENTORIES)
    public ResponseEntity<?> retrieveAllWarehouseInventories(@RequestParam Long warehouseId) {
        List<ProductStock> productStocks = productService.retrieveProductStocksByParameter(null, warehouseId, null);
        return new ResponseEntity<>(productStocks, HttpStatus.OK);
    }

    @GetMapping(WarehouseControllerRoutes.RETRIEVE_WAREHOUSE_INVENTORY)
    public ResponseEntity<?> retrieveWarehouseInventory(@RequestParam Long warehouseId, @RequestParam Long productId) {
        List<ProductVariant> productVariants = productService.retrieveProductVariantByProduct(productId);

        return new ResponseEntity<>(productVariants, HttpStatus.OK);
    }
}
