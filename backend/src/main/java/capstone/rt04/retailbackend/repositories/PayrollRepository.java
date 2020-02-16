package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Payroll;
import org.springframework.data.repository.CrudRepository;

public interface PayrollRepository extends CrudRepository<Payroll, Long> {
}
