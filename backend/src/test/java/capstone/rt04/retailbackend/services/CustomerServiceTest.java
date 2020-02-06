package capstone.rt04.retailbackend.services;

import static org.assertj.core.api.Assertions.assertThat;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CustomerServiceTest {

    @Autowired
    private CustomerService customerService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Before
    public void beforeEachTest() throws Exception{
        Customer expectedValidCustomer = new Customer("Tony", "Stark", "tonystark@gmail.com", "spiderman");
        Customer testValidCustomer = customerService.createNewCustomer(expectedValidCustomer);
        assertThat(testValidCustomer.getCustomerId()).isNotNull();
        assertThat(testValidCustomer).isEqualTo(expectedValidCustomer);
    }

    @After
    public void afterEachTest() throws Exception{
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        Customer removedCustomer = customerService.removeCustomer(validCustomer.getCustomerId());
        assertThat(removedCustomer.getCustomerId()).isEqualTo(validCustomer.getCustomerId());
    }

    @Test
    public void createNewCustomer() throws Exception {

        Customer invalidCustomer = new Customer("Steve", "Rogers", "steve@tony@bucky", "blablabla");

        try {
            customerService.createNewCustomer(invalidCustomer);
        } catch (InputDataValidationException ex) {
            Map<String, String> expectedErrorMap = new HashMap<>();
            expectedErrorMap.put("email", "Email format is invalid");
            assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
        }
    }

    @Test
    public void customerLogin() throws Exception {

        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");

        Customer loggedInCustomer = customerService.customerLogin("tonystark@gmail.com", "spiderman");
        assertThat(loggedInCustomer.getCustomerId()).isEqualTo(validCustomer.getCustomerId());

    }

    @Test
    public void changePassword() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        String newPasswordRaw = "password";

        customerService.changePassword(validCustomer.getCustomerId(), "spiderman", newPasswordRaw);

        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");

        assertThat(encoder.matches(newPasswordRaw, validCustomer.getPassword())).isTrue();
    }

    @Test
    public void requestVerificationCode() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        String code = customerService.requestVerificationCode(validCustomer.getCustomerId());
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getVerificationCode().getCode()).isEqualTo(code);
    }

    @Test
    public void resetPassword() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        String code = customerService.requestVerificationCode(validCustomer.getCustomerId());
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getVerificationCode().getCode()).isEqualTo(code);

        String newPassword = "password123";

        customerService.resetPassword(validCustomer.getCustomerId(), code, newPassword);

        validCustomer =  customerService.retrieveCustomerByEmail("tonystark@gmail.com");

        assertThat(encoder.matches(newPassword, validCustomer.getPassword())).isTrue();
    }

    @Test
    public void updateMeasurements() throws Exception{
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        Measurements initialMeasurements = new Measurements();
        initialMeasurements.setChest(BigDecimal.valueOf(38.00));
        customerService.updateMeasurements(validCustomer.getCustomerId(), initialMeasurements);
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getMeasurements().getChest().compareTo(initialMeasurements.getChest())).isEqualTo(0);

        Measurements secondMeasurements = new Measurements();
        secondMeasurements.setChest(BigDecimal.valueOf(100.00));
        customerService.updateMeasurements(validCustomer.getCustomerId(), secondMeasurements);
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getMeasurements().getChest().compareTo(secondMeasurements.getChest())).isEqualTo(0);

    }
}