package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductStock;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductStockRepository extends CrudRepository<ProductStock, Long> {

    @Override
    Optional<ProductStock> findById(Long aLong);

}
