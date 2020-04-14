package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.ShoppingCartItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingCartItemRepository extends CrudRepository<ShoppingCartItem, Long> {

    List<ShoppingCartItem> findAll();
}
