package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.entities.StaffLeave;
import capstone.rt04.retailbackend.repositories.LeaveRepository;
import capstone.rt04.retailbackend.repositories.StaffRepository;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.enums.LeaveStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveCannotDeleteException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.CreateNewPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class LeaveService {

    private final ValidationService validationService;
    private final StaffService staffService;
    private final LeaveRepository leaveRepository;
    private final StaffRepository staffRepository;


    public LeaveService(ValidationService validationService, StaffService staffService, LeaveRepository leaveRepository, StaffRepository staffRepository) {
        this.validationService = validationService;
        this.staffService = staffService;
        this.leaveRepository = leaveRepository;
        this.staffRepository = staffRepository;
    }

    public StaffLeave createNewLeave(StaffLeave staffLeave) throws InputDataValidationException, StaffNotFoundException {
        validationService.throwExceptionIfInvalidBean(staffLeave);
        Staff existingStaff = staffRepository.findById(staffLeave.getApplicant().getStaffId())
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + staffLeave.getApplicant().getStaffId() + " does not exist"));

        for(StaffLeave leave : existingStaff.getLeaves()){
            if(staffLeave.getFromDateTime().equals(leave.getFromDateTime()) ||
                    (staffLeave.getFromDateTime().after(leave.getFromDateTime()) && staffLeave.getFromDateTime().before(leave.getToDateTime())) ||
                staffLeave.getFromDateTime().equals(leave.getToDateTime())){
                Map<String, String> errorMap = new HashMap<>();
                errorMap.put("fromDateTime", ErrorMessages.OVERLAP_IN_LEAVE);
                throw new InputDataValidationException(errorMap, ErrorMessages.OVERLAP_IN_LEAVE);
            }
        }

        staffLeave.setStatus(LeaveStatusEnum.PENDING);
        StaffLeave savedLeave = leaveRepository.save(staffLeave);
        existingStaff.getLeaves().add(savedLeave);
        return  savedLeave;

    }

    public StaffLeave deleteLeave(Long leaveId) throws StaffLeaveNotFoundException, StaffLeaveCannotDeleteException {
        StaffLeave leaveToRemove = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new StaffLeaveNotFoundException("Leave with id: " + leaveId + " does not exist"));

        if(leaveToRemove.getEndorser() !=null){
            throw new StaffLeaveCannotDeleteException("Leave has already been endorsed");
        }

        if(leaveToRemove.getApprover() !=null){
            throw new StaffLeaveCannotDeleteException("Leave has already been endorsed and approved");
        }

        leaveRepository.delete(leaveToRemove);
        return leaveToRemove;

    }

    public List<StaffLeave> retrieveAllLeaves(Long staffId) throws StaffNotFoundException {
        Staff existingStaff = staffRepository.findById(staffId)
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + staffId + " does not exist"));
        return existingStaff.getLeaves();
    }
}
