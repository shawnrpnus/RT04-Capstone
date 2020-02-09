package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.*;
import static io.restassured.matcher.RestAssuredMatchers.*;
import static org.hamcrest.Matchers.*;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class CustomerControllerTest {

    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void createNewCustomer() {
        Customer validCustomer = new Customer("Tony", "Stark", "tonystark@gmail.com", "spiderman");
        Customer createdCustomer = given().
                contentType("application/json").
                body(validCustomer).
                when().post("/api/customer/createNewCustomer").
                then().statusCode(201).extract().body().as(Customer.class);
                //body("email", equalTo(validCustomer.getEmail()));
        assertThat(createdCustomer.getCustomerId().equals(validCustomer.getCustomerId()));
        assertThat(createdCustomer.getOnlineShoppingCart()).isNotNull();
        assertThat(createdCustomer.getInStoreShoppingCart()).isNotNull();

        Customer deletedCustomer = given().
                pathParam("customerId", createdCustomer.getCustomerId()).
                when().delete("/api/customer/deleteCustomer/{customerId}").
                then().statusCode(200).extract().body().as(Customer.class);

        assertThat(deletedCustomer.getCustomerId().equals(createdCustomer.getCustomerId()));
    }
}