package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.RefundLineItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundLineItemRepository extends CrudRepository<RefundLineItem, Long> {

}
