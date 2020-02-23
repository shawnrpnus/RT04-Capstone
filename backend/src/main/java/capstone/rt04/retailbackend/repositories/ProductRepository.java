package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Tag;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends CrudRepository<Product, Long> {

    List<Product> findAll();

    List<Product> findAllByTagsIn(List<Tag> tags);

    @Query("SELECT p FROM Product p WHERE p.category.categoryId = ?1")
    List<Product> findAllByCategoryId(Long categoryId);
}
