package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.request.staff.StaffCreateRequest;
import capstone.rt04.retailbackend.services.StaffService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CreateNewCustomerException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffAccountException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes;
import capstone.rt04.retailbackend.util.routeconstants.StaffControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(StaffControllerRoutes.STAFF_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class StaffController {

    private final StaffService staffService;
    private final ValidationService validationService;

    public StaffController(StaffService staffService, ValidationService validationService) {
        this.staffService = staffService;
        this.validationService = validationService;
    }

    @PostMapping(StaffControllerRoutes.CREATE_NEW_STAFF)
    public ResponseEntity<?> createNewStaff(@RequestBody StaffCreateRequest staffCreateRequest) throws InputDataValidationException, CreateNewStaffException {
        Staff newStaff = staffService.createNewStaff(staffCreateRequest.getStaff(),staffCreateRequest.getStaffAddress(),staffCreateRequest.getBankDetails());
        return new ResponseEntity<>(newStaff, HttpStatus.CREATED);
    }

    @PostMapping(StaffControllerRoutes.CREATE_NEW_STAFF_ACCOUNT)
    public ResponseEntity<?> createNewStaffAccount(@PathVariable Long staffID) throws CreateNewStaffAccountException {
        Staff staff = staffService.createNewStaffAccount(staffID);
        return new ResponseEntity<>(staff, HttpStatus.CREATED);
    }
}
