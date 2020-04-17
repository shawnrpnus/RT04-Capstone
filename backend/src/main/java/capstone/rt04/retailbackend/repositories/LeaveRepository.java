package capstone.rt04.retailbackend.repositories;
import capstone.rt04.retailbackend.entities.Staff;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import capstone.rt04.retailbackend.entities.StaffLeave;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveRepository extends CrudRepository<StaffLeave, Long> {
    List<StaffLeave> findAll();
}
