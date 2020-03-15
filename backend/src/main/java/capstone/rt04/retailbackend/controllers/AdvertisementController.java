package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Advertisement;
import capstone.rt04.retailbackend.request.advertisement.AdvertisementCreateRequest;
import capstone.rt04.retailbackend.services.AdvertisementService;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.util.exceptions.advertisement.AdvertisementNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.AdvertisementControllerRoutes.*;

@RestController
@RequestMapping(ADVERTISEMENT_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AdvertisementController {

    private final AdvertisementService advertisementService;
    private final RelationshipService relationshipService;


    public AdvertisementController(AdvertisementService advertisementService, RelationshipService relationshipService) {
        this.advertisementService = advertisementService;
        this.relationshipService = relationshipService;
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

    @GetMapping(RETRIEVE_ALL_ACTIVE_ADVERTISEMENT)
    public ResponseEntity<?> retrieveAllActiveAdvertisement() {
        List<Advertisement> advertisements = advertisementService.retrieveAllActiveAdvertisement();
        clearAdvertisementRelationship(advertisements);
        return new ResponseEntity<>(advertisements, HttpStatus.OK);
    }

    @GetMapping(ACTIVATE_ADVERTISEMENT)
    public ResponseEntity<?> activateAdvertisement(@PathVariable Long advertisementId) throws AdvertisementNotFoundException {
        List<Advertisement> advertisements = advertisementService.activateAdvertisement(advertisementId);
        clearAdvertisementRelationship(advertisements);
        return new ResponseEntity<>(advertisements, HttpStatus.OK);
    }

    @GetMapping(DISABLE_ADVERTISEMENT)
    public ResponseEntity<?> disableAdvertisement(@PathVariable Long advertisementId) throws AdvertisementNotFoundException {
        List<Advertisement> advertisements = advertisementService.disableAdvertisement(advertisementId);
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
        for (Advertisement advertisement : advertisements) {
            relationshipService.clearStaffRelationships(advertisement.getCreator());
        }
    }
}
