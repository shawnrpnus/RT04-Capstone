package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.category.CategoryCreateRequest;
import capstone.rt04.retailbackend.request.product.ProductCreateRequest;
import capstone.rt04.retailbackend.request.productVariant.ProductVariantCreateRequest;

import capstone.rt04.retailbackend.request.staff.DepartmentCreateRequest;
import capstone.rt04.retailbackend.request.staff.RoleCreateRequest;
import capstone.rt04.retailbackend.request.staff.StaffAccountCreateRequest;
import capstone.rt04.retailbackend.request.staff.StaffCreateRequest;
import capstone.rt04.retailbackend.util.enums.RoleNameEnum;

import capstone.rt04.retailbackend.util.enums.SizeEnum;

import capstone.rt04.retailbackend.util.routeconstants.StyleControllerRoutes;
import capstone.rt04.retailbackend.util.routeconstants.TagControllerRoutes;
import io.restassured.RestAssured;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
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
import static capstone.rt04.retailbackend.util.routeconstants.StaffControllerRoutes.*;
import capstone.rt04.retailbackend.repositories.DepartmentRepository;
import capstone.rt04.retailbackend.repositories.RoleRepository;
import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.ProductControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.ProductVariantControllerRoutes.CREATE_PRODUCT_VARIANT;
import static capstone.rt04.retailbackend.util.routeconstants.ProductVariantControllerRoutes.PRODUCT_VARIANT_BASE_ROUTE;
import static capstone.rt04.retailbackend.util.routeconstants.StoreControllerRoutes.CREATE_STORE;
import static capstone.rt04.retailbackend.util.routeconstants.StoreControllerRoutes.DELETE_STORE;
import static capstone.rt04.retailbackend.util.routeconstants.StoreControllerRoutes.STORE_BASE_ROUTE;
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

    @Autowired
    protected DepartmentRepository departmentRepository;
    @Autowired
    protected RoleRepository roleRepository;

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

    protected static Long createdStaffId;
    protected static String VALID_STAFF_PASSWORD;
    protected static final String VALID_STAFF_EMAIL = "tonystark@gmail.com";
    protected static Role testRole;
    protected static Department testDepartment;

    @Before
    public void setUp() throws Exception {
        RestAssured.port = port;
        setUpCustomer();
        setUpProduct();
        setUpStyle();
        setUpTag();
        setUpStore();
        setUpStaff();
    }

    @After
    public void tearDown() throws Exception {
        tearDownCustomer();
        tearDownProduct();
        tearDownStyle();
        tearDownTag();
        tearDownStore();
        tearDownStaff();
    }

    @Test
    public void dummy(){
    }

    private void setUpCustomer(){
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

    private void tearDownCustomer(){
        Customer deletedCustomer = given().
                pathParam("customerId", createdCustomerId).
                when().delete(CUSTOMER_BASE_ROUTE + DELETE_CUSTOMER).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Customer.class);

        assertThat(deletedCustomer.getCustomerId().equals(createdCustomerId));
        createdCustomerId = null;
    }

    private void setUpProduct(){
        Category validCategory = new Category("Shoes");
        Product validProduct = new Product("0005", "Fila Disruptor II", "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
        ProductVariant validProductVariant = new ProductVariant("SKU001", "White", null, null, null);

        CategoryCreateRequest categoryCreateRequest = new CategoryCreateRequest(validCategory, null);
        Category category = given().
                contentType("application/json").
                body(categoryCreateRequest).
                when().post(CATEGORY_BASE_ROUTE + CREATE_NEW_CATEGORY).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Category.class);
        categoryId = category.getCategoryId();

        List<SizeEnum> sizes = new ArrayList<>();
        sizes.add(SizeEnum.S);
        sizes.add(SizeEnum.M);
        List<String> colors = new ArrayList<>();
        colors.add("pink");
        colors.add("gold");

        ProductCreateRequest productCreateRequest = new ProductCreateRequest(validProduct, categoryId, sizes, colors);
        Product product = given().
                contentType("application/json").
                body(productCreateRequest).
                when().post(PRODUCT_BASE_ROUTE + CREATE_PRODUCT).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Product.class);
        productId = product.getProductId();

        ProductVariantCreateRequest productVariantCreateRequest = new ProductVariantCreateRequest(validProductVariant, productId);
        ProductVariant productVariant = given().
                contentType("application/json").
                body(productVariantCreateRequest).
                when().post(PRODUCT_VARIANT_BASE_ROUTE + CREATE_PRODUCT_VARIANT).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(ProductVariant.class);
        productVariantId = productVariant.getProductVariantId();

        assertThat(product.getProductId()).isNotNull();
        assertThat(product.getProductName()).isEqualTo(validProduct.getProductName());
        assertThat(productVariant.getSKU()).isEqualTo(validProductVariant.getSKU());
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

    private void tearDownProduct(){
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

    private void setUpStyle(){
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

    private void tearDownStyle(){
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

    private void setUpStore(){
        Store validStore = new Store("Store 1", 4, 2, Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 2, 5, null);
        Store createdStore = given()
                .contentType("application/json")
                .body(validStore)
                .when().post(STORE_BASE_ROUTE + CREATE_STORE)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Store.class);
        assertThat(createdStore.getStoreId()).isNotNull();
        storeId = createdStore.getStoreId();
    }

    private void tearDownStore(){

        Store removedStore = given().
                pathParam("storeId", storeId).
                when().delete(STORE_BASE_ROUTE + DELETE_STORE).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Store.class);

        assertThat(removedStore.getStoreId().equals(storeId));
        storeId = null;
    }

    private void setUpStaff(){
        Staff expectedValidStaff = new Staff("Bob", "Vance", 10, "S1111111D", VALID_STAFF_EMAIL);

        //Role and department has to be created beforehand
        RoleNameEnum rolename = RoleNameEnum.valueOf("ASSISTANT");
        BigDecimal salary = new BigDecimal(1000);
        RoleCreateRequest roleCreateRequest = new RoleCreateRequest(rolename, salary);
        testRole = given().
                contentType("application/json").
                body(roleCreateRequest).
                when().post(STAFF_BASE_ROUTE + CREATE_NEW_ROLE).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Role.class);
        assertThat(testRole.getRoleId()).isNotNull();

        DepartmentCreateRequest departmentCreateRequest = new DepartmentCreateRequest("abc");
        testDepartment = given().
                contentType("application/json").
                body(departmentCreateRequest).
                when().post(STAFF_BASE_ROUTE + CREATE_NEW_DEPARTMENT).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Department.class);
        assertThat(testDepartment.getDepartmentId()).isNotNull();

        Address testAddress = new Address("aba", "aaa", "12345", "blah");

        StaffCreateRequest staffCreateRequest = new StaffCreateRequest(expectedValidStaff, testAddress, testRole, testDepartment);

        Staff createdStaff = given().
                contentType("application/json").
                body(staffCreateRequest).
                when().post(STAFF_BASE_ROUTE + CREATE_NEW_STAFF).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Staff.class);

        assertThat(createdStaff.getStaffId()).isNotNull();
        createdStaffId = createdStaff.getStaffId();

        StaffAccountCreateRequest req = new StaffAccountCreateRequest(createdStaffId);
        createdStaff = given()
                .contentType("application/json")
                .body(req)
                .when().post(STAFF_BASE_ROUTE + CREATE_NEW_STAFF_ACCOUNT)
                .then().statusCode(HttpStatus.CREATED.value()).extract().body().as(Staff.class);
        assertThat(createdStaff.getStaffId()).isEqualTo(createdStaffId);
        VALID_STAFF_PASSWORD = createdStaff.getPassword();


    }

    private void tearDownStaff(){
        Staff deletedStaff = given().
                pathParam("staffId", createdStaffId).
                when().delete(STAFF_BASE_ROUTE + DELETE_STAFF).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(Staff.class);

        assertThat(deletedStaff.getStaffId().equals(createdStaffId));
        createdStaffId = null;

    }


}
