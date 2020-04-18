package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.leave.*;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.LeaveService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveCannotCreateException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveCannotDeleteException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveCannotUpdateException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.CreateNewPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.LeaveControllerRoutes.*;


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
            throws StaffNotFoundException, StaffLeaveCannotCreateException, InputDataValidationException {
            StaffLeave newLeave = leaveService.createNewLeave(leaveCreateRequest.getLeave());
            clearLeaveRelationship(newLeave);
            return new ResponseEntity<>(newLeave, HttpStatus.CREATED);
    }

    @GetMapping(RETRIEVE_ALL_LEAVES)
    public ResponseEntity<?> retrieveAllLeaves(@PathVariable Long staffId) {
        try {
            List<StaffLeave> leaves = leaveService.retrieveAllLeaves(staffId);
            leaves.forEach(this::clearLeaveRelationship);
            return new ResponseEntity<>(leaves, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(DELETE_LEAVE)
    public ResponseEntity<?> removeLeave(@PathVariable Long leaveId) throws StaffLeaveNotFoundException, StaffLeaveCannotDeleteException, StaffNotFoundException {

            StaffLeave deletedLeave = leaveService.removeLeave(leaveId);
            clearLeaveRelationship(deletedLeave);
            return new ResponseEntity<>(deletedLeave, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_LEAVES_MANAGER)
    public ResponseEntity<?> retrieveAllLeavesManager(@PathVariable Long staffId) {
        try {
            List<StaffLeave> leaves = leaveService.retrieveAllLeavesManager(staffId);
            leaves.forEach(this::clearLeaveRelationshipOnRetrieve);
            return new ResponseEntity<>(leaves, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_PENDING_LEAVES)
    public ResponseEntity<?> retrieveAllPendingLeaves(@PathVariable Long staffId) {
        try {
            List<StaffLeave> leaves = leaveService.retrieveAllPendingLeaves(staffId);
            leaves.forEach(this::clearLeaveRelationshipOnRetrieve);
            return new ResponseEntity<>(leaves, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_LEAVES_HR)
    public ResponseEntity<?> retrieveAllLeavesHR() {
        try {
            List<StaffLeave> leaves = leaveService.retrieveAllLeavesHR();
            leaves.forEach(this::clearLeaveRelationshipOnRetrieve);
            return new ResponseEntity<>(leaves, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_ENDORSED_LEAVES)
    public ResponseEntity<?> retrieveAllEndorsedLeaves() {
        try {
            List<StaffLeave> leaves = leaveService.retrieveAllEndorsedLeaves();
            leaves.forEach(this::clearLeaveRelationshipOnRetrieve);
            return new ResponseEntity<>(leaves, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(ENDORSE_REJECT_LEAVE)
    public ResponseEntity<?> endorseRejectLeave(@RequestBody EndorseRejectLeaveRequest endorseRejectLeaveRequest) throws StaffLeaveNotFoundException, StaffNotFoundException {
        try {
            StaffLeave leave = leaveService.endorseRejectLeave(endorseRejectLeaveRequest.getLeaveId(),
                    endorseRejectLeaveRequest.getManagerId(), endorseRejectLeaveRequest.getAction());
            clearLeaveRelationship(leave);
            return new ResponseEntity<>(leave, HttpStatus.OK);
        }catch (StaffNotFoundException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }catch (StaffLeaveNotFoundException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(APPROVE_REJECT_LEAVE)
    public ResponseEntity<?> approveRejectLeave(@RequestBody ApproveRejectLeaveRequest approveRejectLeaveRequest) throws StaffLeaveNotFoundException, StaffNotFoundException {
        try {
            StaffLeave leave = leaveService.approveRejectLeave(approveRejectLeaveRequest.getLeaveId(),
                    approveRejectLeaveRequest.getHrId(), approveRejectLeaveRequest.getAction());
            clearLeaveRelationship(leave);
            return new ResponseEntity<>(leave, HttpStatus.OK);
        }catch (StaffNotFoundException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }catch (StaffLeaveNotFoundException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(UPDATE_LEAVE)
    public ResponseEntity<?> updateLeave(@RequestBody UpdateLeaveRequest updateLeaveRequest) throws StaffLeaveNotFoundException, StaffNotFoundException, StaffLeaveCannotUpdateException, InputDataValidationException {
            StaffLeave leave = leaveService.updateLeave(updateLeaveRequest.getLeaveId(), updateLeaveRequest.getApplicant(),
                    updateLeaveRequest.getFromDateTime(), updateLeaveRequest.getToDateTime());
        clearLeaveRelationship(leave);
            return new ResponseEntity<>(leave, HttpStatus.OK);
    }


    private void clearLeaveRelationship(StaffLeave staffLeave) {
        staffLeave.setRejectedBy(null);
        staffLeave.setApprover(null);
        staffLeave.setEndorser(null);
        staffLeave.setApplicant(null);
    }

    private void clearLeaveRelationshipOnRetrieve(StaffLeave staffLeave) {
        staffLeave.setRejectedBy(null);
        staffLeave.setApprover(null);
        staffLeave.setEndorser(null);
        Staff staff = staffLeave.getApplicant();
        if (staff != null) {
            staff.setStore(null);
            staff.setAdvertisements(null);
            staff.setRepliedReviews(null);
            staff.setLeaves(null);
            staff.setPayrolls(null);
            staff.setDeliveries(null);
            staff.setPassword(null);
            staff.setDepartment(null);
            staff.setRole(null);
        }
    }
}
