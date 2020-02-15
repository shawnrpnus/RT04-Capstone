package capstone.rt04.retailbackend.controllers;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static capstone.rt04.retailbackend.util.routeconstants.CategoryControllerRoutes.CATEGORY_BASE_ROUTE;
import static capstone.rt04.retailbackend.util.routeconstants.CategoryControllerRoutes.DELETE_CATEGORY;
import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.DELETE_CUSTOMER;
import static io.restassured.RestAssured.given;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class CategoryControllerTest extends ApiTestSetup {

    @Test
    public void deleteCategoryThatDoesNotExist() {
        given().
                pathParam("categoryId", 91293129).
                when().delete(CATEGORY_BASE_ROUTE + DELETE_CATEGORY).
                then().statusCode(HttpStatus.NOT_FOUND.value());
    }
}
