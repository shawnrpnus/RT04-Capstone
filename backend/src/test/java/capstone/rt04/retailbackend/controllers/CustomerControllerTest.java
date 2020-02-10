package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.entities.CreditCard;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.request.customer.*;
import capstone.rt04.retailbackend.util.ErrorMessages;

import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

import static org.assertj.core.api.Assertions.assertThat;
@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class CustomerControllerTest {

    private static final String VALID_CUST_EMAIL = "tonystark@gmail.com";
    private static final String VALID_CUST_PASSWORD = "spiderman";

    private static Long createdCustomerId;
    private static String verificationCode;

    @Before
    public void setUp() throws Exception {
        Customer validCustomer = new Customer("Tony", "Stark", VALID_CUST_EMAIL, VALID_CUST_PASSWORD);
        Customer createdCustomer = given().
                contentType("application/json").
                body(validCustomer).
                when().post(CUSTOMER_BASE_ROUTE + CREATE_NEW_CUSTOMER).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Customer.class);
        //body("email", equalTo(validCustomer.getEmail()));
        System.out.println(validCustomer.getCustomerId());
        System.out.println(createdCustomer.getCustomerId());
        assertThat(createdCustomer.getCustomerId()).isNotNull();
        assertThat(createdCustomer.getEmail()).isEqualTo(validCustomer.getEmail());
        assertThat(createdCustomer.getOnlineShoppingCart()).isNotNull();
        assertThat(createdCustomer.getInStoreShoppingCart()).isNotNull();
        createdCustomerId = createdCustomer.getCustomerId();
        verificationCode = createdCustomer.getVerificationCode().getCode();
    }

    @After
    public void tearDown() throws Exception {
        Customer deletedCustomer = given().
                pathParam("customerId", createdCustomerId).
                when().delete(CUSTOMER_BASE_ROUTE + DELETE_CUSTOMER).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);

        assertThat(deletedCustomer.getCustomerId().equals(createdCustomerId));
        createdCustomerId = null;
    }

    @Test
    public void createInvalidCustomer() {
        Customer invalidCustomer = new Customer("Steve", "Rogers", "steve@tony@bucky", "blablabla");
        given().
                contentType("application/json").
                body(invalidCustomer).
                when().post(CUSTOMER_BASE_ROUTE + CREATE_NEW_CUSTOMER).
                then().statusCode(HttpStatus.BAD_REQUEST.value()).
                body("email", equalTo(ErrorMessages.EMAIL_INVALID));
    }

    @Test
    public void deleteCustomerThatDoesNotExist() {
        given().
                pathParam("customerId", 91293129).
                when().delete(CUSTOMER_BASE_ROUTE + DELETE_CUSTOMER).
                then().statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void getCustomerByEmail() {
        CustomerEmailRequest req = new CustomerEmailRequest(VALID_CUST_EMAIL);
        Customer customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + GET_CUSTOMER_BY_EMAIL)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        CustomerEmailRequest badReq = new CustomerEmailRequest("invalidemail@invalid.com");
        given()
                .contentType("application/json")
                .body(badReq)
                .when().post(CUSTOMER_BASE_ROUTE + GET_CUSTOMER_BY_EMAIL)
                .then().statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void login() {
        CustomerLoginRequest req = new CustomerLoginRequest(VALID_CUST_EMAIL, VALID_CUST_PASSWORD);
        //valid credentials, but unverified
        given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + LOGIN)
                .then().statusCode(HttpStatus.UNAUTHORIZED.value());
        //verify
        given()
                .pathParam("verificationCode", verificationCode)
                .when().get(CUSTOMER_BASE_ROUTE + VERIFY)
                .then().statusCode(HttpStatus.OK.value());
        //successful login
        Customer customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + LOGIN)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
    }

    @Test
    public void changePassword() {
        CustomerChangePasswordRequest req = new CustomerChangePasswordRequest(createdCustomerId, "wrongPw", "newPassword");
        //wrong password
        given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + CHANGE_PASSWORD)
                .then().statusCode(HttpStatus.UNAUTHORIZED.value());

        //invalid id
        req.setCustomerId(991239129L);
        given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + CHANGE_PASSWORD)
                .then().statusCode(HttpStatus.NOT_FOUND.value());

        req.setCustomerId(createdCustomerId);
        req.setOldPassword(VALID_CUST_PASSWORD);

        Customer customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + CHANGE_PASSWORD)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);

        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
    }

    @Test
    public void resetPassword() {
        CustomerResetPasswordRequest badReq = new CustomerResetPasswordRequest(createdCustomerId, "abcdef", "newPassword");
        given()
                .contentType("application/json")
                .body(badReq)
                .when().post(CUSTOMER_BASE_ROUTE + RESET_PASSWORD)
                .then().statusCode(HttpStatus.BAD_REQUEST.value());

        CustomerResetPasswordRequest req = new CustomerResetPasswordRequest(createdCustomerId, verificationCode, "newPassword");
        Customer customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + RESET_PASSWORD)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
    }

    @Test
    public void updateMeasurements() {
        Measurements initialMeasurements = new Measurements();
        initialMeasurements.setChest(BigDecimal.valueOf(38.00));
        CustomerUpdateMeasurementsRequest req = new CustomerUpdateMeasurementsRequest(createdCustomerId, initialMeasurements);
        Measurements measurements1 = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_MEASUREMENTS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Measurements.class);
        assertThat(measurements1.getMeasurementsId()).isNotNull();
        assertThat(measurements1.getChest().compareTo(initialMeasurements.getChest())).isEqualTo(0);

        req.getMeasurements().setChest(BigDecimal.valueOf(100.00));
        Measurements measurements2 = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_MEASUREMENTS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Measurements.class);
        assertThat(measurements2.getMeasurementsId()).isNotNull();
        assertThat(measurements2.getChest().compareTo(req.getMeasurements().getChest())).isEqualTo(0);
    }

    @Test
    public void createDeleteCreditCard() {
        CreditCard newCreditCard = new CreditCard("123", "123", 12, 23, true);
        AddCreditCardRequest addCreditCardRequest = new AddCreditCardRequest(createdCustomerId, newCreditCard);
        Customer customer = given()
                .contentType("application/json")
                .body(addCreditCardRequest)
                .when().post(CUSTOMER_BASE_ROUTE + ADD_CREDIT_CARD)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getCreditCards().size()).isEqualTo(1);
        assertThat(customer.getCreditCards().get(0).getCreditCardId()).isNotNull();

        Long creditCardId = customer.getCreditCards().get(0).getCreditCardId();
        RemoveCreditCardRequest removeCreditCardRequest = new RemoveCreditCardRequest(createdCustomerId, creditCardId);
        customer = given()
                .contentType("application/json")
                .body(removeCreditCardRequest)
                .when().delete(CUSTOMER_BASE_ROUTE + REMOVE_CREDIT_CARD)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getCreditCards().size()).isEqualTo(0);

    }

    @Test
    public void CUDshippingAddress(){
        Address newShippingAddress = new Address("line1", null, "510149", null, false, null, null);
        AddUpdateShippingAddressRequest req = new AddUpdateShippingAddressRequest(createdCustomerId, newShippingAddress);
        Customer customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + ADD_SHIPPING_ADDRESS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getShippingAddresses().size()).isEqualTo(1);
        assertThat(customer.getShippingAddresses().get(0).getAddressId()).isNotNull();

        Address createdAddr = customer.getShippingAddresses().get(0);
        String newLine1 = "line1updated";
        createdAddr.setLine1(newLine1);
        req.setShippingAddress(createdAddr);
        Address updatedAddr = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_SHIPPING_ADDRESS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Address.class);
        assertThat(updatedAddr.getAddressId().compareTo(createdAddr.getAddressId())).isEqualTo(0);
        assertThat(updatedAddr.getLine1()).isEqualTo(newLine1);

        RemoveShippingAddressRequest removeReq = new RemoveShippingAddressRequest(createdCustomerId, updatedAddr.getAddressId());
        customer = given()
                .contentType("application/json")
                .body(removeReq)
                .when().delete(CUSTOMER_BASE_ROUTE + REMOVE_SHIPPING_ADDRESS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getShippingAddresses().size()).isEqualTo(0);
    }
    // TODO: add remove clear wishlist
}