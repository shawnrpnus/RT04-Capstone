package capstone.rt04.retailbackend.services;


import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.util.exceptions.customer.AddressNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public Warehouse retrieveByWarehouseId(Long warehouseId) throws WarehouseNotFoundException {
        if (warehouseId == null) {
            throw new WarehouseNotFoundException("Warehouse does not exist, Please try again");
        }

        return warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new WarehouseNotFoundException("Warehouse with id: " + warehouseId + " does not exist"));
    }
    //View all Warehouse inventory
    public Warehouse getWarehouseInventory(Long warehouseId) throws WarehouseNotFoundException {
        //for loop
        Warehouse warehouse = retrieveByWarehouseId(warehouseId);
        return warehouse;
    }
    //View Warehouse Inventory Details
    //Edit Warehouse Inventory Details
}
