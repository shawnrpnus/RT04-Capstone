package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends CrudRepository<Transaction, Long>{
    List<Transaction> findAll();

    List<Transaction> findAllByCustomer_CustomerId(Long customerId);

    Transaction findByOrderNumber(String orderNumber);
}
