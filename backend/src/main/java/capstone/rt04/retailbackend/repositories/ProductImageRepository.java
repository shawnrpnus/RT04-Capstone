package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.ProductImage;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends CrudRepository<ProductImage, Long> {

    List<ProductImage> findAllByProductImageIdIn(List<Long> productImageIds);
}
