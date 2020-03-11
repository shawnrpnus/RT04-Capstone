package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Review;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Long> {

    Review findByReviewId(Long reviewId);

    List<Review> findAll();

    //retrieve a list of reviews for a product
    List<Review> findAllByProduct_ProductId(Long productId);

    List<Review> findAllByCustomer_CustomerId(Long customerId);
}
