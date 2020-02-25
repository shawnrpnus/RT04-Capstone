package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Department;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface DepartmentRepository extends CrudRepository<Department, Long> {
    List<Department> findAll();
}
