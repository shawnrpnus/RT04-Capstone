package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.entities.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeasurementsRepository extends CrudRepository<Measurements, Long> {

}
