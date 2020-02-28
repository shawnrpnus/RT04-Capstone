package capstone.rt04.retailbackend.controllers;

import static capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum.COMPLAINT;

import capstone.rt04.retailbackend.entities.ContactUs;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static capstone.rt04.retailbackend.util.routeconstants.ContactUsControllerRoute.CREATE_NEW_CONTACT_US;
import static capstone.rt04.retailbackend.util.routeconstants.ContactUsControllerRoute.CONTACT_US_BASE_ROUTE;
import static io.restassured.RestAssured.*;

import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ContactUsControllerTest extends ApiTestSetup{
    @Test
    public void createBadContactUs(){
        ContactUs badContactUs = new ContactUs(COMPLAINT, "help", "", "Lil", "Pump");

        ContactUs createdContactUs = given().
                contentType("application/json").
                body(badContactUs).
                when().post(CONTACT_US_BASE_ROUTE + CREATE_NEW_CONTACT_US).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(ContactUs.class);
        assertThat(createdContactUs.getContactUsId()).isNotNull();

    }
}
