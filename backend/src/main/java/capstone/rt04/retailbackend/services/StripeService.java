package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.CreditCard;
import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.exceptions.customer.AddressNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.customer.CreditCardNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import com.stripe.Stripe;
import com.stripe.exception.CardException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentMethodListParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static capstone.rt04.retailbackend.util.Constants.IN_STORE_SHOPPING_CART;
import static capstone.rt04.retailbackend.util.Constants.ONLINE_SHOPPING_CART;

@Service
@Transactional
@Slf4j
public class StripeService {

    // Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys

    private final CustomerService customerService;
    private final TransactionService transactionService;

    public StripeService(@Lazy CustomerService customerService, @Lazy TransactionService transactionService) {
        this.customerService = customerService;
        this.transactionService = transactionService;
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

//    public capstone.rt04.retailbackend.entities.Customer completeDirectPayment(Long customerId, Long shoppingCartId) throws CustomerNotFoundException, InvalidCartTypeException {
//        transactionService.createNewTransaction(customerId, shoppingCartId, ONLINE_SHOPPING_CART);
//        capstone.rt04.retailbackend.entities.Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
//        return customer;
//    }

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

    public Transaction makePaymentWithSavedCard(Long customerId, String paymentMethodId, Long totalAmount,
                                                Long storeId, capstone.rt04.retailbackend.entities.Address deliveryAddress,
                                                capstone.rt04.retailbackend.entities.Address billingAddress, Long storeToCollectId,
                                                Long promoCodeId, CollectionModeEnum collectionModeEnum, String cardIssuer, String cardLast4)
            throws CustomerNotFoundException, StripeException, InvalidCartTypeException, AddressNotFoundException, StoreNotFoundException, PromoCodeNotFoundException {
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
            if (storeId == null) {
                System.out.println("Online Payment success!");
                return transactionService.createNewTransaction(customerId, storeId, ONLINE_SHOPPING_CART, deliveryAddress, billingAddress, storeToCollectId, promoCodeId, collectionModeEnum, cardIssuer, cardLast4, paymentMethodId);
            } else {
                System.out.println("In Store Payment success!");
                System.out.print(intent.getClientSecret());
                return transactionService.createNewTransaction(customerId, storeId, IN_STORE_SHOPPING_CART, deliveryAddress, billingAddress, storeToCollectId, promoCodeId, collectionModeEnum, cardIssuer, cardLast4, paymentMethodId);
            }

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

        for (CreditCard creditCard : creditCards) {
            if (creditCard.getCreditCardId().equals(creditCardId)) {
                PaymentMethod paymentMethod = PaymentMethod.retrieve(creditCard.getPaymentMethodId());
                paymentMethod.detach();
                customerService.deleteCreditCard(customerId, creditCard.getCreditCardId());
                break;
            }
        }
        return dbCustomer;
    }

    public capstone.rt04.retailbackend.entities.Customer addCreditCardMobile(Long customerId, String tokenId) throws CustomerNotFoundException, StripeException {
        Stripe.apiKey = "sk_test_E81pq87cIYZxL2NkXaXKsEEd00MGrcKvYx";

        capstone.rt04.retailbackend.entities.Customer dbCustomer = customerService.retrieveCustomerByCustomerId(customerId);
        Customer customer = Customer.retrieve(dbCustomer.getCreditCardCustomerId());
        Map<String, Object> params = new HashMap<>();
        params.put("source", tokenId);
        Card card = (Card) customer.getSources().create(params);
        CreditCard creditCard = new CreditCard(card.getLast4(), card.getId(), Math.toIntExact(card.getExpMonth()), Math.toIntExact(card.getExpYear()),
                card.getBrand(), true);
        return customerService.addCreditCard(customerId, creditCard);

    }

}