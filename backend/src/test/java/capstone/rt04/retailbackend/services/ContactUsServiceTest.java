package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.ContactUs;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;
import java.util.Map;

import static capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum.COMPLAINT;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ContactUsServiceTest {

    @Autowired
    private ContactUsService contactUsService;

    @Test
    public void createNewCustomer() throws Exception{

        ContactUs errorContactUs = new ContactUs(COMPLAINT,"Help", "" );
        try {
            contactUsService.createNewContactUs(errorContactUs);
        } catch (InputDataValidationException ex) {
            Map<String, String> expectedErrorMap = new HashMap<>();
            expectedErrorMap.put("customerEmail", "Do not leave blank");
            assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
        }

    }




}
