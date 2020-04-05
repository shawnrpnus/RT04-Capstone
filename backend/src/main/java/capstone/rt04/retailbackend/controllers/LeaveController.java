package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.entities.StaffLeave;
import capstone.rt04.retailbackend.request.leave.LeaveCreateRequest;
import capstone.rt04.retailbackend.request.promoCode.PromoCodeCreateRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.LeaveService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.CreateNewPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.LeaveControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.PromoCodeControllerRoutes.RETRIEVE_ALL_PROMO_CODE;


@RestController
@RequestMapping(LEAVE_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class LeaveController {

    private final LeaveService leaveService;
    private final ValidationService validationService;

    public LeaveController(LeaveService leaveService, ValidationService validationService) {
        this.leaveService = leaveService;
        this.validationService = validationService;
    }

    @PostMapping(APPLY_FOR_LEAVE)
    public ResponseEntity<?> createNewLeave(@RequestBody LeaveCreateRequest leaveCreateRequest)
            throws InputDataValidationException, PromoCodeNotFoundException, CreateNewPromoCodeException, StaffNotFoundException {
        try {
            StaffLeave newLeave = leaveService.createNewLeave(leaveCreateRequest.getLeave());
            return new ResponseEntity<>(newLeave, HttpStatus.CREATED);
        }catch (InputDataValidationException ex){
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(RETRIEVE_ALL_LEAVES)
    public ResponseEntity<?> retrieveAllLeaves(@PathVariable Long staffId) {
        try {
            List<StaffLeave> leaves = leaveService.retrieveAllLeaves(staffId);
            return new ResponseEntity<>(leaves, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
