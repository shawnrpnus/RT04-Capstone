package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Tag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends CrudRepository<Tag, Long> {

    Optional<Tag> findByNameAndTagId(String name, Long tagId);

    Optional<Tag> findByName(String name);

}
