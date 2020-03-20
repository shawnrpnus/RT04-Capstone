package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.entities.Tag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromoCodeRepository extends CrudRepository<PromoCode, Long> {

    Optional<PromoCode> findByPromoCodeName(String promoCodeName);

}
