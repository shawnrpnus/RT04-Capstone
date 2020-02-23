package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.request.category.CategoryCreateRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.CategoryControllerRoutes.*;
import static io.restassured.RestAssured.given;


import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class CategoryControllerTest extends ApiTestSetup {

    @Test
    public void deleteCategoryThatDoesNotExist() {
        given().
                pathParam("categoryId", 91293129).
                when().delete(CATEGORY_BASE_ROUTE + DELETE_CATEGORY).
                then().statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void testCDCategory() {
        Category validCategory = new Category("Werl");
        CategoryCreateRequest categoryCreateRequest = new CategoryCreateRequest(validCategory, null);

        Category categoryToCreate = given().
                contentType("application/json").
                body(categoryCreateRequest).
                when().post(CATEGORY_BASE_ROUTE + CREATE_NEW_CATEGORY).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Category.class);

        Long categoryId = categoryToCreate.getCategoryId();
        Category categoryToDelete = given().
                pathParam("categoryId", categoryId).
                when().delete(CATEGORY_BASE_ROUTE + DELETE_CATEGORY).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Category.class);
        assertThat(categoryId).isEqualTo(categoryToDelete.getCategoryId());

        given().
                pathParam("categoryId", categoryId).
                when().get(CATEGORY_BASE_ROUTE + RETRIEVE_CATEGORY_BY_ID).
                then().statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void testViewAllViewOneCategory() {
        List<Category> categoryList = given().
            when()
            .get(CATEGORY_BASE_ROUTE + RETRIEVE_ALL_ROOT_CATEGORIES)
            .then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", Category.class);
        assertThat(categoryList.size()).isOne();

        Category category = given().
                pathParam("categoryId", categoryId).
                when().get(CATEGORY_BASE_ROUTE + RETRIEVE_CATEGORY_BY_ID).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Category.class);
    }

}
