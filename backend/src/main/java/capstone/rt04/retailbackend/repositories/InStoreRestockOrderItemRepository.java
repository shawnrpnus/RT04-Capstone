package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.InStoreRestockOrderItem;
import org.springframework.data.repository.CrudRepository;


public interface InStoreRestockOrderItemRepository extends CrudRepository<InStoreRestockOrderItem, Long> {
}
