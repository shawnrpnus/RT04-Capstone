package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.entities.CreditCard;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.request.customer.*;
import capstone.rt04.retailbackend.util.Constants;
import capstone.rt04.retailbackend.util.ErrorMessages;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;

import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.*;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class CustomerControllerTest extends ApiTestSetup {

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
    public void updateEmail(){
        String newEmail = "ultron@gmail.com";
        given()
                .queryParam("customerId", createdCustomerId)
                .queryParam("newEmail", newEmail)
                .when().post(CUSTOMER_BASE_ROUTE + SEND_UPDATE_EMAIL_LINK)
                .then().statusCode(HttpStatus.OK.value())
                .body("message", equalTo("Please check your email for the link to reset your password"));

        CustomerEmailRequest req = new CustomerEmailRequest(VALID_CUST_EMAIL);
        Customer customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + GET_CUSTOMER_BY_EMAIL)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getRequestedNewEmail()).isEqualTo(newEmail);

        String code = customer.getVerificationCode().getCode();

        Customer updatedCustomer = given()
                .pathParam("code", code)
                .when().get(CUSTOMER_BASE_ROUTE + UPDATE_EMAIL)
                .then().statusCode(HttpStatus.OK.value())
                .extract().body().as(Customer.class);

        assertThat(updatedCustomer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(updatedCustomer.getEmail()).isEqualTo(newEmail);
        assertThat(updatedCustomer.getRequestedNewEmail()).isNull();

    }

    @Test
    public void updateCustomerDetails(){
        Customer updatedCustomer = new Customer("Bruce", "Wayne", VALID_CUST_EMAIL, VALID_CUST_PASSWORD);
        updatedCustomer.setCustomerId(createdCustomerId);
        updatedCustomer = given()
                .contentType("application/json")
                .body(updatedCustomer)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_CUSTOMER)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(updatedCustomer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(updatedCustomer.getFirstName()).isEqualTo("Bruce");
        assertThat(updatedCustomer.getLastName()).isEqualTo("Wayne");
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
        CustomerResetPasswordRequest badReq = new CustomerResetPasswordRequest("abcdef", "newPassword", "newPassword");
        given()
                .contentType("application/json")
                .body(badReq)
                .when().post(CUSTOMER_BASE_ROUTE + RESET_PASSWORD_POST)
                .then().statusCode(HttpStatus.BAD_REQUEST.value());

        CustomerResetPasswordRequest req = new CustomerResetPasswordRequest(verificationCode, "newPassword", "newPassword");
        Customer customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + RESET_PASSWORD_POST)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
    }

    @Test
    public void createUpdateDeleteMeasurements() {
        //create
        Measurements initialMeasurements = new Measurements();
        initialMeasurements.setChest(BigDecimal.valueOf(38.00));
        CustomerUpdateMeasurementsRequest req = new CustomerUpdateMeasurementsRequest(createdCustomerId, initialMeasurements);
        Customer customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_MEASUREMENTS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getMeasurements().getMeasurementsId()).isNotNull();
        assertThat(customer.getMeasurements().getChest().compareTo(initialMeasurements.getChest())).isEqualTo(0);

        //update
        req.getMeasurements().setChest(BigDecimal.valueOf(100.00));
        customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_MEASUREMENTS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getMeasurements().getMeasurementsId()).isNotNull();
        assertThat(customer.getMeasurements().getChest().compareTo(req.getMeasurements().getChest())).isEqualTo(0);

        //delete
        customer = given()
                .queryParam("customerId", createdCustomerId)
                .when().post(CUSTOMER_BASE_ROUTE + DELETE_MEASUREMENTS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId().compareTo(createdCustomerId)).isZero();
        assertThat(customer.getMeasurements()).isNull();
    }

    @Test
    public void createDeleteCreditCard() {
        CreditCard newCreditCard = new CreditCard("1234", "123", 12, 23,"visa",true);
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
        Address newShippingAddress = new Address("line1", null, 510149, null, false, null, null);
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

    @Test
    public void addRemoveClearWishlist(){

        addToWishlist();

        Customer customer = given()
                .queryParam("customerId", createdCustomerId)
                .queryParam("productVariantId", productVariantId)
                .when().post(CUSTOMER_BASE_ROUTE + REMOVE_FROM_WISHLIST)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getWishlistItems().size()).isEqualTo(0);

        addToWishlist();

        customer = given()
                .queryParam("customerId", createdCustomerId)
                .when().post(CUSTOMER_BASE_ROUTE + ADD_WISHLIST_TO_SHOPPING_CART)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(1);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().get(0)
                .getProductVariant().getProductVariantId()).isEqualTo(productVariantId);


        customer = given()
                .queryParam("customerId", createdCustomerId)
                .when().post(CUSTOMER_BASE_ROUTE + CLEAR_WISHLIST)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getWishlistItems().size()).isEqualTo(0);

    }

    private void addToWishlist(){
        Customer customer = given()
                .queryParam("customerId", createdCustomerId)
                .queryParam("productVariantId", productVariantId)
                .when().post(CUSTOMER_BASE_ROUTE + ADD_TO_WISHLIST)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getWishlistItems().size()).isEqualTo(1);
        assertThat(customer.getWishlistItems().get(0).getProductVariantId()).isNotNull();
        assertThat(customer.getWishlistItems().get(0).getProductVariantId().compareTo(productVariantId)).isZero();
    }


    @Test
    public void shoppingCartTests(){
        //create
        UpdateShoppingCartRequest req = new UpdateShoppingCartRequest(1, productVariantId, createdCustomerId, Constants.ONLINE_SHOPPING_CART);
        Customer customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_SHOPPING_CART)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(1);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().get(0).getQuantity()).isEqualTo(1);

        //update
        req.setQuantity(2);
        customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_SHOPPING_CART)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(1);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().get(0).getQuantity()).isEqualTo(2);

        //delete
        req.setQuantity(0);
        customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_SHOPPING_CART)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(0);

        //create again
        req = new UpdateShoppingCartRequest(1, productVariantId, createdCustomerId, Constants.ONLINE_SHOPPING_CART);
        customer = given()
                .contentType("application/json")
                .body(req)
                .when().post(CUSTOMER_BASE_ROUTE + UPDATE_SHOPPING_CART)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(1);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().get(0).getQuantity()).isEqualTo(1);

        //clear cart
        customer = given()
                .queryParam("customerId", createdCustomerId)
                .queryParam("cartType", Constants.ONLINE_SHOPPING_CART)
                .when().post(CUSTOMER_BASE_ROUTE + CLEAR_SHOPPING_CART)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(0);
    }

    @Test
    public void addRemoveClearReservationCart(){

        addToReservationCart();

        Customer customer = given()
                .queryParam("customerId", createdCustomerId)
                .queryParam("productVariantId", productVariantId)
                .when().post(CUSTOMER_BASE_ROUTE + REMOVE_FROM_RESERVATION_CART)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getReservationCartItems().size()).isEqualTo(0);

        addToReservationCart();


        customer = given()
                .queryParam("customerId", createdCustomerId)
                .when().post(CUSTOMER_BASE_ROUTE + CLEAR_RESERVATION_CART)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getReservationCartItems().size()).isEqualTo(0);

    }

    private void addToReservationCart(){
        Customer customer = given()
                .queryParam("customerId", createdCustomerId)
                .queryParam("productVariantId", productVariantId)
                .when().post(CUSTOMER_BASE_ROUTE + ADD_TO_RESERVATION_CART)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);
        assertThat(customer.getCustomerId()).isEqualTo(createdCustomerId);
        assertThat(customer.getReservationCartItems().size()).isEqualTo(1);
        assertThat(customer.getReservationCartItems().get(0).getProductVariantId()).isNotNull();
        assertThat(customer.getReservationCartItems().get(0).getProductVariantId().compareTo(productVariantId)).isZero();
    }

}