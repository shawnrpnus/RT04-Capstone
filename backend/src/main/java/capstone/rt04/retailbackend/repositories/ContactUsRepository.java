package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.ContactUs;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactUsRepository extends CrudRepository<ContactUs, Long> {
    Optional<ContactUs> findByContactUsId(String contactUsID);

}

