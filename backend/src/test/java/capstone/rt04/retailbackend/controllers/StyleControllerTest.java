package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Style;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.routeconstants.StyleControllerRoutes;
import io.restassured.RestAssured;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class StyleControllerTest {

    @LocalServerPort
    int port;

    @Before
    public void portSetup(){
        RestAssured.port = port;
    }

    @Test
    public void CRUDStyle(){
        Style validStyle = new Style("Bold");
        Style invalidStyle = new Style();

        given()
                .contentType("application/json")
                .body(invalidStyle)
                .when().post(StyleControllerRoutes.STYLE_BASE_ROUTE + StyleControllerRoutes.CREATE_NEW_STYLE)
                .then().statusCode(HttpStatus.BAD_REQUEST.value()).body("styleName", equalTo(ErrorMessages.STYLE_NAME_REQUIRED));

        Style createdStyle = given()
                .contentType("application/json")
                .body(validStyle)
                .when().post(StyleControllerRoutes.STYLE_BASE_ROUTE + StyleControllerRoutes.CREATE_NEW_STYLE)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Style.class);
        assertThat(createdStyle.getStyleId()).isNotNull();
        assertThat(createdStyle.getStyleName()).isEqualTo(validStyle.getStyleName());

        Style retrievedStyle = given()
                .pathParam("styleId", createdStyle.getStyleId())
                .when().get(StyleControllerRoutes.STYLE_BASE_ROUTE + StyleControllerRoutes.RETRIEVE_STYLE_BY_ID)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Style.class);
        assertThat(retrievedStyle.getStyleId().compareTo(createdStyle.getStyleId())).isZero();

        List<Style> retrievedStyles = given()
                .when()
                .get(StyleControllerRoutes.STYLE_BASE_ROUTE + StyleControllerRoutes.RETRIEVE_ALL_STYLES)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Style.class);
        assertThat(retrievedStyles.size()).isOne();

        retrievedStyle.setStyleName("Updated");

        Style updatedStyle = given()
                .contentType("application/json")
                .body(retrievedStyle)
                .when().post(StyleControllerRoutes.STYLE_BASE_ROUTE + StyleControllerRoutes.UPDATE_STYLE)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Style.class);
        assertThat(updatedStyle.getStyleId().compareTo(createdStyle.getStyleId())).isZero();
        assertThat(updatedStyle.getStyleName()).isEqualTo("Updated");

        given()
                .pathParam("styleId", createdStyle.getStyleId())
                .when().delete(StyleControllerRoutes.STYLE_BASE_ROUTE + StyleControllerRoutes.DELETE_STYLE)
                .then().statusCode(HttpStatus.OK.value());

        retrievedStyles = given()
                .when()
                .get(StyleControllerRoutes.STYLE_BASE_ROUTE + StyleControllerRoutes.RETRIEVE_ALL_STYLES)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Style.class);
        assertThat(retrievedStyles.size()).isZero();

    }
}
