package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.ProductImage;
import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.request.productImage.ProductImageCreateRequest;
import capstone.rt04.retailbackend.request.productImage.ProductImageDeleteRequest;
import capstone.rt04.retailbackend.request.productStock.ProductStockCreateRequest;
import capstone.rt04.retailbackend.request.productVariant.ProductVariantCreateRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.ProductImageControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.ProductStockControllerRoutes.*;
import static capstone.rt04.retailbackend.util.routeconstants.ProductVariantControllerRoutes.*;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class ProductControllerTest extends ApiTestSetup {

    @Test
    public void testCDProductVariant() {
        ProductVariant validProductVariant = new ProductVariant("SKU002", "Pink", null, null, null);
        ProductVariantCreateRequest productVariantCreateRequest = new ProductVariantCreateRequest(validProductVariant, productId);

        ProductVariant productVariantToCreate = given().
                contentType("application/json").
                body(productVariantCreateRequest).
                when().post(PRODUCT_VARIANT_BASE_ROUTE + CREATE_PRODUCT_VARIANT).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(ProductVariant.class);

        Long productVariantId = productVariantToCreate.getProductVariantId();
        ProductVariant productVariantToDelete = given().
                pathParam("productVariantId", productVariantId).
                when().delete(PRODUCT_VARIANT_BASE_ROUTE + DELETE_PRODUCT_VARIANT).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(ProductVariant.class);
        assertThat(productVariantId).isEqualTo(productVariantToDelete.getProductVariantId());

        given().
                pathParam("productVariantId", productVariantId).
                when().get(PRODUCT_VARIANT_BASE_ROUTE + RETRIEVE_PRODUCT_VARIANT_BY_ID).
                then().statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void testCDProductStock() throws Exception {

        ProductVariant productVariant = given().
                pathParam("productVariantId", productVariantId).
                when().get(PRODUCT_VARIANT_BASE_ROUTE + RETRIEVE_PRODUCT_VARIANT_BY_ID).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(ProductVariant.class);

        ProductStock validProductStock = new ProductStock(10, 100, 30);
        validProductStock.setProductVariant(productVariant);
        ProductStockCreateRequest productStockCreateRequest = new ProductStockCreateRequest(validProductStock, productVariantId);

        ProductStock productStockToCreate = given().
                contentType("application/json").
                body(productStockCreateRequest).
                when().post(PRODUCT_STOCK_BASE_ROUTE + CREATE_PRODUCT_STOCK).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(ProductStock.class);
        assertThat(productStockToCreate.getProductStockId()).isNotNull();

        Long productStockId = productStockToCreate.getProductStockId();

        ProductStock productStockToDelete = given().
                pathParam("productStockId", productStockId).
                when().delete(PRODUCT_STOCK_BASE_ROUTE + DELETE_PRODUCT_STOCK).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(ProductStock.class);
        assertThat(productStockId).isEqualTo(productStockToDelete.getProductStockId());

        given().
                pathParam("productStockId", productStockId).
                when().get(PRODUCT_STOCK_BASE_ROUTE + RETRIEVE_PRODUCT_STOCK_BY_ID).
                then().statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void testCDProductImage() throws Exception {
        // Create
        ProductVariant productVariant = given().
                pathParam("productVariantId", productVariantId).
                when().get(PRODUCT_VARIANT_BASE_ROUTE + RETRIEVE_PRODUCT_VARIANT_BY_ID).
                then().statusCode(HttpStatus.OK.value()).extract().body().as(ProductVariant.class);

        ProductImage validProductImage = new ProductImage("https://i.ebayimg.com/images/g/af8AAOSwd9dcdYMT/s-l640.jpg");
        List<ProductImage> productImagesToAdd = new ArrayList<>();
        productImagesToAdd.add(validProductImage);

        ProductImageCreateRequest productImageCreateRequest = new ProductImageCreateRequest(productImagesToAdd, productVariantId);


        List<ProductImage> productImages = given().
                contentType("application/json").
                body(productImageCreateRequest).
                when().post(PRODUCT_IMAGE_BASE_ROUTE + CREATE_PRODUCT_IMAGE).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().jsonPath().getList(".", ProductImage.class);

        Long productImageId = productImages.get(0).getProductImageId();

        productVariant.getProductImages().add(productImages.get(0));
        assertThat(productImages.get(0).getProductImageId()).isNotNull();

        // Delete
        productVariant.getProductImages().remove(productImages.get(0));
        ProductImageDeleteRequest productImageDeleteRequest = new ProductImageDeleteRequest(productImages, productVariantId);

        List<ProductImage> deletedProductImages = given().
                contentType("application/json").
                body(productImageDeleteRequest).
                when().delete(PRODUCT_IMAGE_BASE_ROUTE + DELETE_PRODUCT_IMAGES).
                then().statusCode(HttpStatus.OK.value()).extract().body().jsonPath().getList(".", ProductImage.class);

        assertThat(deletedProductImages.size()).isEqualTo(productImages.size());

        given().
               pathParam("productImageId", productImageId).
                when().get(PRODUCT_IMAGE_BASE_ROUTE + RETRIEVE_PRODUCT_IMAGE_BY_ID).
                then().statusCode(HttpStatus.NOT_FOUND.value());
    }
}