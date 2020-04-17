package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Delivery;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DeliveryRepository extends CrudRepository<Delivery, Long> {

    List<Delivery> findAll();

    List<Delivery> findAllByDeliveryStaff_StaffId(Long staffId);
}
