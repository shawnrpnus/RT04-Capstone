package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.InStoreRestockOrder;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


public interface InStoreRestockOrderRepository extends CrudRepository<InStoreRestockOrder, Long> {

    List<InStoreRestockOrder> findAll();

    List<InStoreRestockOrder> findAllByStore_StoreId(Long storeId);

    List<InStoreRestockOrder> findAllByWarehouse_WarehouseId(Long warehouseId);
}
