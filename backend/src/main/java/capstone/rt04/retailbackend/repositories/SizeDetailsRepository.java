package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.SizeDetails;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeDetailsRepository extends CrudRepository<SizeDetails, Long> {

}
