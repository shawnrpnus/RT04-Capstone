package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Category;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends CrudRepository<Category, Long> {

    Optional<Category> findByNameAndCategoryId(String name, Long categoryId);

    Optional<Category> findByName(String name);

    List<Category> findAllByParentCategoryIsNull();

    List<Category> findAllByChildCategoriesIsNull();
}
