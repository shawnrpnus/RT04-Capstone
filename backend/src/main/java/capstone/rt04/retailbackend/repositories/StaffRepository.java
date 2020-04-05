package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Department;

import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.util.enums.RoleNameEnum;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends CrudRepository<Staff, Long> {

    Optional<Staff> findByNric(String nric);

    Optional<Staff> findByUsername(String username);

    List<Staff> findAll();

    List<Staff> findByDepartment(Department department);

    List<Staff> findAllByStore_StoreId(Long storeId);

    List<Staff> findAllByDepartment_DepartmentNameEqualsAndRole_RoleNameEquals(String department, RoleNameEnum roleNameEnum);

}
