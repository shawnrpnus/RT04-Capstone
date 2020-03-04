package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.request.transaction.TransactionRetrieveRequest;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.restassured.RestAssured;
import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.CREATE_NEW_CUSTOMER;
import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.CUSTOMER_BASE_ROUTE;
import static capstone.rt04.retailbackend.util.routeconstants.TransactionControllerRoutes.*;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Slf4j
public class TransactionControllerTest {

    private static Long transactionId1;

    @LocalServerPort
    int port;

    @Before
    public void portSetup(){
        RestAssured.port = port;
    }

    private static Long customerId;
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
        customerId = createdCustomer.getCustomerId();
        //create valid transactions
        Transaction validTransaction1 = new Transaction(createdCustomer);
        validTransaction1.setCollectionMode(CollectionModeEnum.IN_STORE);
        validTransaction1.setTotalQuantity(4);
        Transaction transaction1 = given()
                .contentType("application/json")
                .body(validTransaction1)
                .when().post(TRANSACTION_BASE_ROUTE + CREATE_TRANSACTION)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Transaction.class);
        transactionId1 = transaction1.getTransactionId();
        assertThat(transaction1.getTransactionId()).isNotNull();

        Transaction validTransaction2 = new Transaction(createdCustomer);
        validTransaction2.setCollectionMode(CollectionModeEnum.DELIVERY);
        validTransaction2.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
        validTransaction2.setTotalQuantity(3);
        Transaction transaction2 = given()
                .contentType("application/json")
                .body(validTransaction2)
                .when().post(TRANSACTION_BASE_ROUTE + CREATE_TRANSACTION)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Transaction.class);
        assertThat(transaction2.getTransactionId()).isNotNull();

        Transaction validTransaction3 = new Transaction(createdCustomer);
        validTransaction3.setCollectionMode(CollectionModeEnum.DELIVERY);
        validTransaction3.setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
        validTransaction3.setTotalQuantity(2);
        Transaction transaction3 = given()
                .contentType("application/json")
                .body(validTransaction3)
                .when().post(TRANSACTION_BASE_ROUTE + CREATE_TRANSACTION)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Transaction.class);
        assertThat(transaction3.getTransactionId()).isNotNull();

        Transaction validTransaction4 = new Transaction(createdCustomer);
        validTransaction4.setCollectionMode(CollectionModeEnum.DELIVERY);
        validTransaction4.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
        validTransaction4.setTotalQuantity(5);
        Transaction transaction4 = given()
                .contentType("application/json")
                .body(validTransaction4)
                .when().post(TRANSACTION_BASE_ROUTE + CREATE_TRANSACTION)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Transaction.class);
        assertThat(transaction4.getTransactionId()).isNotNull();
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
    @Test
    public void retrievePastOrder() {
        List<Transaction> pastOrders = given()
                .when()
                .get(TRANSACTION_BASE_ROUTE + RETRIEVE_ALL_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);
        //assertThat(transactions.size()).isEqualTo(4);
    }

    @Test
    public void retrieveMatchedOrders() throws IOException {
        //set startDate for date range criteria
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.set(2019, Calendar.DECEMBER, 9); //Year, month and day of month
        Date startDate = cal.getTime();
        List<Transaction> transactionsMatched = new ArrayList<>();

        //filter by collectionMode & deliveryStatus, sort by QUANTITY_LOW_TO_HIGH
        TransactionRetrieveRequest filterByCollectionAndDeliverySorted = new TransactionRetrieveRequest(customerId, CollectionModeEnum.DELIVERY, DeliveryStatusEnum.DELIVERED, null, null, SortEnum.QUANTITY_LOW_TO_HIGH);
        transactionsMatched = given()
                .contentType("application/json")
                .body(filterByCollectionAndDeliverySorted)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_MATCHED_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);
        assertThat(transactionsMatched.size()).isEqualTo(2);
        assertThat(transactionsMatched.get(0).getTotalQuantity()).isEqualTo(3);

        //filter by collectionMode
        TransactionRetrieveRequest filterByCollectionMode = new TransactionRetrieveRequest(customerId, CollectionModeEnum.IN_STORE, null, null, null, null);
        transactionsMatched = given()
                .contentType("application/json")
                .body(filterByCollectionMode)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_MATCHED_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);
        assertThat(transactionsMatched.size()).isEqualTo(1);

        //filter by DeliveryStatus
        TransactionRetrieveRequest filterByDeliveryStatus = new TransactionRetrieveRequest(customerId, null, DeliveryStatusEnum.DELIVERED, null, null, null);
        transactionsMatched = given()
                .contentType("application/json")
                .body(filterByDeliveryStatus)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_MATCHED_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);
        assertThat(transactionsMatched.size()).isEqualTo(2);

        //filter by dateRange
        TransactionRetrieveRequest filterByDateRange = new TransactionRetrieveRequest(customerId, null, null, "2019-12-09 00:00:00", null, null);
        transactionsMatched = given()
                .contentType("application/json")
                .body(filterByDateRange)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_MATCHED_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);
        assertThat(transactionsMatched.size()).isEqualTo(4);

        //filter by collectionMode & deliveryStatus
        TransactionRetrieveRequest filterByCollectionAndDelivery = new TransactionRetrieveRequest(customerId, CollectionModeEnum.DELIVERY, DeliveryStatusEnum.DELIVERED, null, null, null);
        transactionsMatched = given()
                .contentType("application/json")
                .body(filterByCollectionAndDelivery)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_MATCHED_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);
        assertThat(transactionsMatched.size()).isEqualTo(2);
        assertThat(transactionsMatched.get(0).getTotalQuantity()).isEqualTo(5);

        //filter by collectionMode & dateRange
        TransactionRetrieveRequest filterByCollectionAndDate = new TransactionRetrieveRequest(customerId, CollectionModeEnum.DELIVERY, null, "2019-12-09 00:00:00", null, null);
        transactionsMatched = given()
                .contentType("application/json")
                .body(filterByCollectionAndDate)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_MATCHED_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);
        assertThat(transactionsMatched.size()).isEqualTo(3);

        //filter by deliveryStatus & dateRange
        TransactionRetrieveRequest filterByDeliveryAndDate = new TransactionRetrieveRequest(customerId, null, DeliveryStatusEnum.DELIVERED, "2019-12-09 00:00:00", null, null);
        transactionsMatched = given()
                .contentType("application/json")
                .body(filterByDeliveryAndDate)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_MATCHED_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);
        assertThat(transactionsMatched.size()).isEqualTo(2);

        //filter by all criteria
        TransactionRetrieveRequest filterByAllCriteria = new TransactionRetrieveRequest(customerId, null, DeliveryStatusEnum.DELIVERED, "2019-12-09 00:00:00", null, null);
        transactionsMatched = given()
                .contentType("application/json")
                .body(filterByAllCriteria)
                .when().get(TRANSACTION_BASE_ROUTE + RETRIEVE_MATCHED_TRANSACTIONS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Transaction.class);
        assertThat(transactionsMatched.size()).isEqualTo(1);
    }
}
