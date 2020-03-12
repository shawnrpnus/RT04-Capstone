package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Advertisement;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.request.advertisement.AdvertisementCreateRequest;
import capstone.rt04.retailbackend.services.AdvertisementService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.advertisement.AdvertisementNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.AdvertisementControllerRoutes.*;

@RestController
@RequestMapping(ADVERTISEMENT_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})

public class AdvertisementController {

    private final AdvertisementService advertisementService;
    private final ValidationService validationService;


    public AdvertisementController(AdvertisementService advertisementService, ValidationService validationService) {
        this.advertisementService = advertisementService;
        this.validationService = validationService;
    }

    @PostMapping(CREATE_ADVERTISEMENT)
    public ResponseEntity<?> createAdvertisement(@RequestBody AdvertisementCreateRequest request) throws AdvertisementNotFoundException, StaffNotFoundException {
        List<Advertisement> advertisements = advertisementService.createAdvertisement(request.getStaffId(),
                request.getAdvertisementImgUrl(), request.getActivate());
        clearAdvertisementRelationship(advertisements);
        return new ResponseEntity<>(advertisements, HttpStatus.CREATED);
    }

    @GetMapping(RETRIEVE_ALL_ADVERTISEMENT)
    public ResponseEntity<?> retrieveAllAdvertisement() {
        List<Advertisement> advertisements = advertisementService.retrieveAllAdvertisement();
        clearAdvertisementRelationship(advertisements);
        return new ResponseEntity<>(advertisements, HttpStatus.OK);
    }

    @GetMapping(ACTIVATE_ADVERTISEMENT)
    public ResponseEntity<?> activateAdvertisement(@PathVariable Long advertisementId) throws AdvertisementNotFoundException {
        List<Advertisement> advertisements = advertisementService.activateAdvertisement(advertisementId);
        clearAdvertisementRelationship(advertisements);
        return new ResponseEntity<>(advertisements, HttpStatus.OK);
    }

    @DeleteMapping(DELETE_ADVERTISEMENT)
    public ResponseEntity<?> deleteAdvertisement(@PathVariable Long advertisementId) throws AdvertisementNotFoundException {
        List<Advertisement> advertisements = advertisementService.deleteAdvertisement(advertisementId);
        clearAdvertisementRelationship(advertisements);
        return new ResponseEntity<>(advertisements, HttpStatus.OK);
    }

    private void clearAdvertisementRelationship(List<Advertisement> advertisements) {
        Staff staff;
        for(Advertisement advertisement: advertisements) {
            staff = advertisement.getCreator();
            staff.setRepliedReviews(null);
            staff.setBankDetails(null);
            staff.setAddress(null);
            staff.setLeaves(null);
            staff.setPayrolls(null);
            staff.setDeliveries(null);
            staff.setAdvertisements(null);
        }
    }
}
