package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.PromoCode;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromoCodeRepository extends CrudRepository<PromoCode, Long> {

}
