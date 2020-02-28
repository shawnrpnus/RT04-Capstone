package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends CrudRepository<Role, Long> {
    List<Role> findAll();
}
