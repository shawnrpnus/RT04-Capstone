package capstone.rt04.retailbackend.controllers;

import static capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum.COMPLAINT;
import static capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes.*;
import capstone.rt04.retailbackend.entities.ContactUs;

import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;

import static capstone.rt04.retailbackend.util.routeconstants.FeedbackControllerRoute.CREATE_NEW_FEEDBACK;
import static capstone.rt04.retailbackend.util.routeconstants.FeedbackControllerRoute.FEEDBACK_BASE_ROUTE;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class FeedbackControllerTest  extends ApiTestSetup{
    @Test
    public void createBadFeedback(){
        ContactUs badFeedback = new ContactUs(COMPLAINT, "help", "");

        ContactUs createdFeedback = given().
                contentType("application/json").
                body(badFeedback).
                when().post(FEEDBACK_BASE_ROUTE + CREATE_NEW_FEEDBACK).
                then().statusCode(HttpStatus.CREATED.value()).extract().body().as(ContactUs.class);
        assertThat(createdFeedback.getContactUsId()).isNotNull();

    }
}
