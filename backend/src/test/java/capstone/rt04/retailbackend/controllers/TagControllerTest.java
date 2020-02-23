package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.routeconstants.TagControllerRoutes;
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

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static io.restassured.RestAssured.given;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class TagControllerTest {
    @LocalServerPort
    int port;

    @Before
    public void portSetup(){
        RestAssured.port = port;
    }

    @Test
    public void CRUDTag() {
        Tag validTag = new Tag("Discount");
        Tag invalidTag = new Tag();

        given()
                .contentType("application/json")
                .body(invalidTag)
                .when().post(TagControllerRoutes.TAG_BASE_ROUTE + TagControllerRoutes.CREATE_NEW_TAG)
                .then().statusCode(HttpStatus.BAD_REQUEST.value()).body("categoryName", equalTo(ErrorMessages.TAG_NAME_REQUIRED));

        Tag createdTag = given()
                .contentType("application/json")
                .body(validTag)
                .when().post(TagControllerRoutes.TAG_BASE_ROUTE + TagControllerRoutes.CREATE_NEW_TAG)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Tag.class);
        assertThat(createdTag.getTagId()).isNotNull();
        assertThat(createdTag.getName()).isEqualTo(validTag.getName());

        Tag retrievedTag = given()
                .pathParam("tagId", createdTag.getTagId())
                .when().get(TagControllerRoutes.TAG_BASE_ROUTE + TagControllerRoutes.RETRIEVE_TAG_BY_ID)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Tag.class);
        assertThat(retrievedTag.getTagId().compareTo(createdTag.getTagId())).isZero();

        List<Tag> retrievedTags = given()
                .when()
                .get(TagControllerRoutes.TAG_BASE_ROUTE + TagControllerRoutes.RETRIEVE_ALL_TAGS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Tag.class);
        assertThat(retrievedTags.size()).isOne();

        retrievedTag.setName("Updated");

        Tag updatedTag = given()
                .contentType("application/json")
                .body(retrievedTag)
                .when().post(TagControllerRoutes.TAG_BASE_ROUTE + TagControllerRoutes.UPDATE_TAG)
                .then().statusCode(HttpStatus.OK.value()).extract().body().as(Tag.class);
        assertThat(updatedTag.getTagId().compareTo(createdTag.getTagId())).isZero();
        assertThat(updatedTag.getName()).isEqualTo("Updated");

        given()
                .pathParam("tagId", createdTag.getTagId())
                .when().delete(TagControllerRoutes.TAG_BASE_ROUTE + TagControllerRoutes.DELETE_TAG)
                .then().statusCode(HttpStatus.OK.value());

        retrievedTags = given()
                .when()
                .get(TagControllerRoutes.TAG_BASE_ROUTE + TagControllerRoutes.RETRIEVE_ALL_TAGS)
                .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Tag.class);
        assertThat(retrievedTags.size()).isZero();
    }
}
