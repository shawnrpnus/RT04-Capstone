package capstone.rt04.retailbackend.services;


import capstone.rt04.retailbackend.entities.Warehouse;
import capstone.rt04.retailbackend.repositories.WarehouseRepository;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;


@Service
@Transactional
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
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

        return newWareHouse;
    }


}

