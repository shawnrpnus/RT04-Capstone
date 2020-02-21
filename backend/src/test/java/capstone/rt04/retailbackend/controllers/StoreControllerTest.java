package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Time;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.StoreControllerRoutes.*;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class StoreControllerTest extends ApiTestSetup {

    @Test
    public void CRUDStore() {
        Store validStore = new Store("Store 1", 6, 3, Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 1, 4, null);

        //store is valid
        Store createdStore = given()
                .contentType("application/json")
                .body(validStore)
                .when().post(STORE_BASE_ROUTE + CREATE_STORE)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Store.class);
        assertThat(createdStore.getStoreId()).isNotNull();

        /*Retrieve Store by Id*/
        //store does not exist
        given()
                .pathParam("storeId", 100)
                .when().get(STORE_BASE_ROUTE + RETRIEVE_STORE_BY_ID)
                .then().statusCode(HttpStatus.NOT_FOUND.value());

        Store existingStore = given()
                .pathParam("storeId", createdStore.getStoreId())
                .when().get(STORE_BASE_ROUTE + RETRIEVE_STORE_BY_ID)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Store.class);
        assertThat(existingStore.getStoreId()).isEqualTo(createdStore.getStoreId());


        /*Update Store*/
        existingStore.setNumManagers(1);

        Store updatedStore = given()
                .contentType("application/json")
                .body(existingStore)
                .when().post(STORE_BASE_ROUTE + UPDATE_STORE)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Store.class);
        assertThat(updatedStore.getStoreId()).isEqualTo(createdStore.getStoreId());

        /*Delete Store*/
              given()
                .pathParam("storeId", createdStore.getStoreId())
                .when().delete(STORE_BASE_ROUTE + DELETE_STORE)
                .then().statusCode(HttpStatus.OK.value());

        List<Store> numOfStoresAfterDeletion = given()
                .when()
                .get(STORE_BASE_ROUTE + RETRIEVE_ALL_STORES)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Store.class);
        assertThat(numOfStoresAfterDeletion.size()).isOne(); //there is a store created during setup
    }
}
