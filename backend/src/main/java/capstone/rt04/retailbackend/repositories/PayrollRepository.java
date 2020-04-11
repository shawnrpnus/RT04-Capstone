package capstone.rt04.retailbackend.repositories;
import capstone.rt04.retailbackend.entities.Payroll;
import capstone.rt04.retailbackend.entities.StaffLeave;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollRepository extends CrudRepository<Payroll, Long> {
    List<Payroll> findAll();
}
