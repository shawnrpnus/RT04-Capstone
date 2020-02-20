package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

public interface RoleRepository extends CrudRepository<Role, Long> {
}
