package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.InStoreRestockOrderItem;
import capstone.rt04.retailbackend.util.enums.ItemDeliveryStatusEnum;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


public interface InStoreRestockOrderItemRepository extends CrudRepository<InStoreRestockOrderItem, Long> {

    List<InStoreRestockOrderItem> findAllByItemDeliveryStatusEquals(ItemDeliveryStatusEnum itemDeliveryStatus);
}
