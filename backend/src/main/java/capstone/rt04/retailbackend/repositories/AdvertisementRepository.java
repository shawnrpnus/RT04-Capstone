package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Advertisement;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AdvertisementRepository extends CrudRepository<Advertisement, Long> {

    List<Advertisement> findAll();

    List<Advertisement> findAllByActive(Boolean active);
}
