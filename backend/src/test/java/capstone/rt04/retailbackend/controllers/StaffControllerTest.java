package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.customer.CustomerLoginRequest;
import capstone.rt04.retailbackend.request.staff.StaffAccountCreateRequest;
import capstone.rt04.retailbackend.request.staff.StaffCreateRequest;
import capstone.rt04.retailbackend.request.staff.StaffLoginRequest;
import capstone.rt04.retailbackend.util.Constants;
import capstone.rt04.retailbackend.util.ErrorMessages;

import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.StaffControllerRoutes.*;

import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffAccountException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;

import static capstone.rt04.retailbackend.util.routeconstants.StoreControllerRoutes.RETRIEVE_STORE_BY_ID;
import static capstone.rt04.retailbackend.util.routeconstants.StoreControllerRoutes.STORE_BASE_ROUTE;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

import static org.assertj.core.api.Assertions.assertThat;
@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class StaffControllerTest extends ApiTestSetup {

    @Test
    public void createInvalidStaff() {
        //Valid address
        Address a = new Address("aba", "aaa", "12345", "blah");
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

}
