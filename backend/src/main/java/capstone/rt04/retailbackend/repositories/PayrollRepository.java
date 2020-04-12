package capstone.rt04.retailbackend.repositories;
import capstone.rt04.retailbackend.entities.Payroll;
import capstone.rt04.retailbackend.entities.Staff;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends CrudRepository<Payroll, Long> {
    List<Payroll> findAll();
}
