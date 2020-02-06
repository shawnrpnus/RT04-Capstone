package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.InStoreShoppingCartItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InStoreShoppingCartItemRepository extends CrudRepository<InStoreShoppingCartItem, Long> {
}
