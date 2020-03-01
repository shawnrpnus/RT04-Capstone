package capstone.rt04.retailbackend.services;

import static org.assertj.core.api.Assertions.assertThat;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.InvalidLoginCredentialsException;
import org.junit.Test;
import org.junit.runner.RunWith;
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
public class CustomerServiceTest extends ServiceTestSetup {


    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Test
    public void createNewCustomer() throws Exception {

        Customer invalidCustomer = new Customer("Steve", "Rogers", "steve@tony@bucky", "blablabla");

        try {
            customerService.createNewCustomer(invalidCustomer);
        } catch (InputDataValidationException ex) {
            Map<String, String> expectedErrorMap = new HashMap<>();
            expectedErrorMap.put("email", ErrorMessages.EMAIL_INVALID);
            assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
        }
    }

    @Test
    public void updateCustomer() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        customerService.updateCustomerDetails(validCustomer.getCustomerId(), "Bruce", "Wayne");
        Customer updatedCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(updatedCustomer.getFirstName()).isEqualTo("Bruce");
        assertThat(updatedCustomer.getLastName()).isEqualTo("Wayne");
    }

    @Test
    public void updateEmail() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        customerService.sendUpdateEmailLink(validCustomer.getCustomerId(), "ultron@gmail.com");
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getRequestedNewEmail()).isEqualTo("ultron@gmail.com");

        customerService.updateEmail(validCustomer.getVerificationCode().getCode());
        Customer updatedEmailCustomer = customerService.retrieveCustomerByEmail("ultron@gmail.com");
        assertThat(updatedEmailCustomer.getCustomerId().compareTo(validCustomer.getCustomerId())).isZero();
        assertThat(updatedEmailCustomer.getRequestedNewEmail()).isNull();
    }

    @Test(expected = InvalidLoginCredentialsException.class)
    public void customerLogin() throws Exception {

        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        generateVerificationCodeAndVerify();
        Customer loggedInCustomer = customerService.customerLogin(VALID_CUST_EMAIL, "spiderman");
        assertThat(loggedInCustomer.getCustomerId()).isEqualTo(validCustomer.getCustomerId());

        customerService.customerLogin("invalidEmail@gmail.com", "password");
        customerService.customerLogin(VALID_CUST_EMAIL, "wrongPassword");
    }

    @Test
    public void changePassword() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        String newPasswordRaw = "password";

        customerService.changePassword(validCustomer.getCustomerId(), "spiderman", newPasswordRaw);

        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);

        assertThat(encoder.matches(newPasswordRaw, validCustomer.getPassword())).isTrue();
    }

    public void generateVerificationCodeAndVerify() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        VerificationCode vCode = customerService.generateVerificationCode(validCustomer.getCustomerId());
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getVerificationCode().getCode()).isEqualTo(vCode.getCode());

        customerService.verify(vCode.getCode());
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.isVerified()).isTrue();
    }


    @Test
    public void resetPassword() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        VerificationCode vCode = customerService.generateVerificationCode(validCustomer.getCustomerId());
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getVerificationCode().getCode()).isEqualTo(vCode.getCode());

        String newPassword = "password123";

        customerService.resetPassword(vCode.getCode(), newPassword, newPassword);

        validCustomer =  customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);

        assertThat(encoder.matches(newPassword, validCustomer.getPassword())).isTrue();
    }

    @Test
    public void updateMeasurements() throws Exception{
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        Measurements initialMeasurements = new Measurements();
        initialMeasurements.setChest(BigDecimal.valueOf(38.00));
        customerService.updateMeasurements(validCustomer.getCustomerId(), initialMeasurements);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getMeasurements().getChest().compareTo(initialMeasurements.getChest())).isEqualTo(0);

        Measurements secondMeasurements = new Measurements();
        secondMeasurements.setChest(BigDecimal.valueOf(100.00));
        customerService.updateMeasurements(validCustomer.getCustomerId(), secondMeasurements);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getMeasurements().getChest().compareTo(secondMeasurements.getChest())).isEqualTo(0);

        validCustomer = customerService.deleteMeasurements(validCustomer.getCustomerId());
        assertThat(validCustomer.getMeasurements()).isNull();
    }

    @Test
    public void crudCreditCards() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        CreditCard newCreditCard = new CreditCard("123", "123", 12, 23, true);
        customerService.addCreditCard(validCustomer.getCustomerId(), newCreditCard);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getCreditCards().contains(newCreditCard)).isTrue();
        assertThat(validCustomer.getCreditCards().size()).isEqualTo(1);

        CreditCard c = customerService.getCreditCard(validCustomer.getCustomerId(), validCustomer.getCreditCards().get(0).getCreditCardId());
        assertThat(c).isEqualTo(newCreditCard);

        customerService.deleteCreditCard(validCustomer.getCustomerId(), validCustomer.getCreditCards().get(0).getCreditCardId());
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getCreditCards().size()).isEqualTo(0);
    }

    @Test
    public void crudShippingAddress() throws Exception {
        //create
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        Address newShippingAddress = new Address("line1", null, 510149, null, false, null, null);
        newShippingAddress.setBilling(true);
        customerService.addShippingAddress(validCustomer.getCustomerId(), newShippingAddress);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getShippingAddresses().contains(newShippingAddress)).isTrue();
        assertThat(validCustomer.getShippingAddresses().size()).isEqualTo(1);
        assertThat(validCustomer.getShippingAddresses().get(0).isBilling()).isTrue();

        //create another
        Address newShippingAddress2 = new Address("line1", null, 510148, "building");
        newShippingAddress2.setBilling(true);
        customerService.addShippingAddress(validCustomer.getCustomerId(), newShippingAddress2);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getShippingAddresses().contains(newShippingAddress2)).isTrue();
        assertThat(validCustomer.getShippingAddresses().size()).isEqualTo(2);
        assertThat(validCustomer.getShippingAddresses().get(1).isBilling()).isTrue();
        assertThat(validCustomer.getShippingAddresses().get(0).isBilling()).isFalse();

        //retrieve
        Address a = customerService.getShippingAddress(validCustomer.getCustomerId(), validCustomer.getShippingAddresses().get(0).getAddressId());
        newShippingAddress.setBilling(false); //is false after address2 is set as billing
        assertThat(a).isEqualTo(newShippingAddress);

        //update
        a.setLine1("line1updated");
        customerService.updateShippingAddress(validCustomer.getCustomerId(), a);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getShippingAddresses().get(0).getLine1()).isEqualTo("line1updated");

        //delete both
        customerService.deleteShippingAddress(validCustomer.getCustomerId(), a.getAddressId());
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getShippingAddresses().size()).isEqualTo(1);

        customerService.deleteShippingAddress(validCustomer.getCustomerId(), validCustomer.getShippingAddresses().get(0).getAddressId());
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getShippingAddresses().size()).isEqualTo(0);
    }

    @Test
    public void crudWishlistItems() throws Exception{
        //add
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        customerService.addProductToWishlist(validCustomer.getCustomerId(), productVariantId);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getWishlistItems().size()).isEqualTo(1);
        assertThat(validCustomer.getWishlistItems().get(0).getProductVariantId()).isEqualTo(productVariantId);

        //remove
        customerService.removeProductFromWishlist(validCustomer.getCustomerId(), productVariantId);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getWishlistItems().size()).isEqualTo(0);

        //add again
        customerService.addProductToWishlist(validCustomer.getCustomerId(), productVariantId);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getWishlistItems().size()).isEqualTo(1);
        assertThat(validCustomer.getWishlistItems().get(0).getProductVariantId()).isEqualTo(productVariantId);

        //add to shopping cart
        customerService.addWishlistToShoppingCart(validCustomer.getCustomerId());
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getOnlineShoppingCart().getShoppingCartItems().size()).isEqualTo(1);
        assertThat(validCustomer.getOnlineShoppingCart().getShoppingCartItems().get(0)
                .getProductVariant().getProductVariantId()).isEqualTo(productVariantId);

        //clear
        customerService.clearWishList(validCustomer.getCustomerId());
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getWishlistItems().size()).isEqualTo(0);
    }

    @Test
    public void crudReservationCartItems() throws Exception{
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        customerService.addProductToReservationCart(validCustomer.getCustomerId(), productVariantId);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getReservationCartItems().size()).isEqualTo(1);
        assertThat(validCustomer.getReservationCartItems().get(0).getProductVariantId()).isEqualTo(productVariantId);

        customerService.removeProductFromReservationCart(validCustomer.getCustomerId(), productVariantId);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getReservationCartItems().size()).isEqualTo(0);

        customerService.addProductToReservationCart(validCustomer.getCustomerId(), productVariantId);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getReservationCartItems().size()).isEqualTo(1);
        assertThat(validCustomer.getReservationCartItems().get(0).getProductVariantId()).isEqualTo(productVariantId);

        customerService.clearReservationCart(validCustomer.getCustomerId());
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getReservationCartItems().size()).isEqualTo(0);
    }

    @Test
    public void addRemoveStyles() throws Exception {
        Customer validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        customerService.addStyle(validCustomer.getCustomerId(), styleId);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getPreferredStyles().size()).isOne();
        assertThat(validCustomer.getPreferredStyles().get(0).getStyleId().compareTo(styleId)).isZero();

        customerService.removeStyle(validCustomer.getCustomerId(), styleId);
        validCustomer = customerService.retrieveCustomerByEmail(VALID_CUST_EMAIL);
        assertThat(validCustomer.getPreferredStyles().size()).isZero();
    }
}