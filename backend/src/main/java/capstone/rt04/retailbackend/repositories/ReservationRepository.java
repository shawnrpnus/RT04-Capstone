package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Reservation;
import org.springframework.data.repository.CrudRepository;

public interface ReservationRepository extends CrudRepository<Reservation, Long> {
}
