package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Review;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Long> {
}
