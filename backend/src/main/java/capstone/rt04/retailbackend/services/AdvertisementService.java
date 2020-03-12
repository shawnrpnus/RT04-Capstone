package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Advertisement;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.repositories.AdvertisementRepository;
import capstone.rt04.retailbackend.util.exceptions.advertisement.AdvertisementNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
public class AdvertisementService {

    private final AdvertisementRepository advertisementRepository;

    private final ValidationService validationService;
    private final StaffService staffService;

    public AdvertisementService(AdvertisementRepository advertisementRepository, ValidationService validationService, StaffService staffService) {
        this.advertisementRepository = advertisementRepository;
        this.validationService = validationService;
        this.staffService = staffService;
    }

    public List<Advertisement> createAdvertisement(Long staffId, String advertisementImgUrl, Boolean activate) throws StaffNotFoundException, AdvertisementNotFoundException {

        Staff staff = staffService.retrieveStaffByStaffId(staffId);
        Advertisement advertisement = new Advertisement(advertisementImgUrl, staff);
        if (retrieveAllAdvertisement().size() == 0) {
            advertisement.setActive(Boolean.TRUE);
        }
        advertisementRepository.save(advertisement);

        // Activate upon creation
        if (activate) {
            activateAdvertisement(advertisement.getAdvertisementId());
        }
        return retrieveAllAdvertisement();
    }

    public List<Advertisement> retrieveAllAdvertisement() {
        List<Advertisement> advertisements = advertisementRepository.findAll();
        return advertisements;
    }

    public Advertisement retrieveAdvertisementById(Long advertisementId) throws AdvertisementNotFoundException {
        Advertisement advertisement = advertisementRepository.findById(advertisementId).orElseThrow(() ->
                new AdvertisementNotFoundException("Advertisement with ID " + advertisementId + " not found!"));
        return advertisement;
    }

    public List<Advertisement> activateAdvertisement(Long advertisementId) throws AdvertisementNotFoundException {
        // Find the current advertisement that is active and disable it & activate the selected one
        Advertisement activeAdvertisement = advertisementRepository.findByActive(Boolean.TRUE);
        Advertisement advertisement = retrieveAdvertisementById(advertisementId);
        advertisement.setActive(Boolean.TRUE);
        activeAdvertisement.setActive(Boolean.FALSE);
        return retrieveAllAdvertisement();
    }

    public List<Advertisement> deleteAdvertisement(Long advertisementId) throws AdvertisementNotFoundException {
        Advertisement advertisement = retrieveAdvertisementById(advertisementId);
        advertisement.getCreator().getAdvertisements().remove(advertisement);
        advertisement.setCreator(null);
        advertisementRepository.delete(advertisement);
        return retrieveAllAdvertisement();
    }


}
