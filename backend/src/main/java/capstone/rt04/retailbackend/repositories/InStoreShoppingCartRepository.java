package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.InStoreShoppingCart;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InStoreShoppingCartRepository extends CrudRepository<InStoreShoppingCart, Long> {
}
