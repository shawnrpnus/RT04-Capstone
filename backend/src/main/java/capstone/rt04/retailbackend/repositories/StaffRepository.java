package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Staff;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface StaffRepository extends CrudRepository<Staff, Long> {

    Optional<Staff> findByNric(String nric);

    Optional<Staff> findByUsername(String username);
}
