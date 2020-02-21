package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.category.CategoryCreateRequest;
import capstone.rt04.retailbackend.request.product.ProductCreateRequest;
import capstone.rt04.retailbackend.request.productVariant.ProductVariantCreateRequest;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.routeconstants.StyleControllerRoutes;
import capstone.rt04.retailbackend.util.routeconstants.TagControllerRoutes;
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
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.CategoryControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.ProductControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.ProductVariantControllerRoutes.CREATE_MULTIPLE_PRODUCT_VARIANTS;
import static capstone.rt04.retailbackend.util.routeconstants.ProductVariantControllerRoutes.PRODUCT_VARIANT_BASE_ROUTE;
import static capstone.rt04.retailbackend.util.routeconstants.StoreControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.TagControllerRoutes.DELETE_TAG;
import static capstone.rt04.retailbackend.util.routeconstants.TagControllerRoutes.TAG_BASE_ROUTE;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ApiTestSetup {

    @LocalServerPort
    int port;

    protected static final String VALID_CUST_EMAIL = "tonystark@gmail.com";
    protected static final String VALID_CUST_PASSWORD = "spiderman";

    protected static Long styleId;
    protected static Long categoryId;
    protected static Long productId;
    protected static Long productVariantId;
    protected static Long createdCustomerId;
    protected static Long tagId1;
    protected static Long tagId2;
    protected static String verificationCode;
    protected static Long storeId;

    protected List<SizeEnum> sizes = new ArrayList<>();
    protected List<String> colors = new ArrayList<>();

    @Before
    public void setUp() throws Exception {
        RestAssured.port = port;
        setUpProduct();
        setUpTag();
        setUpStore();
        setUpCustomer();
        setUpStyle();
    }

    @After
    public void tearDown() throws Exception {
        tearDownCustomer();
        tearDownProduct();
        tearDownStyle();
        tearDownTag();
        tearDownStore();
    }

    @Test
    public void dummy() {
    }

    private void setUpCustomer() {
        Customer validCustomer = new Customer("Tony", "Stark", VALID_CUST_EMAIL, VALID_CUST_PASSWORD);
        Customer createdCustomer = given().
                contentType("application/json").
                body(validCustomer).
                when().post(CUSTOMER_BASE_ROUTE + CREATE_NEW_CUSTOMER).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Customer.class);
        //body("email", equalTo(validCustomer.getEmail()));
        assertThat(createdCustomer.getCustomerId()).isNotNull();
        assertThat(createdCustomer.getEmail()).isEqualTo(validCustomer.getEmail());
        assertThat(createdCustomer.getOnlineShoppingCart()).isNotNull();
        assertThat(createdCustomer.getInStoreShoppingCart()).isNotNull();
        createdCustomerId = createdCustomer.getCustomerId();
        verificationCode = createdCustomer.getVerificationCode().getCode();
    }

    private void tearDownCustomer() {
        Customer deletedCustomer = given().
                pathParam("customerId", createdCustomerId).
                when().delete(CUSTOMER_BASE_ROUTE + DELETE_CUSTOMER).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);

        assertThat(deletedCustomer.getCustomerId().equals(createdCustomerId));
        createdCustomerId = null;
    }

    private void setUpProduct() {
        Category validCategory = new Category("Shoes");
        Product validProduct = new Product("0005", "Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
//        ProductVariant validProductVariant = new ProductVariant("SKU001", "White", null);

        CategoryCreateRequest categoryCreateRequest = new CategoryCreateRequest(validCategory, null);

        Category category = given().
                contentType("application/json").
                body(categoryCreateRequest).
                when().post(CATEGORY_BASE_ROUTE + CREATE_NEW_CATEGORY).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Category.class);
        categoryId = category.getCategoryId();

        sizes.add(SizeEnum.S);
        sizes.add(SizeEnum.M);
        colors.add("White");
        colors.add("Gold");

        ProductCreateRequest productCreateRequest = new ProductCreateRequest(validProduct, categoryId, sizes, colors);
        Product product = given().
                contentType("application/json").
                body(productCreateRequest).
                when().post(PRODUCT_BASE_ROUTE + CREATE_PRODUCT).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Product.class);
        productId = product.getProductId();

        ProductVariantCreateRequest productVariantCreateRequest = new ProductVariantCreateRequest(productId, "Biege", sizes);
        List<ProductVariant> productVariant = given().
                contentType("application/json").
                body(productVariantCreateRequest).
                when().post(PRODUCT_VARIANT_BASE_ROUTE + CREATE_MULTIPLE_PRODUCT_VARIANTS).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().jsonPath().getList(".", ProductVariant.class);
        productVariantId = productVariant.get(0).getProductVariantId();

        assertThat(product.getProductId()).isNotNull();
        assertThat(product.getProductName()).isEqualTo(validProduct.getProductName());
    }

    private void setUpTag() {
        Tag tag1 = given()
                .contentType("application/json")
                .body(new Tag("Christmas"))
                .when().post(TAG_BASE_ROUTE + TagControllerRoutes.CREATE_NEW_TAG)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Tag.class);
        tagId1 = tag1.getTagId();
        Tag tag2 = given()
                .contentType("application/json")
                .body(new Tag("Coronavirus"))
                .when().post(TAG_BASE_ROUTE + TagControllerRoutes.CREATE_NEW_TAG)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Tag.class);
        tagId2 = tag2.getTagId();
    }

    private void tearDownProduct() {
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

    private void setUpStyle() {
        Style validStyle = new Style("Bold");
        Style createdStyle = given()
                .contentType("application/json")
                .body(validStyle)
                .when().post(StyleControllerRoutes.STYLE_BASE_ROUTE + StyleControllerRoutes.CREATE_NEW_STYLE)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Style.class);
        assertThat(createdStyle.getStyleId()).isNotNull();
        assertThat(createdStyle.getStyleName()).isEqualTo(validStyle.getStyleName());
        styleId = createdStyle.getStyleId();
    }

    private void tearDownStyle() {
        given()
                .pathParam("styleId", styleId)
                .when().delete(StyleControllerRoutes.STYLE_BASE_ROUTE + StyleControllerRoutes.DELETE_STYLE)
                .then().statusCode(HttpStatus.OK.value());
        styleId = null;
    }

    private void tearDownTag() {
        given()
                .pathParam("tagId", tagId1)
                .when().delete(TAG_BASE_ROUTE + DELETE_TAG)
                .then().statusCode(HttpStatus.OK.value());
        given()
                .pathParam("tagId", tagId2)
                .when().delete(TAG_BASE_ROUTE + DELETE_TAG)
                .then().statusCode(HttpStatus.OK.value());
        tagId1 = null;
        tagId2 = null;
    }

    private void setUpStore() {
        Store validStore = new Store("Store 1", 4, 2, Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 2, 5, null);
        Store createdStore = given()
                .contentType("application/json")
                .body(validStore)
                .when().post(STORE_BASE_ROUTE + CREATE_STORE)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Store.class);
        assertThat(createdStore.getStoreId()).isNotNull();
        storeId = createdStore.getStoreId();
    }

    private void tearDownStore() {

        Store removedStore = given().
                pathParam("storeId", storeId).
                when().delete(STORE_BASE_ROUTE + DELETE_STORE).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Store.class);

        assertThat(removedStore.getStoreId().equals(storeId));
        storeId = null;
    }


}
