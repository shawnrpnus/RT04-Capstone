package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Refund;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends CrudRepository<Refund, Long> {
    Optional<Refund> findByRefundId(Long refundId);

    List<Refund> findAll();

    List<Refund> findAllByCustomer_CustomerId(Long customerId);

    @Query("SELECT DISTINCT r FROM Refund r JOIN r.refundLineItems l WHERE l.transactionLineItem.transaction.transactionId = ?1")
    List<Refund> findByTransactionId(Long transactionId);
}
