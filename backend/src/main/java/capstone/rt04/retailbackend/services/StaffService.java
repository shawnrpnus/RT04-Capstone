package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@Transactional
public class StaffService {
    private JavaMailSender javaMailSender;

    private final Environment environment;

    private final ValidationService validationService;

    private final StaffRepository staffRepository;
    private final AddressRepository addressRepository;
    private final AdvertisementRepository advertisementRepository;
    private final DeliveryRepository deliveryRepository;
    private final DepartmentRepository departmentRepository;
    private final StaffLeaveRepository staffLeaveRepository;
    private final PayrollRepository payrollRepository;
    private final ReviewRepository reviewRepository;
    private final RoleRepository roleRepository;
    private final RosterRepository rosterRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();




    public StaffService(JavaMailSender javaMailSender, Environment environment, ValidationService validationService, StaffRepository staffRepository, AddressRepository addressRepository, AdvertisementRepository advertisementRepository, DeliveryRepository deliveryRepository, DepartmentRepository departmentRepository, StaffLeaveRepository staffLeaveRepository, ReviewRepository reviewRepository, PayrollRepository payrollRepository, RoleRepository roleRepository, RosterRepository rosterRepository) {
        this.javaMailSender = javaMailSender;
        this.environment = environment;
        this.validationService = validationService;
        this.staffRepository = staffRepository;
        this.addressRepository = addressRepository;
        this.advertisementRepository = advertisementRepository;
        this.deliveryRepository = deliveryRepository;
        this.departmentRepository = departmentRepository;
        this.staffLeaveRepository = staffLeaveRepository;
        this.reviewRepository = reviewRepository;
        this.payrollRepository = payrollRepository;
        this.roleRepository = roleRepository;
        this.rosterRepository = rosterRepository;
    }

    //staff entity: first name, last name, nric, username&password(to be configured by admin),leave remaining
    //for HR to create staff. HR supplies, first name, last name, nric, address, bank details,
    //role, department.
    public Staff createNewStaff (Staff staff,Address staffAddress, Role role, Department department) throws InputDataValidationException, CreateNewStaffException {
        validationService.throwExceptionIfInvalidBean(staff);
        validationService.throwExceptionIfInvalidBean(staffAddress);

        try{
           Staff existingStaff = null;

            try {
                existingStaff = retrieveStaffByNRIC(staff.getNric());
            } catch (StaffNotFoundException ex) {
            }

            if (existingStaff != null) {
                Map<String, String> errorMap = new HashMap<>();
                errorMap.put("nric", ErrorMessages.NRIC_TAKEN);
                throw new InputDataValidationException(errorMap, ErrorMessages.NRIC_TAKEN);
            }

            //If staff does not exist
            //Role and department already created beforehand
            //Only address is new
            addressRepository.save(staffAddress);
            Staff savedStaff = staffRepository.save(staff);
            savedStaff.setAddress(staffAddress);
            savedStaff.setRole(role);
            savedStaff.setDepartment(department);
            return lazyLoadStaffFields(savedStaff);


        } catch (PersistenceException ex) {
            throw new CreateNewStaffException("Error creating new staff");
        }
    }

    //For admin to configure staff account
    //staff username will be unique ID
    public Staff createNewStaffAccount(Long staffID) throws CreateNewStaffAccountException {

        try {
            Staff staff = retrieveStaffByStaffId(staffID);
            staff.setUsername(staffID.toString());

            //generate random password
            String password = RandomStringUtils.randomAlphanumeric(12);
            staff.setPassword(encoder.encode(password));

            return staff;
        }catch (StaffNotFoundException ex){
            throw new CreateNewStaffAccountException("Staff does not exist");
        }

    }

    //for HR to retrieve all staff
    public List<Staff> retrieveAllStaff() {
        List<Staff> allStaff= staffRepository.findAll();

        for (Staff staff : allStaff) {
            staff.getLeaves().size();
            staff.getRepliedReviews().size();
            staff.getRoster();
            staff.getRole();
            staff.getDepartment();
            staff.getPayrolls().size();
            staff.getDeliveries().size();
            staff.getBankDetails();
            staff.getAddress();
            staff.getAdvertisements().size();
        }
        return allStaff;
    }

    public Staff retrieveStaffByStaffId(Long staffId) throws StaffNotFoundException {
//        if (staffId == null) {
//            throw new StaffNotFoundException("Staff ID not provided");
//        }
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + staffId + " does not exist"));
        return lazyLoadStaffFields(staff);
    }

    public Staff retrieveStaffByUsername(String username) throws StaffNotFoundException {
        Staff staff = staffRepository.findByUsername(username)
                .orElseThrow(() -> new StaffNotFoundException("Staff username: " + username + "does not exist!"));

        return lazyLoadStaffFields(staff);
    }

    private Staff retrieveStaffByNRIC(String nric) throws StaffNotFoundException {
        Staff staff = staffRepository.findByNric(nric)
                .orElseThrow(() -> new StaffNotFoundException("Staff NRIC: " + nric + "does not exist!"));

        return lazyLoadStaffFields(staff);
    }

    //For HR to update first name, last name, NRIC, bank details, department , role, address
    public Staff updateStaffDetails(Staff staff, Role role, Department department, Address address)throws UpdateStaffDetailsException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(staff);
        validationService.throwExceptionIfInvalidBean(address);
        try {
            Staff staffToUpdate = retrieveStaffByStaffId(staff.getStaffId());
            addressRepository.save(address);

            staffToUpdate.setFirstName(staff.getFirstName());
            staffToUpdate.setLastName(staff.getLastName());
            staffToUpdate.setNric(staff.getNric());
            staffToUpdate.setBankDetails(staff.getBankDetails());
            staffToUpdate.setDepartment(department);
            staffToUpdate.setRole(role);
            staffToUpdate.setAddress(address);

            return lazyLoadStaffFields(staffToUpdate);
        }catch (StaffNotFoundException ex) {
            throw new UpdateStaffDetailsException("Staff does not exist");
        }

    }


    private Staff lazyLoadStaffFields(Staff staff) {
        staff.getAdvertisements().size();
        staff.getDeliveries().size();
        staff.getLeaves().size();
        staff.getPayrolls().size();
        staff.getRoster();
        staff.getRepliedReviews().size();

        return staff;
    }
}
