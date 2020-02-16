package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Advertisement;
import org.springframework.data.repository.CrudRepository;

public interface AdvertisementRepository extends CrudRepository<Advertisement, Long> {
}
