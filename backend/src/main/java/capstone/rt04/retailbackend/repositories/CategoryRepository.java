package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Tag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends CrudRepository<Category, Long> {

    Optional<Category> findByNameAndCategoryId(String name, Long categoryId);

    Optional<Category> findByName(String name);
}
