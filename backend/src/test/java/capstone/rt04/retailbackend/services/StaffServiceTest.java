package capstone.rt04.retailbackend.services;

import static org.assertj.core.api.Assertions.assertThat;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.DepartmentRepository;
import capstone.rt04.retailbackend.repositories.RoleRepository;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.enums.RoleNameEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.InvalidLoginCredentialsException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffAccountException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class StaffServiceTest {

    @Autowired
    protected StaffService staffService;
    protected static Role testRole;
    protected static Department testDepartment;
    protected static final String VALID_STAFF_EMAIL ="tonystark@gmail.com";
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    @Autowired
    protected DepartmentRepository departmentRepository;
    @Autowired
    protected RoleRepository roleRepository;
    protected static Long createdStaffId;
    protected static String createdStaffPassword;


    @Before
    public void beforeEachTest() throws Exception{
        Staff expectedValidStaff = new Staff("Bob", "Vance", 10, "S1111111D", VALID_STAFF_EMAIL);

        //Role and department has to be created beforehand
        RoleNameEnum rolename = RoleNameEnum.valueOf("ASSISTANT");
        BigDecimal salary = new BigDecimal(1000);
        testRole = new Role(rolename,salary);
        testDepartment = new Department("ABC");
        Address testAddress = new Address("aba", "aaa", "12345", "blah");
        roleRepository.save(testRole);
        departmentRepository.save(testDepartment);
        Staff testValidStaff = staffService.createNewStaff(expectedValidStaff,testAddress,testRole,testDepartment);
        assertThat(testValidStaff.getStaffId()).isNotNull();
        assertThat(testValidStaff).isEqualTo(expectedValidStaff);
        createdStaffId = testValidStaff.getStaffId();

        createdStaffPassword =(staffService.createNewStaffAccount(createdStaffId)).getPassword();
    }

    @Test
    public void createNewStaff() throws Exception {

        //Valid address
        Address a = new Address("aba", "aaa", "12345", "blah");
        Staff invalidStaff = new Staff("bob", "vance", 10, "S111111D",  "bob@Bob@com");

        try {
           staffService.createNewStaff(invalidStaff, a, testRole, testDepartment);
       } catch (InputDataValidationException ex) {
           Map<String, String> expectedErrorMap = new HashMap<>();
          expectedErrorMap.put("email", ErrorMessages.EMAIL_INVALID);
           assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
        }
   }

   @Test (expected = CreateNewStaffAccountException.class)
    public void createNewStaffAccount() throws Exception {
        //Will throw exception that staff does not exist

           Staff invalidStaff = staffService.createNewStaffAccount(Long.valueOf("12345"));
   }

   @Test (expected = InvalidLoginCredentialsException.class)
   public void staffLogin() throws Exception {
       Staff validStaff = staffService.retrieveStaffByUsername(String.valueOf(createdStaffId));

       Staff loggedInStaff = staffService.staffLogin(String.valueOf(createdStaffId), "spiderman");
       assertThat(loggedInStaff.getStaffId()).isEqualTo(validStaff.getStaffId());

       staffService.staffLogin("invalidEmail@gmail.com", createdStaffPassword);
       staffService.staffLogin(validStaff.getUsername(), "wrongPassword");
   }


    @After
    public void afterEachTest() throws Exception {
        Staff removedStaff = staffService.removeStaff(createdStaffId);
        assertThat(removedStaff.getStaffId()).isEqualTo(createdStaffId);

    }
}
