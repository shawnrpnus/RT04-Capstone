package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.Address;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends CrudRepository<Address, Long> {

    @Query("SELECT a FROM Address a WHERE a.lat IS NOT NULL AND a.lng IS NOT NULL")
    List<Address> findAllByLatLngNotNull();
}
