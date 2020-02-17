package capstone.rt04.retailbackend.services;


import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.entities.Warehouse;
import capstone.rt04.retailbackend.repositories.AddressRepository;
import capstone.rt04.retailbackend.repositories.ProductRepository;
import capstone.rt04.retailbackend.repositories.ProductStockRepository;
import capstone.rt04.retailbackend.repositories.WarehouseRepository;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;
    private final AddressRepository addressRepository;
    private final ValidationService validationService;
    private final ProductStockRepository productStockRepository;

    public WarehouseService(WarehouseRepository warehouseRepository, AddressRepository addressRepository,
                            ValidationService validationService, ProductStockRepository productStockRepository) {
        this.warehouseRepository = warehouseRepository;
        this.addressRepository = addressRepository;
        this.validationService = validationService;
        this.productStockRepository = productStockRepository;
    }


    public Warehouse createWarehouse(Warehouse warehouse, Address address) {
        validationService.generateErrorMap(address);
        Address a = addressRepository.save(address);
        warehouse.setAddress(a);
        warehouseRepository.save(warehouse);

        return lazyLoadWarehouseFields(warehouse);
    }



    public Warehouse retrieveWarehouseById(Long warehouseId) throws WarehouseNotFoundException {
        if (warehouseId == null) {
            throw new WarehouseNotFoundException("Warehouse ID not provided. Please try again!");
        }

        return warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new WarehouseNotFoundException("Warehouse with id: " + warehouseId + " does not exist"));
    }

    //View all Warehouse inventory
    //Retrieve Address, inStockRestoreOrders, productStocks
    public List<Warehouse> retrieveAllWarehouseInventory() {

        List<Warehouse> allWarehouse = warehouseRepository.findAll();

        for (Warehouse warehouse : allWarehouse) {
            warehouse.getAddress();
            warehouse.getProductStocks();
            warehouse.getInStoreRestockOrders();
        }
        return allWarehouse;
    }

    public List<Warehouse> retrieveAllWarehouses() {
        return warehouseRepository.findAll();
    }


    //View Warehouse Inventory Details
    public Warehouse retrieveWarehouseDetailsByID(Long warehouseId) throws WarehouseNotFoundException {
        Warehouse warehouse = retrieveWarehouseById(warehouseId);
        Warehouse viewWareHouse = new Warehouse();
        viewWareHouse.setAddress(warehouse.getAddress());
        viewWareHouse.setInStoreRestockOrders(warehouse.getInStoreRestockOrders());
        viewWareHouse.setProductStocks(warehouse.getProductStocks());
        return viewWareHouse;

    }

    public Warehouse updateWarehouse(Warehouse warehouse) throws WarehouseNotFoundException {
        Warehouse newWareHouse = retrieveWarehouseById(warehouse.getWarehouseId());
        newWareHouse.setProductStocks(warehouse.getProductStocks());
        newWareHouse.setAddress(warehouse.getAddress());
        newWareHouse.setInStoreRestockOrders(warehouse.getInStoreRestockOrders());
        newWareHouse.setWarehouseId(warehouse.getWarehouseId());
        newWareHouse.setDayOfMonth(warehouse.getDayOfMonth());

        return newWareHouse;
    }

    public Warehouse lazyLoadWarehouseFields(Warehouse warehouse) {
        warehouse.getInStoreRestockOrders().size();
        warehouse.getProductStocks().size();
        warehouse.getAddress();
        return warehouse;
    }

    // E1.4
    // Set Criteria for automated ordering from supplier
    // Criteria is set in ProductStock.reorderQuantity
}

