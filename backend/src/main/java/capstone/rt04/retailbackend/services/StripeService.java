package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.SetupIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class StripeService {

    // Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys

    private final CustomerService customerService;

    public StripeService(CustomerService customerService) {
        this.customerService = customerService;
    }

    public PaymentIntent createPayment(Long totalAmount, String currency) throws StripeException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        Map<String, String> initialMetadata = new HashMap<String, String>();
        initialMetadata.put("integration_check", "accept_a_payment");

        PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder()
                .setCurrency(currency).setAmount(totalAmount).putMetadata("metadata", initialMetadata.get("integration_check"))
                .build();

        // Verify your integration in this guide by including this parameter
        PaymentIntent intent = PaymentIntent.create(createParams);

        System.out.print(intent.getClientSecret());
        return intent;
    }

    public String saveCare(Long customerId) throws StripeException, CustomerNotFoundException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        capstone.rt04.retailbackend.entities.Customer dbCustomer = customerService.retrieveCustomerByCustomerId(customerId);
        Map<String, Object> params = new HashMap<>();
        params.put("customer", dbCustomer.getCreditCardCustomerId());
        SetupIntent intent = SetupIntent.create(params);

        // Returning client secret to authenticate saving of credit card to the customer
        return intent.getClientSecret();
    }


    public Customer createCustomer(Long customerId) throws StripeException, CustomerNotFoundException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        capstone.rt04.retailbackend.entities.Customer dbCustomer = customerService.retrieveCustomerByCustomerId(customerId);

        Map<String, Object> customerParams = new HashMap<String, Object>();
        customerParams.put("name", dbCustomer.getFirstName() + dbCustomer.getLastName());
        customerParams.put("email",  dbCustomer.getEmail());
        Customer customer = Customer.create(customerParams);

        dbCustomer.setCreditCardCustomerId(customer.getId());

        System.out.println(customer);
        return customer;
    }
}

//
//
//// Charge the Customer instead of the card:
//        ChargeCreateParams chargeParams =
//                ChargeCreateParams.builder()
//                        .setAmount(1000L)
//                        .setCurrency("usd")
//                        .setCustomer(customer.getId())
//                        .build();
//
//        Charge charge = Charge.create(chargeParams);
//
//// YOUR CODE: Save the customer ID and other info in a database for later.
//
//// When it's time to charge the customer again, retrieve the customer ID.
//        ChargeCreateParams chargeParams2 =
//                ChargeCreateParams.builder()
//                        .setAmount(1500L) // $15.00 this time
//                        .setCurrency("usd")
//                        .setCustomer(customerId) // Previously stored, then retrieved
//                        .build();
//
//        Charge charge2 = Charge.create(chargeParams2);
//
//
//        Map<String, Object> params = new HashMap<>();
//        params.put("amount", 999);
//        params.put("currency", "sgd");
//        params.put("description", "Example charge");
//        params.put("source", token);
//        Charge charge = Charge.create(params);
