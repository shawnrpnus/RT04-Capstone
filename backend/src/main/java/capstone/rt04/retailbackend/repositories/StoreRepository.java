package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Store;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends CrudRepository<Store, Long> {

    List<Store> findAll();
}
