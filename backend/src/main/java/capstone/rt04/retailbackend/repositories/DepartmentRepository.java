package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Department;
import org.springframework.data.repository.CrudRepository;

public interface DepartmentRepository extends CrudRepository<Department, Long> {
}
