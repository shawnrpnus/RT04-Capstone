package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.customer.CustomerChangePasswordRequest;
import capstone.rt04.retailbackend.request.customer.CustomerLoginRequest;
import capstone.rt04.retailbackend.request.customer.CustomerResetPasswordRequest;
import capstone.rt04.retailbackend.request.staff.*;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.StaffService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import capstone.rt04.retailbackend.util.exceptions.staff.*;
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

    //When creating new staff, HR supplies first categoryName, last categoryName, email, address, bank details, role and department
    //Address will need to save in address repository cause it is new
    //role and department already exist in database from the start so no need to save
    @PostMapping(StaffControllerRoutes.CREATE_NEW_STAFF)
    public ResponseEntity<?> createNewStaff(@RequestBody StaffCreateRequest staffCreateRequest) throws InputDataValidationException, CreateNewStaffException {

        System.out.println(staffCreateRequest.getRoleId());
            try {
                Staff newStaff = staffService.createNewStaff(staffCreateRequest.getStaff(), staffCreateRequest.getStaffAddress(),
                        staffCreateRequest.getRoleId(), staffCreateRequest.getDepartmentId());
                return new ResponseEntity<>(newStaff, HttpStatus.CREATED);
            }catch (InputDataValidationException ex) {
                return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
            }


    }

    @PostMapping(StaffControllerRoutes.CREATE_NEW_ROLE)
    public ResponseEntity<?> createNewRole(@RequestBody RoleCreateRequest roleCreateRequest) throws CreateRoleException {
        try {
            Role newRole = staffService.createNewRole(roleCreateRequest.getRoleName());
            return new ResponseEntity<>(newRole, HttpStatus.CREATED);
        }catch (CreateRoleException ex){
            return new ResponseEntity<>(ex, HttpStatus.BAD_REQUEST);
        }
    }


    @PostMapping(StaffControllerRoutes.CREATE_NEW_DEPARTMENT)
    public ResponseEntity<?> createNewDepartment(@RequestBody DepartmentCreateRequest departmentCreateRequest) throws CreateDepartmentException{
        try {
            Department newDepartment = staffService.createNewDepartment(departmentCreateRequest.getDepartmentName());
            return new ResponseEntity<>(newDepartment, HttpStatus.CREATED);
        } catch (CreateDepartmentException ex){
            return new ResponseEntity<>(ex, HttpStatus.BAD_REQUEST);
        }
    }


    //HR informs admin to create new staff account and provides admin with staff ID
    //Email will be sent to new staff containing username and password.
    //I did not include verification here
    @PostMapping(StaffControllerRoutes.CREATE_NEW_STAFF_ACCOUNT)
    public ResponseEntity<?> createNewStaffAccount(@RequestBody StaffAccountCreateRequest staffAccountCreateRequest) throws CreateNewStaffAccountException {

        try {
            Staff staff = staffService.createNewStaffAccount(staffAccountCreateRequest.getStaffId());
            return new ResponseEntity<>(staff, HttpStatus.CREATED);
        } catch (CreateNewStaffAccountException ex){
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        }


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

    @GetMapping(StaffControllerRoutes.RETRIEVE_ALL_ROLES)
    public ResponseEntity<?> retrieveAllRoles() {
        try {
            List<Role> roles = staffService.retrieveAllRoles();
            return new ResponseEntity<>(roles, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(StaffControllerRoutes.RETRIEVE_ALL_DEPARTMENTS)
    public ResponseEntity<?> retrieveAllDepartments() {
        try {
            List<Department> departments = staffService.retrieveAllDepartments();
            return new ResponseEntity<>(departments, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //For HR to update first categoryName, last categoryName, role, email, department, bank details and address
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
    public ResponseEntity<?> staffLogin(@RequestBody StaffLoginRequest staffLoginRequest) throws InvalidStaffCredentialsException {
      try {
            Staff staff = staffService.staffLogin(staffLoginRequest.getUsername(), staffLoginRequest.getPassword());
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (InvalidStaffCredentialsException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(StaffControllerRoutes.CHANGE_STAFF_PASSWORD)
    public ResponseEntity<?> changeStaffPassword(@RequestBody StaffChangePasswordRequest staffChangePasswordRequest) throws StaffNotFoundException, InvalidStaffCredentialsException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(staffChangePasswordRequest);
        if (inputErrMap != null) {
            return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        }

        try {

            staffService.changeStaffPassword(staffChangePasswordRequest.getStaffId(),
                    staffChangePasswordRequest.getOldPassword(),
                    staffChangePasswordRequest.getNewPassword());
            Staff staff = staffService.retrieveStaffByStaffId(staffChangePasswordRequest.getStaffId());
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (StaffNotFoundException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (InvalidStaffCredentialsException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    // TODO: Implement below method with actual email.
    // For IT to reset password for staff
    @PostMapping(StaffControllerRoutes.RESET_STAFF_PASSWORD)
    public ResponseEntity<?> resetStaffPassword(@RequestBody ResetStaffPasswordRequest rq) throws StaffNotFoundException {
        try {
            Staff staff = staffService.resetPassword(rq.getStaffId());
            return new ResponseEntity<>(staff, HttpStatus.OK);
        }catch (StaffNotFoundException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping(StaffControllerRoutes.DELETE_STAFF)
    public ResponseEntity<?> deleteCustomer(@PathVariable Long staffId) throws StaffCannotDeleteException, StaffNotFoundException {
        Staff deletedStaff = staffService.removeStaff(staffId);
        return new ResponseEntity<>(deletedStaff, HttpStatus.OK);
    }




}
