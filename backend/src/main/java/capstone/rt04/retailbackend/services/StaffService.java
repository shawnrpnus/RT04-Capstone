package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffAccountException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
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
    public Staff createNewStaff (Staff staff,Address staffAddress,BankDetails bankDetails) throws InputDataValidationException, CreateNewStaffException {
        validationService.throwExceptionIfInvalidBean(staff);

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
            //Persist address, bank details and staff. Link staff to address and bank details
            addressRepository.save(staffAddress);
            Staff savedStaff = staffRepository.save(staff);
            savedStaff.setAddress(staffAddress);
            savedStaff.setBankDetails(bankDetails);
            return lazyLoadStaffFields(savedStaff);


        } catch (PersistenceException ex) {
            System.out.println(ex.getMessage());
            throw new CreateNewStaffException("Error creating new staff");
        }
    }

    //staff username will be unique ID
    public Staff createNewStaffAccount(Long staffID) throws CreateNewStaffAccountException {

        try {
            Staff staff = retrieveStaffByStaffId(staffID);
            staff.setUsername(staffID.toString());

            //generate random password
            String Capital_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            String Small_chars = "abcdefghijklmnopqrstuvwxyz";
            String numbers = "0123456789";
            String symbols = "!@#$%^&*_=+-/.?<>)";
            String values = Capital_chars + Small_chars + numbers + symbols;
            Random rndm_method = new Random();
            char[] password = new char[12];
            for (int i = 0; i < 12; i++) {
                password[i] = values.charAt(rndm_method.nextInt(values.length()));

            }
            staff.setPassword(new String(password));

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

    private Staff lazyLoadStaffFields(Staff staff) {
        staff.getAdvertisements().size();
        staff.getDeliveries().size();
        staff.getLeaves().size();
        staff.getDepartment();
        staff.getPayrolls().size();
        staff.getRole();
        staff.getRoster();
        staff.getRepliedReviews().size();

        return staff;
    }
}
