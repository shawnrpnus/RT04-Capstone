package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.TransactionLineItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionLineItemRepository extends CrudRepository<TransactionLineItem, Long>{
    List<TransactionLineItem> findAll();
}
