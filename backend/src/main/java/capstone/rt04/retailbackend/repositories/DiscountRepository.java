package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Discount;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository extends CrudRepository<Discount, Long> {

}
