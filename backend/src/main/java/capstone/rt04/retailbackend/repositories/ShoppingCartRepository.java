package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.ShoppingCart;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoppingCartRepository extends CrudRepository<ShoppingCart, Long> {
}
