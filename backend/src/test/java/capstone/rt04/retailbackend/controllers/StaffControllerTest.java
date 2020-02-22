package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.DepartmentRepository;
import capstone.rt04.retailbackend.repositories.RoleRepository;
import capstone.rt04.retailbackend.request.customer.CustomerLoginRequest;
import capstone.rt04.retailbackend.request.staff.*;
import capstone.rt04.retailbackend.util.Constants;
import capstone.rt04.retailbackend.util.ErrorMessages;

import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.StaffControllerRoutes.*;

import capstone.rt04.retailbackend.util.enums.RoleNameEnum;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffAccountException;
import io.restassured.RestAssured;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import java.math.BigDecimal;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class StaffControllerTest{

    @LocalServerPort
    int port;
    protected static Role testRole;
    protected static Department testDepartment;
    protected static Long createdStaffId;
    protected static String VALID_STAFF_PASSWORD;
    protected static final String VALID_STAFF_EMAIL = "tonystark@gmail.com";
    @Autowired
    protected DepartmentRepository departmentRepository;
    @Autowired
    protected RoleRepository roleRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Before
    public void setUp() throws Exception {
        RestAssured.port = port;
        Staff expectedValidStaff = new Staff("Bob", "Vance", 10, "S1111111D", VALID_STAFF_EMAIL);

        //Role and department has to be created beforehand
        RoleNameEnum rolename = RoleNameEnum.valueOf("ASSISTANT");
        BigDecimal salary = new BigDecimal(1000);
        RoleCreateRequest roleCreateRequest = new RoleCreateRequest(rolename, salary);
        testRole = given().
                contentType("application/json").
                body(roleCreateRequest).
                when().post(STAFF_BASE_ROUTE + CREATE_NEW_ROLE).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Role.class);
        assertThat(testRole.getRoleId()).isNotNull();

        DepartmentCreateRequest departmentCreateRequest = new DepartmentCreateRequest("abc");
        testDepartment = given().
                contentType("application/json").
                body(departmentCreateRequest).
                when().post(STAFF_BASE_ROUTE + CREATE_NEW_DEPARTMENT).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Department.class);
        assertThat(testDepartment.getDepartmentId()).isNotNull();

        Address testAddress = new Address("aba", "aaa", 123456, "blah");

        StaffCreateRequest staffCreateRequest = new StaffCreateRequest(expectedValidStaff, testAddress, testRole, testDepartment);

        Staff createdStaff = given().
                contentType("application/json").
                body(staffCreateRequest).
                when().post(STAFF_BASE_ROUTE + CREATE_NEW_STAFF).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Staff.class);

        assertThat(createdStaff.getStaffId()).isNotNull();
        createdStaffId = createdStaff.getStaffId();

        StaffAccountCreateRequest req = new StaffAccountCreateRequest(createdStaffId);
        createdStaff = given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + CREATE_NEW_STAFF_ACCOUNT)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Staff.class);
        assertThat(createdStaff.getStaffId()).isEqualTo(createdStaffId);
        VALID_STAFF_PASSWORD = createdStaff.getPassword();
        System.out.println("This is valid staff hashed password:"+ VALID_STAFF_PASSWORD);
    }

    @After
    public void tearDown() throws Exception {
        Staff deletedStaff = given().
                pathParam("staffId", createdStaffId).
                when().delete(STAFF_BASE_ROUTE + DELETE_STAFF).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Staff.class);

        assertThat(deletedStaff.getStaffId().equals(createdStaffId));
        createdStaffId = null;

    }

    @Test
    public void createInvalidStaff() {
        //Valid address
        Address a = new Address("aba", "aaa", 123456, "blah");
        Staff invalidStaff = new Staff("bob", "vance", 10, "S111111D", "bob@Bob@com");


        StaffCreateRequest staffCreateRequest = new StaffCreateRequest(invalidStaff, a, testRole, testDepartment);

        given().
                contentType("application/json").
                body(staffCreateRequest).
                when().post(STAFF_BASE_ROUTE + CREATE_NEW_STAFF).
                then().statusCode(HttpStatus.BAD_REQUEST.value()).
                body("email", equalTo(ErrorMessages.EMAIL_INVALID));

    }

    @Test
    public void createNewStaffAccount() {
        //Invalid staff ID.
        StaffAccountCreateRequest req = new StaffAccountCreateRequest(Long.valueOf("123"));

        given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + CREATE_NEW_STAFF_ACCOUNT)
                .then().statusCode(HttpStatus.NOT_FOUND.value());

        req = new StaffAccountCreateRequest(createdStaffId);
       Staff createdStaff = given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + CREATE_NEW_STAFF_ACCOUNT)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Staff.class);
       assertThat(createdStaff.getStaffId()).isEqualTo(createdStaffId);

    }

    @Test
    public void login() {
        //valid credentials, successful login
        StaffLoginRequest req = new StaffLoginRequest(createdStaffId.toString(), VALID_STAFF_PASSWORD);
        Staff loginStaff = given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + LOGIN_STAFF)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Staff.class);
        assertThat(loginStaff.getStaffId()).isEqualTo(createdStaffId);

        //Invalid username, valid password
        req = new StaffLoginRequest("0406", VALID_STAFF_PASSWORD);

        given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + LOGIN_STAFF)
                .then().statusCode(HttpStatus.BAD_REQUEST.value());

        //Invalid password, valid username
        req = new StaffLoginRequest(String.valueOf(createdStaffId), "ohhowtheturntableshave");
        given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + LOGIN_STAFF)
                .then().statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void changePassword() {
         //Valid staff ID, invalid staff old password
        StaffChangePasswordRequest req = new StaffChangePasswordRequest(createdStaffId, "INVALID OLD PW", "NEW PW");
        given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + CHANGE_STAFF_PASSWORD)
                .then().statusCode(HttpStatus.BAD_REQUEST.value());

        //Successful change
        String newPasswordRaw = "password";
        req =  new StaffChangePasswordRequest(createdStaffId, VALID_STAFF_PASSWORD, newPasswordRaw);
        System.out.println("This is original hashed:"+VALID_STAFF_PASSWORD);
        Staff s = given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + CHANGE_STAFF_PASSWORD)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Staff.class);
        assertThat(encoder.matches(newPasswordRaw, s.getPassword())).isTrue();
    }

    @Test
    public void resetPassword(){
        //Invalid staff ID
        ResetStaffPasswordRequest req = new ResetStaffPasswordRequest(Long.valueOf("9999"));
        given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + RESET_STAFF_PASSWORD)
                .then().statusCode(HttpStatus.NOT_FOUND.value());

        //Valid staff ID, successful reset
        req = new ResetStaffPasswordRequest(createdStaffId);
        Staff s = given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + RESET_STAFF_PASSWORD)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Staff.class);
        assertThat(s.getPassword()).isNotNull();
        assertThat(encoder.matches(s.getPassword(), VALID_STAFF_PASSWORD)).isFalse();

    }


}
