package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.StaffLeave;
import capstone.rt04.retailbackend.request.leave.EndorseRejectLeaveRequest;
import capstone.rt04.retailbackend.request.leave.LeaveCreateRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.LeaveService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveCannotDeleteException;
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

    @DeleteMapping(DELETE_LEAVE)
    public ResponseEntity<?> removeLeave(@PathVariable Long leaveId) throws StaffLeaveNotFoundException, StaffLeaveCannotDeleteException {
        try {
            StaffLeave deletedLeave = leaveService.removeLeave(leaveId);
            return new ResponseEntity<>(deletedLeave, HttpStatus.OK);
        }catch(StaffLeaveCannotDeleteException | StaffNotFoundException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(RETRIEVE_ALL_LEAVES_MANAGER)
    public ResponseEntity<?> retrieveAllLeavesManager(@PathVariable Long staffId) {
        try {
            List<StaffLeave> leaves = leaveService.retrieveAllLeavesManager(staffId);
            return new ResponseEntity<>(leaves, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_PENDING_LEAVES)
    public ResponseEntity<?> retrieveAllPendingLeaves(@PathVariable Long staffId) {
        try {
            List<StaffLeave> leaves = leaveService.retrieveAllPendingLeaves(staffId);
            return new ResponseEntity<>(leaves, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_LEAVES_HR)
    public ResponseEntity<?> retrieveAllEndorsedLeaves() {
        try {
            List<StaffLeave> leaves = leaveService.retrieveAllLeavesHR();
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
           return new ResponseEntity<>(leave, HttpStatus.OK);
       }catch (StaffNotFoundException ex){
           return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
       }catch (StaffLeaveNotFoundException ex){
           return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
       }
    }
}
