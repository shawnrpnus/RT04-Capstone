package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.entities.StaffLeave;
import capstone.rt04.retailbackend.repositories.LeaveRepository;
import capstone.rt04.retailbackend.repositories.StaffRepository;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.enums.LeaveStatusEnum;
import capstone.rt04.retailbackend.util.enums.RoleNameEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveCannotCreateException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveCannotDeleteException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveCannotUpdateException;
import capstone.rt04.retailbackend.util.exceptions.leave.StaffLeaveNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.CreateNewPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Date;

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

    public StaffLeave createNewLeave(StaffLeave staffLeave) throws InputDataValidationException, StaffNotFoundException, StaffLeaveCannotCreateException {
        validationService.throwExceptionIfInvalidBean(staffLeave);
        Staff existingStaff = staffRepository.findById(staffLeave.getApplicant().getStaffId())
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + staffLeave.getApplicant().getStaffId() + " does not exist"));

        //When end date is before start date
        if(staffLeave.getToDateTime().isBefore(staffLeave.getFromDateTime())){
            throw new StaffLeaveCannotCreateException("Invalid dates selected: Start date is after end date!");
        }

        LocalDate today = LocalDate.now();

        if(staffLeave.getFromDateTime().isBefore(today)){
            throw new StaffLeaveCannotCreateException("Invalid dates selected: Start date is before today's date!");
        }

        //When dates overlap with previous applied leaves' date
        for(StaffLeave leave : existingStaff.getLeaves()){
            if(
                    (!leave.getStatus().equals(LeaveStatusEnum.REJECTED)) && (

                    staffLeave.getFromDateTime().equals(leave.getFromDateTime()) ||
                    (
                            staffLeave.getFromDateTime().isAfter(leave.getFromDateTime()) && staffLeave.getFromDateTime().isBefore(leave.getToDateTime())
                    ) || (
                            staffLeave.getFromDateTime().isBefore(leave.getFromDateTime()) && (staffLeave.getToDateTime().isAfter(leave.getFromDateTime()) && (staffLeave.getToDateTime().isBefore(leave.getToDateTime())||staffLeave.getToDateTime().isAfter(leave.getToDateTime()) ))
                    ) || ((staffLeave.getFromDateTime().isAfter(leave.getFromDateTime()) && staffLeave.getFromDateTime().isBefore(leave.getToDateTime()) )

                            ) ||
                staffLeave.getFromDateTime().equals(leave.getToDateTime())

            )

            ){
                throw new StaffLeaveCannotCreateException( "Invalid dates selected: Please make sure dates do not overlap with previous applied leaves!");
            }
        }

        int count= 0;
        for (LocalDate date = staffLeave.getFromDateTime(); (date.isBefore(staffLeave.getToDateTime()) || date.equals(staffLeave.getToDateTime())); date = date.plusDays(1)) {
                count++;
        }

        staffLeave.setNumDays(count);
        if(staffLeave.getApplicant().getRole().getRoleName().equals(RoleNameEnum.MANAGER)){
            staffLeave.setStatus(LeaveStatusEnum.ENDORSED);
        } else if (staffLeave.getApplicant().getDepartment().getDepartmentName().equals("HR")){
            staffLeave.setStatus(LeaveStatusEnum.APPROVED);
        } else {
            staffLeave.setStatus(LeaveStatusEnum.PENDING);
        }

        StaffLeave savedLeave = leaveRepository.save(staffLeave);
        existingStaff.getLeaves().add(savedLeave);
        return  savedLeave;

    }

    public StaffLeave updateLeave(Long leaveId, Staff applicant, LocalDate fromDate, LocalDate toDate) throws InputDataValidationException, StaffNotFoundException, StaffLeaveCannotUpdateException, StaffLeaveNotFoundException {
        StaffLeave existingLeave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new StaffLeaveNotFoundException("Leave with id: " + leaveId + " does not exist"));

        Staff existingStaff = staffRepository.findById(applicant.getStaffId())
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + applicant.getStaffId() + " does not exist"));
        if(existingStaff.getDepartment().getDepartmentName().equals("HR")){

        } else if(existingStaff.getRole().getRoleName().equals(RoleNameEnum.MANAGER)){
            if(existingLeave.getStatus().equals(LeaveStatusEnum.APPROVED)){
                throw new StaffLeaveCannotUpdateException("Leave has already been approved");
            }

        } else{
            //When staff leave had already been approved or endorsed
            if(existingLeave.getStatus().equals(LeaveStatusEnum.APPROVED) || existingLeave.getStatus().equals(LeaveStatusEnum.ENDORSED)){
                String e = existingLeave.getStatus().toString();
                throw new StaffLeaveCannotUpdateException("Leave has already been " + e);
            }
        }



        LocalDate today = LocalDate.now();

        if(fromDate.isBefore(today)){
            throw new StaffLeaveCannotUpdateException("Invalid dates selected: Start date is before today's date!");
        }


        //When end date is before start date
        if(toDate.isBefore(fromDate)){
            throw new StaffLeaveCannotUpdateException("Invalid dates selected: Start date is after end date!");
        }

        //When dates overlap with previous applied leaves' date
        for(StaffLeave leave : existingStaff.getLeaves()){
            if(!leave.getStaffLeaveId().equals(leaveId) &&
                    ((!leave.getStatus().equals(LeaveStatusEnum.REJECTED))&&
                            (

                                   fromDate.equals(leave.getFromDateTime()) ||
                                            (
                                                    fromDate.isAfter(leave.getFromDateTime()) && fromDate.isBefore(leave.getToDateTime())
                                            ) || (
                                           fromDate.isBefore(leave.getFromDateTime()) && (toDate.isAfter(leave.getFromDateTime()) && (toDate.isBefore(leave.getToDateTime())|| toDate.isAfter(leave.getToDateTime())))
                                    ) || ((fromDate.isAfter(leave.getFromDateTime()) && fromDate.isBefore(leave.getToDateTime()) )

                                    ) ||
                                           fromDate.equals(leave.getToDateTime())

                            )

                    ) ){
                throw new StaffLeaveCannotUpdateException( "Invalid dates selected: Please make sure dates do not overlap with previous applied leaves!");
            }
        }

        int count= 0;
        for (LocalDate date = fromDate; (date.isBefore(toDate) || date.equals(toDate)); date = date.plusDays(1)) {
            count++;
        }
        existingLeave.setNumDays(count);
        existingLeave.setToDateTime(toDate);
        existingLeave.setFromDateTime(fromDate);
        return  existingLeave;

    }

    public List<StaffLeave> retrieveAllLeaves(Long staffId) throws StaffNotFoundException {
        Staff existingStaff = staffRepository.findById(staffId)
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + staffId + " does not exist"));
        return existingStaff.getLeaves();
    }

    public StaffLeave removeLeave(Long leaveId) throws StaffLeaveCannotDeleteException, StaffLeaveNotFoundException, StaffNotFoundException {
        StaffLeave existingLeave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new StaffLeaveNotFoundException("Leave with id: " + leaveId + " does not exist"));

        Staff staff = staffRepository.findById(existingLeave.getApplicant().getStaffId())
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + existingLeave.getApplicant().getStaffId() + " does not exist"));

        if(staff.getDepartment().getDepartmentName().equals("HR")){

        } else if(staff.getRole().getRoleName().equals(RoleNameEnum.MANAGER)){
            if(existingLeave.getStatus().equals(LeaveStatusEnum.APPROVED)){
                throw new StaffLeaveCannotDeleteException("Leave has already been approved");
            }

        } else{
            //When staff leave had already been approved or endorsed
            if(existingLeave.getStatus().equals(LeaveStatusEnum.APPROVED) || existingLeave.getStatus().equals(LeaveStatusEnum.ENDORSED)){
                String e = existingLeave.getStatus().toString();
                throw new StaffLeaveCannotDeleteException("Leave has already been " + e);
            }
        }

        staff.getLeaves().remove(existingLeave);
        leaveRepository.delete(existingLeave);
        return existingLeave;
    }

    public List<StaffLeave> retrieveAllLeavesManager(Long staffId) throws StaffNotFoundException {
        Staff manager = staffRepository.findById(staffId)
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + staffId + " does not exist"));

        List<Staff> staffList = new ArrayList<Staff>();
        if(manager.getDepartment().getDepartmentName().equals("Store")){
            staffList = staffRepository.findAllByStore_StoreId(manager.getStore().getStoreId());
        } else {
            staffList = staffRepository.findByDepartment(manager.getDepartment());
        }

        List<StaffLeave> leaves = new ArrayList<StaffLeave>();
        for(Staff staff : staffList){
            for(StaffLeave leave : staff.getLeaves()){
                leaves.add(leave);
            }
        }

        return leaves;
    }

    public List<StaffLeave> retrieveAllPendingLeaves(Long staffId) throws StaffNotFoundException {
        Staff manager = staffRepository.findById(staffId)
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + staffId + " does not exist"));

        List<Staff> staffList = new ArrayList<Staff>();
        if(manager.getDepartment().getDepartmentName().equals("Store")){
            staffList = staffRepository.findAllByStore_StoreId(manager.getStore().getStoreId());
        } else {
            staffList = staffRepository.findByDepartment(manager.getDepartment());
        }

        List<StaffLeave> leaves = new ArrayList<StaffLeave>();
        for(Staff staff : staffList){
            for(StaffLeave leave : staff.getLeaves()){
                if(leave.getStatus().equals(LeaveStatusEnum.PENDING)) {
                    leaves.add(leave);
                }
            }
        }

        return leaves;
    }

    public List<StaffLeave> retrieveAllLeavesHR(){
        List<StaffLeave> allLeaves = leaveRepository.findAll();
        List<StaffLeave> leaves = new ArrayList<StaffLeave>();

        for(StaffLeave leave : allLeaves){
            if(leave.getStatus().equals(LeaveStatusEnum.APPROVED)){
                leaves.add(leave);
            } if(leave.getRejectedBy() != null){
                if(leave.getRejectedBy().getDepartment().getDepartmentName().equals("HR")){
                    leaves.add(leave);
                }
            }
        }
        return leaves;
    }

    public List<StaffLeave> retrieveAllEndorsedLeaves(){
        List<StaffLeave> allLeaves = (List<StaffLeave>) leaveRepository.findAll();
        List<StaffLeave> leaves = new ArrayList<StaffLeave>();

        for(StaffLeave leave : allLeaves){
            if(leave.getStatus().equals(LeaveStatusEnum.ENDORSED)){
                leaves.add(leave);
            }
        }
        return leaves;
    }

    public StaffLeave endorseRejectLeave (Long leaveId, Long managerId, Boolean action) throws StaffNotFoundException, StaffLeaveNotFoundException {
        Staff manager = staffRepository.findById(managerId)
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + managerId + " does not exist"));

        StaffLeave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new StaffLeaveNotFoundException("Leave with id: " + leaveId + " does not exist"));

        if(action == true){
            leave.setStatus(LeaveStatusEnum.ENDORSED);
            leave.setEndorser(manager);
        } else{
            leave.setStatus(LeaveStatusEnum.REJECTED);
            leave.setRejectedBy(manager);
        }

        return leave;
    }

    public StaffLeave approveRejectLeave (Long leaveId, Long hrId, Boolean action) throws StaffNotFoundException, StaffLeaveNotFoundException {
        Staff hr = staffRepository.findById(hrId)
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + hrId + " does not exist"));

        StaffLeave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new StaffLeaveNotFoundException("Leave with id: " + leaveId + " does not exist"));

        if(action == true){
            leave.setStatus(LeaveStatusEnum.APPROVED);
            leave.setApprover(hr);
        } else{
            leave.setStatus(LeaveStatusEnum.REJECTED);
            leave.setRejectedBy(hr);
        }

        return leave;
    }
}
