package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.InstagramPost;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface InstagramPostRepository extends CrudRepository<InstagramPost, Long> {

    List<InstagramPost> findAll();

    List<InstagramPost> findAllByActive(Boolean active);
}
