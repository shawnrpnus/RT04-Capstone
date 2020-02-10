package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.request.category.CategoryCreateRequest;
import capstone.rt04.retailbackend.request.product.ProductCreateRequest;
import capstone.rt04.retailbackend.request.productVariant.ProductVariantCreateRequest;
import io.restassured.RestAssured;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;

import static capstone.rt04.retailbackend.util.routeconstants.CategoryControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.ProductControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.ProductVariantControllerRoutes.CREATE_NEW_PRODUCT_VARIANT;
import static capstone.rt04.retailbackend.util.routeconstants.ProductVariantControllerRoutes.PRODUCT_VARIANT_BASE_ROUTE;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ApiTestSetup {

    @LocalServerPort
    int port;

    private static Long categoryId;
    private static Long productId;
    private static Long productVariantId;

    @Before
    public void setUp() throws Exception {
        RestAssured.port = port;
        Category validCategory = new Category("Shoes");
        Product validProduct = new Product("Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
        ProductVariant validProductVariant = new ProductVariant("SKU001", "White", null, null, null);

        CategoryCreateRequest categoryCreateRequest = new CategoryCreateRequest(validCategory, null);
        Category category = given().
                contentType("application/json").
                body(categoryCreateRequest).
                when().post(CATEGORY_BASE_ROUTE + CREATE_NEW_CATEGORY).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Category.class);
        categoryId = category.getCategoryId();

        ProductCreateRequest productCreateRequest = new ProductCreateRequest(validProduct, categoryId);
        Product product = given().
                contentType("application/json").
                body(productCreateRequest).
                when().post(PRODUCT_BASE_ROUTE + CREATE_NEW_PRODUCT).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Product.class);
        productId = product.getProductId();

        ProductVariantCreateRequest productVariantCreateRequest = new ProductVariantCreateRequest(validProductVariant, productId);
        ProductVariant productVariant = given().
                contentType("application/json").
                body(productVariantCreateRequest).
                when().post(PRODUCT_VARIANT_BASE_ROUTE + CREATE_NEW_PRODUCT_VARIANT).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(ProductVariant.class);
        productVariantId = productVariant.getProductVariantId();

        assertThat(product.getProductName()).isEqualTo(validProduct.getProductName());
        assertThat(productVariant.getSKU()).isEqualTo(validProductVariant.getSKU());
    }

    @After
    public void tearDown() throws Exception {

        Product removedProduct = given().
                pathParam("productId", productId).
                when().delete(PRODUCT_BASE_ROUTE + DELETE_PRODUCT).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Product.class);
        assertThat(removedProduct.getProductId()).isEqualTo(productId);

        Category removedCategory = given().
                pathParam("categoryId", categoryId).
                when().delete(CATEGORY_BASE_ROUTE + DELETE_CATEGORY).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Category.class);
        assertThat(removedCategory.getCategoryId()).isEqualTo(categoryId);
    }

    @Test
    public void dummy(){
    }

}
