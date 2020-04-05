package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Reservation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ReservationRepository extends CrudRepository<Reservation, Long> {

    List<Reservation> findAllByStore_StoreId(Long storeId);

    List<Reservation> findAll();
}
