package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.OnlineShoppingCart;
import capstone.rt04.retailbackend.entities.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OnlineShoppingCartRepository extends CrudRepository<OnlineShoppingCart, Long> {
}
