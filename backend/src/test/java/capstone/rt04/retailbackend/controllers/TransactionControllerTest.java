package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import io.restassured.RestAssured;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.CREATE_NEW_CUSTOMER;
import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.CUSTOMER_BASE_ROUTE;
import static capstone.rt04.retailbackend.util.routeconstants.TransactionControllerRoutes.*;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class TransactionControllerTest {

    private static Long transactionId1;

    @LocalServerPort
    int port;

    @Before
    public void portSetup(){
        RestAssured.port = port;
    }

    @Test
    public void createTransactions() {
        Customer customer = new Customer("Amy", "Tan", "amytan@gmail.com", "amytan");
        //create customer to associate with transactions
        Customer createdCustomer = given().
                contentType("application/json").
                body(customer).
                when().post(CUSTOMER_BASE_ROUTE + CREATE_NEW_CUSTOMER).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Customer.class);
        assertThat(createdCustomer.getCustomerId()).isNotNull();

        //create valid transactions
        Transaction validTransaction1 = new Transaction(createdCustomer);
        validTransaction1.setCollectionMode(CollectionModeEnum.IN_STORE);
        Transaction transaction1 = given()
                .contentType("application/json")
                .body(validTransaction1)
                .when().post(TRANSACTION_BASE_ROUTE + CREATE_TRANSACTION)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Transaction.class);
        transactionId1 = transaction1.getTransactionId();
        assertThat(transaction1.getTransactionId()).isNotNull();

        Transaction validTransaction2 = new Transaction(createdCustomer);
        validTransaction2.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
        Transaction transaction2 = given()
                .contentType("application/json")
                .body(validTransaction2)
                .when().post(TRANSACTION_BASE_ROUTE + CREATE_TRANSACTION)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Transaction.class);
        assertThat(transaction2.getTransactionId()).isNotNull();
    }

    @Test
    public void retrieveOrder() {
        given()
                .pathParam("transactionId", 100)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_TRANSACTION_BY_ID)
                .then().statusCode(HttpStatus.NOT_FOUND.value());

        Transaction existingTransaction = given()
                .pathParam("transactionId", transactionId1)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_TRANSACTION_BY_ID)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Transaction.class);
        assertThat(existingTransaction.getTransactionId()).isEqualTo(transactionId1);
    }

    //TODO: test got error - unresolved forward reference, could not resolve object id. tested on postman and it works
    /*@Test
    public void retrievePastOrder() {
        List<Transaction> pastOrders = given()
                .when()
                .get(TRANSACTION_BASE_ROUTE + RETRIEVE_ALL_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);

        //assertThat(pastOrders.size()).isEqualTo(2);
    }*/
}
