package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.VerificationCode;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends CrudRepository<VerificationCode, Long> {

}
