package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.InStoreRestockOrder;
import org.springframework.data.repository.CrudRepository;


public interface InStoreRestockOrderRepository extends CrudRepository<InStoreRestockOrder, Long> {
}
