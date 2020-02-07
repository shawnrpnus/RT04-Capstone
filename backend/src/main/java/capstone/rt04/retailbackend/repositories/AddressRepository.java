package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.entities.Category;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressRepository extends CrudRepository<Address, Long> {

}
