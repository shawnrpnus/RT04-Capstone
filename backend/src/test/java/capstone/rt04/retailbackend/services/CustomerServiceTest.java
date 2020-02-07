package capstone.rt04.retailbackend.services;

import static org.assertj.core.api.Assertions.assertThat;

import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.entities.CreditCard;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.InvalidLoginCredentialsException;
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
        assertThat(testValidCustomer.getOnlineShoppingCart()).isNotNull();
        assertThat(testValidCustomer.getInStoreShoppingCart()).isNotNull();
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
    public void updateEmail() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        customerService.updateEmail(validCustomer.getCustomerId(), "ultron@gmail.com");
        customerService.retrieveCustomerByEmail("ultron@gmail.com");
        customerService.updateEmail(validCustomer.getCustomerId(), "tonystark@gmail.com");
        customerService.retrieveCustomerByEmail("tonystark@gmail.com");
    }

    @Test(expected = InvalidLoginCredentialsException.class)
    public void customerLogin() throws Exception {

        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");

        Customer loggedInCustomer = customerService.customerLogin("tonystark@gmail.com", "spiderman");
        assertThat(loggedInCustomer.getCustomerId()).isEqualTo(validCustomer.getCustomerId());

        customerService.customerLogin("invalidEmail@gmail.com", "password");
        customerService.customerLogin("tonystark@gmail.com", "wrongPassword");
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
    public void generateVerificationCodeAndVerify() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        String code = customerService.generateVerificationCode(validCustomer.getCustomerId());
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getVerificationCode().getCode()).isEqualTo(code);

        customerService.verify(code);
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.isVerified()).isTrue();
    }


    @Test
    public void resetPassword() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        String code = customerService.generateVerificationCode(validCustomer.getCustomerId());
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

    @Test
    public void crudCreditCards() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        CreditCard newCreditCard = new CreditCard("123", "123", 12, 23, true);
        customerService.addCreditCard(validCustomer.getCustomerId(), newCreditCard);
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getCreditCards().contains(newCreditCard)).isTrue();
        assertThat(validCustomer.getCreditCards().size()).isEqualTo(1);

        CreditCard c = customerService.getCreditCard(validCustomer.getCustomerId(), validCustomer.getCreditCards().get(0).getCreditCardId());
        assertThat(c).isEqualTo(newCreditCard);

        customerService.deleteCreditCard(validCustomer.getCustomerId(), validCustomer.getCreditCards().get(0).getCreditCardId());
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getCreditCards().size()).isEqualTo(0);
    }

    @Test
    public void crudShippingAddress() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        Address newShippingAddress = new Address("line1", null, "510149", null, false, null, null);
        customerService.addShippingAddress(validCustomer.getCustomerId(), newShippingAddress);
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getShippingAddresses().contains(newShippingAddress)).isTrue();
        assertThat(validCustomer.getShippingAddresses().size()).isEqualTo(1);

        Address a = customerService.getShippingAddress(validCustomer.getCustomerId(), validCustomer.getShippingAddresses().get(0).getAddressId());
        assertThat(a).isEqualTo(newShippingAddress);

        a.setLine1("line1updated");
        customerService.updateShippingAddress(validCustomer.getCustomerId(), a);

        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getShippingAddresses().get(0).getLine1()).isEqualTo("line1updated");

        customerService.deleteShippingAddress(validCustomer.getCustomerId(), a.getAddressId());
        validCustomer = customerService.retrieveCustomerByEmail("tonystark@gmail.com");
        assertThat(validCustomer.getShippingAddresses().size()).isEqualTo(0);

    }


}