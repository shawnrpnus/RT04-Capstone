package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.entities.Warehouse;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.services.WarehouseService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes;
import capstone.rt04.retailbackend.util.routeconstants.WarehouseControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(WarehouseControllerRoutes.WAREHOUSE_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class WarehouseController {

    private final WarehouseService warehouseService;
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

    @GetMapping(WarehouseControllerRoutes.RETRIEVE_WAREHOUSE_DETAILS_BY_ID)
    public ResponseEntity<?> retrieveWarehouseDetailsByID(@RequestParam Long warehouseId) {
        List<ProductStock> productStocks = productService.retrieveProductStocksByParameter(null, warehouseId, null);
        return new ResponseEntity<>(productStocks, HttpStatus.OK);
    }

    @PostMapping(WarehouseControllerRoutes.UPDATE_WAREHOUSE)
    public ResponseEntity<?> updateWarehouse(@RequestBody Warehouse warehouse) throws WarehouseNotFoundException {
        Warehouse updatedWarehouse = warehouseService.updateWarehouse(warehouse);
        return new ResponseEntity<>(updatedWarehouse, HttpStatus.OK);
    }


}