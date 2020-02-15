package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.entities.Style;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface StyleRepository extends CrudRepository<Style, Long> {

    Optional<Style> findByStyleName(String styleName);

    List<Style> findAll();
}
