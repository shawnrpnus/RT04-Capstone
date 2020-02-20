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

    //Valid staff ID/username
    protected static Long createdStaffId;
    //Password created for test valid staff
    protected static String createdStaffPassword;


    @Before
    public void beforeEachTest() throws Exception{
        Staff expectedValidStaff = new Staff("Bob", "Vance", 10, "S1111111D", VALID_STAFF_EMAIL);

        //Role and department has to be created beforehand
        RoleNameEnum rolename = RoleNameEnum.valueOf("ASSISTANT");
        BigDecimal salary = new BigDecimal(1000);
        testRole = staffService.createNewRole(rolename, salary);

        testDepartment = staffService.createNewDepartment("ABC");

        Address testAddress = new Address("aba", "aaa", "12345", "blah");

        Staff testValidStaff = staffService.createNewStaff(expectedValidStaff,testAddress,testRole,testDepartment);
        assertThat(testValidStaff.getStaffId()).isNotNull();
        assertThat(testValidStaff).isEqualTo(expectedValidStaff);
        createdStaffId = testValidStaff.getStaffId();

        testValidStaff = staffService.createNewStaffAccount(createdStaffId);
        assertThat(testValidStaff.getPassword()).isNotNull();
        assertThat(testValidStaff.getUsername()).isEqualTo(String.valueOf(createdStaffId));
        assertThat(testValidStaff.getStaffId()).isEqualTo(createdStaffId);
        createdStaffPassword = testValidStaff.getPassword();
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

    @Test
    public void createNewValidStaffAccount() throws Exception {
        Staff validStaff = staffService.createNewStaffAccount(createdStaffId);
        assertThat(validStaff.getStaffId()).isEqualTo(createdStaffId);
    }


   @Test (expected = InvalidLoginCredentialsException.class)
   public void staffLogin() throws Exception {
        //Username = ID of staff
       //Check here that retrieveStaffByUsername works
       Staff validStaff = staffService.retrieveStaffByUsername(String.valueOf(createdStaffId));
       assertThat(validStaff.getStaffId()).isEqualTo(createdStaffId);

       //Correct login
       Staff loggedInStaff = staffService.staffLogin(String.valueOf(createdStaffId), createdStaffPassword);
       assertThat(loggedInStaff.getStaffId()).isEqualTo(validStaff.getStaffId());

       //Incorrect Login
       loggedInStaff = staffService.staffLogin("poop", createdStaffPassword);
       loggedInStaff= staffService.staffLogin(String.valueOf(createdStaffId),"usuck");


   }

   //Test for both invalid old password and valid old password
    @Test (expected = InvalidLoginCredentialsException.class)
    public void changeStaffPassword() throws Exception {
        //Username = ID of staff
        Staff validStaff = staffService.retrieveStaffByUsername(String.valueOf(createdStaffId));
        String newPasswordRaw = "password";

        //Expect invalid login credentials
        staffService.changeStaffPassword(validStaff.getStaffId(), "invalidOldPassword", newPasswordRaw);

        staffService.changeStaffPassword(validStaff.getStaffId(), createdStaffPassword, newPasswordRaw);
        validStaff = staffService.retrieveStaffByUsername(String.valueOf(createdStaffId));
        assertThat(encoder.matches(newPasswordRaw, validStaff.getPassword())).isTrue();
    }

    @Test (expected = StaffNotFoundException.class)
    public void resetStaffPassword() throws Exception {
        //Username = ID of staff
        //IT keys in staffID which is equivalent to the username
        //Test successful reset
        Staff validStaff = staffService.retrieveStaffByUsername(String.valueOf(createdStaffId));
        Staff staffAfterReset = staffService.resetPassword(validStaff.getStaffId());
        assertThat(staffAfterReset.getStaffId()).isEqualTo(validStaff.getStaffId());

        //Expect Staff not found exception
        staffAfterReset = staffService.resetPassword(Long.valueOf("420"));
    }


    @After
    public void afterEachTest() throws Exception {
        Staff removedStaff = staffService.removeStaff(createdStaffId);
        assertThat(removedStaff.getStaffId()).isEqualTo(createdStaffId);

    }
}
