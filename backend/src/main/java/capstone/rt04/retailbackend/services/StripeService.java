package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.CreditCard;
import capstone.rt04.retailbackend.util.exceptions.customer.CreditCardNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import com.stripe.Stripe;
import com.stripe.exception.CardException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentMethodListParams;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class StripeService {

    // Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys

    private final CustomerService customerService;

    public StripeService(@Lazy CustomerService customerService) {
        this.customerService = customerService;
    }

    public PaymentIntent makeDirectPayment(Long totalAmount) throws StripeException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        Map<String, String> initialMetadata = new HashMap<String, String>();
        initialMetadata.put("integration_check", "accept_a_payment");

        PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder()
                .setCurrency("sgd").setAmount(totalAmount).putMetadata("metadata", initialMetadata.get("integration_check"))
                .build();

        // Verify your integration in this guide by including this parameter
        PaymentIntent intent = PaymentIntent.create(createParams);

        System.out.print(intent.getClientSecret());
        return intent;
    }

    public String initiateSaveCardRequest(Long customerId) throws StripeException, CustomerNotFoundException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        capstone.rt04.retailbackend.entities.Customer dbCustomer = customerService.retrieveCustomerByCustomerId(customerId);
        Map<String, Object> params = new HashMap<>();
        params.put("customer", dbCustomer.getCreditCardCustomerId());
        SetupIntent setupIntent = SetupIntent.create(params);
        // Returning client secret to authenticate saving of credit card to the customer
        return setupIntent.getClientSecret();
    }

    public capstone.rt04.retailbackend.entities.Customer saveCard(Long customerId, Boolean defaultCard) throws CustomerNotFoundException, StripeException, CreditCardNotFoundException {
        // Card has already been saved on Stripe
        // Retrieve all latest card and add the latest one by checking through their ID
        PaymentMethodCollection paymentMethodCollection = listAllCardOfCustomer(customerId);
        List<PaymentMethod> paymentMethodList = paymentMethodCollection.getData();
        CreditCard creditCard;
        PaymentMethod.Card card;
        for (PaymentMethod paymentMethod : paymentMethodList) {
            // If there's card in Stripe that doesn't exist in Spring database, save them
            if (customerService.retrieveCreditCardByPaymentMethodId(customerId, paymentMethod.getId()) == null) {
                card = paymentMethod.getCard();
                creditCard = new CreditCard(card.getLast4(), paymentMethod.getId(), Math.toIntExact(card.getExpMonth()), Math.toIntExact(card.getExpYear()),
                        card.getBrand(), defaultCard);
                customerService.addCreditCard(customerId, creditCard);
            }
        }
        return customerService.retrieveCustomerByCustomerId(customerId);
    }

    public Customer createStripeCustomer(Long customerId) throws StripeException, CustomerNotFoundException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        capstone.rt04.retailbackend.entities.Customer dbCustomer = customerService.retrieveCustomerByCustomerId(customerId);

        if (dbCustomer.getCreditCardCustomerId() != null) {
            return null;
        }

        Map<String, Object> customerParams = new HashMap<String, Object>();
        customerParams.put("name", dbCustomer.getFirstName() + " " + dbCustomer.getLastName());
        customerParams.put("email", dbCustomer.getEmail());
        Customer customer = Customer.create(customerParams);
        dbCustomer.setCreditCardCustomerId(customer.getId());
        System.out.println(customer);
        return customer;
    }

    public PaymentMethodCollection listAllCardOfCustomer(Long customerId) throws CustomerNotFoundException, StripeException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        capstone.rt04.retailbackend.entities.Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        PaymentMethodListParams listParams = new PaymentMethodListParams.Builder().setCustomer(customer.getCreditCardCustomerId())
                .setType(PaymentMethodListParams.Type.CARD).build();

        PaymentMethodCollection paymentMethods = PaymentMethod.list(listParams);
        System.out.println(paymentMethods);
        return paymentMethods;
    }

    public capstone.rt04.retailbackend.entities.Customer makePaymentWithSavedCard(Long customerId, String paymentMethodId, Long totalAmount, Long shoppingCartId) throws CustomerNotFoundException, StripeException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        capstone.rt04.retailbackend.entities.Customer customer = customerService.retrieveCustomerByCustomerId(customerId);

        PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder()
                .setCurrency("sgd")
                .setAmount(totalAmount)
                .setPaymentMethod(paymentMethodId)
                .setCustomer(customer.getCreditCardCustomerId())
                .setConfirm(true)
                .setOffSession(true)
                .build();

        try {
            PaymentIntent intent = PaymentIntent.create(createParams);
            // TODO: Convert shopping cart item to transaction line item and create new transaction
            System.out.println("Payment success!");
            System.out.print(intent.getClientSecret());
            return customer;
        } catch (CardException err) {
            // Error code will be authentication_required if authentication is needed
            System.out.println("Error code is : " + err.getCode());
            String paymentIntentId = err.getStripeError().getPaymentIntent().getId();
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            System.out.println(paymentIntent.getId());
            return null;
        }
    }

    public capstone.rt04.retailbackend.entities.Customer deleteCardOnStripeAndSql(Long customerId, Long creditCardId) throws StripeException, CustomerNotFoundException, CreditCardNotFoundException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        capstone.rt04.retailbackend.entities.Customer dbCustomer = customerService.retrieveCustomerByCustomerId(customerId);

        List<CreditCard> creditCards = new ArrayList<>(dbCustomer.getCreditCards());

        for(CreditCard creditCard : creditCards) {
            if(creditCard.getCreditCardId().equals(creditCardId)) {
                System.out.println("Deleting card");
                PaymentMethod paymentMethod = PaymentMethod.retrieve(creditCard.getPaymentMethodId());
                paymentMethod.detach();
                customerService.deleteCreditCard(customerId, creditCard.getCreditCardId());
                break;
            }
        }
        return dbCustomer;
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
