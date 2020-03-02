package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.SizeDetails;
import capstone.rt04.retailbackend.repositories.SizeDetailsRepository;
import capstone.rt04.retailbackend.util.AES;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class MiscellaneousTest {

    @Autowired
    private SizeDetailsRepository sizeDetailsRepository;
    @Autowired
    private SizeDetailsService sizeDetailsService;
    @Autowired
    private StripeService stripeService;

    @Test
    public void encryptAndDecrypt() {
        final String secretKey = "thisisasecretkey";

        String originalString = "apricotn'nut.com";
        String encryptedString = AES.encrypt(originalString, secretKey) ;
        String decryptedString = AES.decrypt(encryptedString, secretKey) ;

        System.out.println(originalString);
        System.out.println(encryptedString);
        System.out.println(decryptedString);
    }

    @Test
    public void retrieveEnumValue() {
        SizeDetails sizeDetails = new SizeDetails(SizeEnum.XS);
        sizeDetailsRepository.save(sizeDetails);

        SizeDetails size = sizeDetailsService.retrieveSizeDetailsByEnum("XS");
        System.out.println(size.toString());
    }

    @Test
    public void createPayment() throws StripeException {
        PaymentIntent paymentIntent = stripeService.makeDirectPayment(new Long(1000));
        System.out.println(paymentIntent.getAmount());
        System.out.println(paymentIntent.getConfirmationMethod());
    }

    @Test
    public void createCustomer() throws StripeException, CustomerNotFoundException {
        stripeService.createStripeCustomer(new Long(1553));
    }
}
