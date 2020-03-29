package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.RefundLineItemHandler;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RefundLineItemHandlerRepository extends CrudRepository<RefundLineItemHandler, Long> {

    @Query("SELECT rlih FROM RefundLineItemHandler rlih WHERE rlih.refundLineItem.refundLineItemId =?1 ORDER BY rlih.handledDateTime DESC")
    List<RefundLineItemHandler> findByRefundLineItemIdAndHandledDateTime(Long refundLineItemId);
}
