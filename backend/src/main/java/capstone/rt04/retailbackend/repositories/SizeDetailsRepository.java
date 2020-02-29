package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.SizeDetails;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeDetailsRepository extends CrudRepository<SizeDetails, Long> {

    SizeDetails findByProductSize(SizeEnum sizeEnum);
}
