package capstone.rt04.retailbackend.services;

import static org.assertj.core.api.Assertions.assertThat;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;
import java.util.Map;


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CustomerServiceTest {

    @Autowired
    private CustomerService customerService;

    @Test
    public void createNewCustomer() throws Exception {
        Customer validCustomer = new Customer("Tony", "Stark", "tonystark@gmail.com", "spiderman");
        Customer testValidCustomer = customerService.createNewCustomer(validCustomer);
        assertThat(testValidCustomer.getCustomerId()).isNotNull();
        assertThat(testValidCustomer).isEqualTo(validCustomer);

        Customer removedCustomer = customerService.removeCustomer(testValidCustomer.getCustomerId());
        assertThat(removedCustomer.getCustomerId()).isEqualTo(testValidCustomer.getCustomerId());

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
        Customer validCustomer = new Customer("Tony", "Stark", "tonystark@gmail.com", "spiderman");
        Customer testValidCustomer = customerService.createNewCustomer(validCustomer);
        assertThat(testValidCustomer.getCustomerId()).isNotNull();
        assertThat(testValidCustomer).isEqualTo(validCustomer);

        Customer loggedInCustomer = customerService.customerLogin("tonystark@gmail.com", "spiderman");
        assertThat(loggedInCustomer.getCustomerId()).isEqualTo(testValidCustomer.getCustomerId());

        Customer removedCustomer = customerService.removeCustomer(testValidCustomer.getCustomerId());
        assertThat(removedCustomer.getCustomerId()).isEqualTo(testValidCustomer.getCustomerId());
    }
}