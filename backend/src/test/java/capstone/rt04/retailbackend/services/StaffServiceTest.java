package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.DepartmentRepository;
import capstone.rt04.retailbackend.repositories.RoleRepository;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.enums.RoleNameEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.staff.InvalidStaffCredentialsException;
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
import java.sql.Time;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class StaffServiceTest {

    @Autowired
    protected StaffService staffService;
    protected static Role testRole;
    protected static String username;
    protected static Department testDepartment;
    protected static Store testStore;
    protected static final String VALID_STAFF_EMAIL ="tonystark@gmail.com";
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    @Autowired
    protected DepartmentRepository departmentRepository;
    @Autowired
    protected RoleRepository roleRepository;
    @Autowired
    protected StoreService storeService;

    //Valid staff ID/username
    protected static Long createdStaffId;
    protected static String createdStaffUsername;
    //Password created for test valid staff
    protected static String createdStaffPassword = "password";


    @Before
    public void beforeEachTest() throws Exception{
        BigDecimal salary = new BigDecimal(1000);
        Staff expectedValidStaff = new Staff("Bob", "Vance", 10, "S1111111D", VALID_STAFF_EMAIL, salary);

        //Role and department has to be created beforehand
        RoleNameEnum rolename = RoleNameEnum.valueOf("ASSISTANT");

        testRole = staffService.createNewRole(rolename);

        testDepartment = staffService.createNewDepartment("ABC");

        Store expectedValidStore = new Store("Store 1", 8, 4, Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 2, 6, null);
        testStore = storeService.createNewStore(expectedValidStore);

        Address testAddress = new Address("aba", "aaa", "123456", "blah");

        Staff testValidStaff = staffService.createNewStaff(expectedValidStaff,testAddress,testRole.getRoleId(),testDepartment.getDepartmentId(), testStore.getStoreId());
        assertThat(testValidStaff.getStaffId()).isNotNull();
        assertThat(testValidStaff).isEqualTo(expectedValidStaff);
        createdStaffId = testValidStaff.getStaffId();
        createdStaffUsername = testValidStaff.getFirstName()+testValidStaff.getLastName()+createdStaffId.toString();

        List<Long> staff1 = new ArrayList<>();
        staff1.add(createdStaffId);
        List<Staff> staffList = staffService.createNewStaffAccount(staff1);
        testValidStaff=staffList.get(0);
        username = testValidStaff.getUsername();
        assertThat(testValidStaff.getPassword()).isNotNull();
        assertThat(testValidStaff.getUsername()).isEqualTo(createdStaffUsername);
        assertThat(testValidStaff.getStaffId()).isEqualTo(createdStaffId);
        System.out.println("tHIS IS ENCODED PW:" + createdStaffPassword);
    }

    @Test
    public void createNewStaff() throws Exception {

        //Valid address
        Address a = new Address("aba", "aaa", "123456", "blah");
        BigDecimal salary = new BigDecimal(1000);
        Staff invalidStaff = new Staff("bob", "vance", 10, "S111111D",  "bob@Bob@com", salary);

        try {
           staffService.createNewStaff(invalidStaff, a, testRole.getRoleId(), testDepartment.getDepartmentId(), testStore.getStoreId());
       } catch (InputDataValidationException ex) {
           Map<String, String> expectedErrorMap = new HashMap<>();
          expectedErrorMap.put("email", ErrorMessages.EMAIL_INVALID);
           assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
        }
   }
//
//   @Test (expected = CreateNewStaffAccountException.class)
//    public void createNewStaffAccount() throws Exception {
//        //Will throw exception that staff does not exist
//
//           Staff invalidStaff = staffService.createNewStaffAccount(Long.valueOf("12345"));
//   }

//    @Test
//    public void createNewValidStaffAccount() throws Exception {
//        Staff validStaff = staffService.createNewStaffAccount(createdStaffId);
//        assertThat(validStaff.getStaffId()).isEqualTo(createdStaffId);
//    }


   @Test (expected = InvalidStaffCredentialsException.class)
   public void staffLogin() throws Exception {
        //Username = ID of staff
       //Check here that retrieveStaffByUsername works
       Staff validStaff = staffService.retrieveStaffByStaffId(createdStaffId);
       assertThat(validStaff.getStaffId()).isEqualTo(createdStaffId);

       //Correct login
       Staff loggedInStaff = staffService.staffLogin(String.valueOf(createdStaffId), createdStaffPassword);
       assertThat(loggedInStaff.getStaffId()).isEqualTo(validStaff.getStaffId());

       //Incorrect Login
       loggedInStaff = staffService.staffLogin("poop", createdStaffPassword);
       loggedInStaff= staffService.staffLogin(String.valueOf(createdStaffId),"usuck");


   }

   //Test for both invalid old password and valid old password
    @Test
    public void changeStaffPassword() throws Exception {
        //Username = ID of staff
        Staff validStaff = staffService.retrieveStaffByStaffId(createdStaffId);
        String newPasswordRaw = "password12345";

        staffService.changeStaffPassword(validStaff.getStaffId(), createdStaffPassword, newPasswordRaw, newPasswordRaw);
        validStaff = staffService.retrieveStaffByStaffId(createdStaffId);
        assertThat(encoder.matches(newPasswordRaw, validStaff.getPassword())).isTrue();

        try {
            staffService.changeStaffPassword(validStaff.getStaffId(), "wrongoldpassword",newPasswordRaw, newPasswordRaw);
        } catch (InvalidStaffCredentialsException ex) {
            Map<String, String> expectedErrorMap = new HashMap<>();
            expectedErrorMap.put("password", ErrorMessages.OLD_PASSWORD_INCORRECT);
            assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
        }
    }


    public void resetStaffPasswordSuccess() throws Exception {
        //Username = ID of staff
        //IT keys in staffID which is equivalent to the username
        //Test successful reset
        Staff validStaff = staffService.retrieveStaffByStaffId(createdStaffId);
        Staff staffAfterReset = staffService.resetPassword(username);
        assertThat(staffAfterReset.getStaffId()).isEqualTo(validStaff.getStaffId());
    }
    @Test (expected = StaffNotFoundException.class)
    public void resetStaffPasswordFail() throws Exception {
        //Expect Staff not found exception
        Staff staffAfterReset = staffService.resetPassword("ddddd");

    }


    @After
    public void afterEachTest() throws Exception {
        Staff removedStaff = staffService.removeStaff(createdStaffId);
        assertThat(removedStaff.getStaffId()).isEqualTo(createdStaffId);

    }
}
