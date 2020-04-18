package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Department;
import capstone.rt04.retailbackend.entities.Role;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.entities.Store;
import capstone.rt04.retailbackend.request.staff.*;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.StaffService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.staff.*;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.StaffControllerRoutes.*;

@RestController
@RequestMapping(STAFF_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
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
    @PostMapping(CREATE_NEW_STAFF)
    public ResponseEntity<?> createNewStaff(@RequestBody StaffCreateRequest staffCreateRequest) throws CreateNewStaffException, CreateNewStaffAccountException, javax.management.relation.RoleNotFoundException {

        System.out.println(staffCreateRequest.getRoleId());
        try {
            Staff newStaff = staffService.createNewStaff(staffCreateRequest.getStaff(), staffCreateRequest.getStaffAddress(),
                    staffCreateRequest.getRoleId(), staffCreateRequest.getDepartmentId(), staffCreateRequest.getStoreId());
            clearStaffRelationship(newStaff);
            return new ResponseEntity<>(newStaff, HttpStatus.CREATED);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (DepartmentNotFoundException ex) {
            return new ResponseEntity<>(ex, HttpStatus.BAD_REQUEST);
        }


    }

    @PostMapping(CREATE_NEW_ROLE)
    public ResponseEntity<?> createNewRole(@RequestBody RoleCreateRequest roleCreateRequest) {
        Role newRole = staffService.createNewRole(roleCreateRequest.getRoleName());
        return new ResponseEntity<>(newRole, HttpStatus.CREATED);
    }


    @PostMapping(CREATE_NEW_DEPARTMENT)
    public ResponseEntity<?> createNewDepartment(@RequestBody DepartmentCreateRequest departmentCreateRequest) {
        Department newDepartment = staffService.createNewDepartment(departmentCreateRequest.getDepartmentName());
        return new ResponseEntity<>(newDepartment, HttpStatus.CREATED);
    }


    //HR informs admin to create new staff account and provides admin with staff ID
    //Email will be sent to new staff containing username and password.
    //I did not include verification here
//    @PostMapping(CREATE_NEW_STAFF_ACCOUNT)
//    public ResponseEntity<?> createNewStaffAccount(@RequestBody StaffAccountCreateRequest staffAccountCreateRequest) throws CreateNewStaffAccountException {
//
//        try {
//            List<Staff> staff = staffService.createNewStaffAccount(staffAccountCreateRequest.getStaffIds());
//            return new ResponseEntity<>(staff, HttpStatus.CREATED);
//        } catch (CreateNewStaffAccountException ex){
//            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
//        }
//
//
//    }

    @GetMapping(RETRIEVE_STAFF_BY_ID)
    public ResponseEntity<?> retrieveStaffById(@PathVariable Long staffId) {
        try {
            Staff staff = staffService.retrieveStaffByStaffId(staffId);
            clearStaffRelationship(staff);
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (StaffNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_STAFF)
    public ResponseEntity<?> retrieveAllStaff() {
        try {
            List<Staff> staff = staffService.retrieveAllStaff();
            staff.forEach(this::clearStaffRelationship);
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_DELIVERY_STAFF)
    public ResponseEntity<?> retrieveAllDeliveryStaff() {
        List<Staff> staff = staffService.retrieveAllEligibleDeliveryStaff();
        staff.forEach(this::clearStaffRelationship);
        return new ResponseEntity<>(staff, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_ROLES)
    public ResponseEntity<?> retrieveAllRoles() {
        try {
            List<Role> roles = staffService.retrieveAllRoles();
            return new ResponseEntity<>(roles, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_DEPARTMENTS)
    public ResponseEntity<?> retrieveAllDepartments() {
        try {
            List<Department> departments = staffService.retrieveAllDepartments();
            return new ResponseEntity<>(departments, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //For HR to update first categoryName, last categoryName, role, email, department, bank details and address
    @PostMapping(UPDATE_STAFF)
    public ResponseEntity<?> updateStaff(@RequestBody StaffDetailsUpdateRequest staffDetailsUpdateRequest) throws StaffNotFoundException, InputDataValidationException {
        try {
            Staff updatedStaff = staffService.updateStaffDetails(staffDetailsUpdateRequest.getStaff(), staffDetailsUpdateRequest.getRoleId(),
                    staffDetailsUpdateRequest.getDepartmentId(), staffDetailsUpdateRequest.getAddress(), staffDetailsUpdateRequest.getStoreId());
            clearStaffRelationship(updatedStaff);
            return new ResponseEntity<>(updatedStaff, HttpStatus.OK);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (UpdateStaffDetailsException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(LOGIN_STAFF)
    public ResponseEntity<?> staffLogin(@RequestBody StaffLoginRequest staffLoginRequest) throws InvalidStaffCredentialsException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(staffLoginRequest);
        try {
            Staff staff = staffService.staffLogin(staffLoginRequest.getUsername(), staffLoginRequest.getPassword());
            clearStaffRelationship(staff);
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (InvalidStaffCredentialsException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(CHANGE_STAFF_PASSWORD)
    public ResponseEntity<?> changeStaffPassword(@RequestBody StaffChangePasswordRequest staffChangePasswordRequest) throws StaffNotFoundException, InvalidStaffCredentialsException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(staffChangePasswordRequest);
        try {

            staffService.changeStaffPassword(staffChangePasswordRequest.getStaffId(),
                    staffChangePasswordRequest.getOldPassword(),
                    staffChangePasswordRequest.getNewPassword(),
                    staffChangePasswordRequest.getConfirmPassword());
            Staff staff = staffService.retrieveStaffByStaffId(staffChangePasswordRequest.getStaffId());
            clearStaffRelationship(staff);
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (StaffNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (InvalidStaffCredentialsException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        }
    }

    // TODO: Implement below method with actual email.
    // For IT to reset password for staff
    @PostMapping(RESET_STAFF_PASSWORD)
    public ResponseEntity<?> resetStaffPassword(@RequestBody ResetStaffPasswordRequest rq) throws StaffNotFoundException {
        try {
            Staff staff = staffService.resetPassword(rq.getUsername());
            clearStaffRelationship(staff);
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (StaffNotFoundException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.NOT_FOUND);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(DELETE_STAFF)
    public ResponseEntity<?> deleteCustomer(@PathVariable Long staffId) throws StaffCannotDeleteException, StaffNotFoundException {
        Staff deletedStaff = staffService.removeStaff(staffId);
        clearStaffRelationship(deletedStaff);
        return new ResponseEntity<>(deletedStaff, HttpStatus.OK);
    }


    @GetMapping(RETRIEVE_STAFF_WITH_NO_ACCOUNT)
    public ResponseEntity<?> retrieveStaffWithNoAccount() {
        try {
            List<Staff> staff = staffService.retrieveStaffWithNoAccount();
            staff.forEach(this::clearStaffRelationship);
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(REGISTER_PUSH_NOTIF_TOKEN)
    public ResponseEntity<?> registerPushNotifToken(@RequestBody RegisterPushNotifTokenRequest req) throws StaffNotFoundException {
        Staff staff = staffService.registerPushNotificationToken(req.getStaffId(), req.getToken());
        clearStaffRelationship(staff);
        return new ResponseEntity<>(staff, HttpStatus.OK);
    }

    @PostMapping(REASSIGN_STAFF_STORE)
    public ResponseEntity<?> reassignStaffStore(@RequestBody ReassignStaffStoreRequest reassignStaffStoreRequest) throws StoreNotFoundException, StaffNotFoundException {
        Store store = staffService.reassignStaffStore(reassignStaffStoreRequest.getStoreId(), reassignStaffStoreRequest.getStaffIds());
        return new ResponseEntity<>(store, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_STORE_STAFF)
    public ResponseEntity<?> retrieveAllStoreStaff() {
        try {
            List<Staff> staff = staffService.retrieveStoreStaff();
            staff.forEach(this::clearStaffRelationship);
            return new ResponseEntity<>(staff, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void clearStaffRelationship(Staff staff) {
        Store s = staff.getStore();
        if (s != null) {
            s.setProductStocks(null);
            s.setReservations(null);
            s.setInStoreRestockOrders(null);
            s.setTransactions(null);
            s.setStaff(null);
        }
        staff.setAdvertisements(null);
        staff.setRepliedReviews(null);
        staff.setLeaves(null);
        staff.setPayrolls(null);
        staff.setDeliveries(null);
        staff.setPassword(null);
        Department d = staff.getDepartment();
        if (d != null) {
            d.setStaffList(null);
        }
        Role r = staff.getRole();
        if (r != null) {
            r.setStaffList(null);
        }
    }


}
