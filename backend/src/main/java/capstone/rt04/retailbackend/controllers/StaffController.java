package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.entities.Store;
import capstone.rt04.retailbackend.request.customer.CustomerChangePasswordRequest;
import capstone.rt04.retailbackend.request.customer.CustomerLoginRequest;
import capstone.rt04.retailbackend.request.customer.CustomerResetPasswordRequest;
import capstone.rt04.retailbackend.request.staff.*;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.StaffService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffAccountException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.UpdateStaffDetailsException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes;
import capstone.rt04.retailbackend.util.routeconstants.StaffControllerRoutes;
import capstone.rt04.retailbackend.util.routeconstants.StoreControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    //When creating new staff, HR supplies first name, last name, email, address, bank details, role and department
    //Address will need to save in address repository cause it is new
    //role and department already exist in database from the start so no need to save
    @PostMapping(StaffControllerRoutes.CREATE_NEW_STAFF)
    public ResponseEntity<?> createNewStaff(@RequestBody StaffCreateRequest staffCreateRequest) throws InputDataValidationException, CreateNewStaffException {
        Staff newStaff = staffService.createNewStaff(staffCreateRequest.getStaff(),staffCreateRequest.getStaffAddress(),
                staffCreateRequest.getRole(),staffCreateRequest.getDepartment());
        return new ResponseEntity<>(newStaff, HttpStatus.CREATED);
    }


    //HR informs admin to create new staff account and provides admin with staff ID
    //Email will be sent to new staff containing username and password.
    //I did not include verification here
    @PostMapping(StaffControllerRoutes.CREATE_NEW_STAFF_ACCOUNT)
    public ResponseEntity<?> createNewStaffAccount(@PathVariable Long staffID) throws CreateNewStaffAccountException {
        Staff staff = staffService.createNewStaffAccount(staffID);
        return new ResponseEntity<>(staff, HttpStatus.CREATED);
    }

    @GetMapping(StaffControllerRoutes.RETRIEVE_STAFF_BY_ID)
    public ResponseEntity<?> retrieveStaffById(@PathVariable Long staffId) {
        try {
            Staff staff = staffService.retrieveStaffByStaffId(staffId);
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (StaffNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(StaffControllerRoutes.RETRIEVE_ALL_STAFF)
    public ResponseEntity<?> retrieveAllStaff() {
        try {
            List<Staff> staff = staffService.retrieveAllStaff();
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //For HR to update first name, last name, role, email, department, bank details and address
    @PostMapping(StaffControllerRoutes.UPDATE_STAFF)
    public ResponseEntity<?> updateStaff(@RequestBody StaffDetailsUpdateRequest staffDetailsUpdateRequest) throws StaffNotFoundException, InputDataValidationException {
        try {
            Staff updatedStaff = staffService.updateStaffDetails(staffDetailsUpdateRequest.getStaff(),staffDetailsUpdateRequest.getRole(),
                    staffDetailsUpdateRequest.getDepartment(), staffDetailsUpdateRequest.getAddress());
            return new ResponseEntity<>(updatedStaff, HttpStatus.OK);
        }catch (UpdateStaffDetailsException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(StaffControllerRoutes.LOGIN_STAFF)
    public ResponseEntity<?> staffLogin(@RequestBody StaffLoginRequest staffLoginRequest) throws InvalidLoginCredentialsException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(staffLoginRequest);
        if (inputErrMap != null) {
            return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        }

        Staff staff = staffService.staffLogin(staffLoginRequest.getUsername(), staffLoginRequest.getPassword());
        return new ResponseEntity<>(staff, HttpStatus.OK);
    }

    @PostMapping(StaffControllerRoutes.CHANGE_STAFF_PASSWORD)
    public ResponseEntity<?> changeStaffPassword(@RequestBody StaffChangePasswordRequest staffChangePasswordRequest) throws StaffNotFoundException, InvalidLoginCredentialsException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(staffChangePasswordRequest);
        if (inputErrMap != null) {
            return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        }

        staffService.changeStaffPassword(staffChangePasswordRequest.getStaffId(),
                staffChangePasswordRequest.getOldPassword(),
                staffChangePasswordRequest.getNewPassword());
        Staff staff = staffService.retrieveStaffByStaffId(staffChangePasswordRequest.getStaffId());
        return new ResponseEntity<>(staff, HttpStatus.OK);
    }

    // TODO: Implement below method with actual email.
    // For IT to reset password for staff
    @PostMapping(StaffControllerRoutes.RESET_STAFF_PASSWORD)
    public ResponseEntity<?> resetStaffPassword(@RequestParam Long staffId) throws StaffNotFoundException {
        staffService.resetPassword(staffId);
        Map<String, String> successMessage = new HashMap<>();
        successMessage.put("message","Please inform staff to check email for new password");
        return new ResponseEntity<>(successMessage, HttpStatus.OK);
    }




}
