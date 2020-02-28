package capstone.rt04.retailbackend.services;


import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.entities.Warehouse;
import capstone.rt04.retailbackend.repositories.AddressRepository;
import capstone.rt04.retailbackend.repositories.WarehouseRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
public class WarehouseService {
    private final ValidationService validationService;
    private final WarehouseRepository warehouseRepository;
    private final AddressRepository addressRepository;
    private final ProductService productService;

    public WarehouseService(WarehouseRepository warehouseRepository, AddressRepository addressRepository,
                            ValidationService validationService, @Lazy ProductService productService) {
        this.warehouseRepository = warehouseRepository;
        this.addressRepository = addressRepository;
        this.validationService = validationService;
        this.productService = productService;
    }


    public Warehouse createWarehouse(Warehouse warehouse, Address address) throws InputDataValidationException, StoreNotFoundException, WarehouseNotFoundException, ProductVariantNotFoundException {
        validationService.throwExceptionIfInvalidBean(address);

        Address a = addressRepository.save(address);
        warehouse.setAddress(a);
        warehouseRepository.save(warehouse);

        productService.assignProductStock(makeList(warehouse), null,null);
        return warehouse;
    }


    public Warehouse retrieveWarehouseById(Long warehouseId) throws WarehouseNotFoundException {
        if (warehouseId == null) {
            throw new WarehouseNotFoundException("Warehouse ID not provided. Please try again!");
        }
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new WarehouseNotFoundException("Warehouse with id: " + warehouseId + " does not exist"));
        lazilyLoadWarehouse(makeList(warehouse));
        return warehouse;
    }

    public List<Warehouse> retrieveAllWarehouses() {
        List<Warehouse> warehouses = warehouseRepository.findAll();
        lazilyLoadWarehouse(warehouses);
        return warehouses;
    }

    public Warehouse updateWarehouse(Warehouse warehouse) throws WarehouseNotFoundException {
        Warehouse newWareHouse = retrieveWarehouseById(warehouse.getWarehouseId());
        newWareHouse.setDayOfMonth(warehouse.getDayOfMonth());
        newWareHouse.setAddress(warehouse.getAddress());

        // Shouldn't update relationship directly
        //        newWareHouse.setProductStocks(warehouse.getProductStocks());
        //        newWareHouse.setInStoreRestockOrders(warehouse.getInStoreRestockOrders());

        return newWareHouse;
    }

    private void lazilyLoadWarehouse(List<Warehouse> warehouses) {
        for (Warehouse warehouse : warehouses) {
            warehouse.getInStoreRestockOrders().size();
            warehouse.getProductStocks().size();
            warehouse.getAddress();
        }
    }

    private List<Warehouse>  makeList(Warehouse warehouse) {
        List<Warehouse> warehouses = new ArrayList<>();
        warehouses.add(warehouse);
        return warehouses;
    }

    // E1.4
    // Set Criteria for automated ordering from supplier
    // Criteria is set in ProductStock.reorderQuantity
}

