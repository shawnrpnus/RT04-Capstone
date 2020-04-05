package capstone.rt04.retailbackend.repositories;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import capstone.rt04.retailbackend.entities.StaffLeave;
import java.util.Optional;

@Repository
public interface LeaveRepository extends CrudRepository<StaffLeave, Long> {
}
