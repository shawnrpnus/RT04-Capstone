package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.CreditCard;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CreditCardRepository extends CrudRepository<CreditCard, Long> {

}
