package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.BankDetails;
import org.springframework.data.repository.CrudRepository;

public interface BankDetailsRepositary extends CrudRepository<BankDetails, Long> {
}
