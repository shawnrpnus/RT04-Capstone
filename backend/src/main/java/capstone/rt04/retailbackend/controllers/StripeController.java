package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.request.stripe.DeleteCardRequest;
import capstone.rt04.retailbackend.request.stripe.PaymentWithSavedCardRequest;
import capstone.rt04.retailbackend.request.stripe.SaveCardRequest;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.StripeService;
import capstone.rt04.retailbackend.services.TransactionService;
import capstone.rt04.retailbackend.util.exceptions.customer.AddressNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.customer.CreditCardNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethodCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import static capstone.rt04.retailbackend.util.Constants.ONLINE_SHOPPING_CART;

@Controller
@RequestMapping("/")
@CrossOrigin(origins = {"http://localhost:3000"})
public class StripeController {

    @Autowired
    private StripeService stripeService;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private RelationshipService relationshipService;

    // Not using saved card
    @PostMapping("/directPayment")
    public ResponseEntity<?> directPayment(@RequestParam Long totalAmount) {
        try {
            System.out.println(totalAmount);
            PaymentIntent paymentIntent = stripeService.makeDirectPayment(totalAmount);
            return new ResponseEntity<>(paymentIntent.getClientSecret(), HttpStatus.OK);
        } catch (StripeException e) {
            System.out.println("Error simulating payment");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/completeDirectPayment")
    public ResponseEntity<?> completeDirectPayment(@RequestBody PaymentWithSavedCardRequest paymentWithSavedCardRequest) throws CustomerNotFoundException, InvalidCartTypeException, AddressNotFoundException {
        capstone.rt04.retailbackend.entities.Customer customer = transactionService.createNewTransaction(paymentWithSavedCardRequest.getCustomerId(),
                paymentWithSavedCardRequest.getShoppingCartId(), ONLINE_SHOPPING_CART, paymentWithSavedCardRequest.getDeliveryAddress(), paymentWithSavedCardRequest.getBillingAddress() );
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @GetMapping("/initiateSaveCardRequest/{customerId}")
    public ResponseEntity<?> initiateSaveCardRequest(@PathVariable Long customerId) throws CustomerNotFoundException {
        try {
            String clientSecret = stripeService.initiateSaveCardRequest(customerId);
            return new ResponseEntity<>(clientSecret, HttpStatus.OK);
        } catch (StripeException e) {
            System.out.println("Error initiating save card request");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/createStripeCustomer/{customerId}")
    public ResponseEntity<?> createStripeCustomer(@PathVariable Long customerId) throws CustomerNotFoundException {
        try {
            Customer customer = stripeService.createStripeCustomer(customerId);
            return new ResponseEntity<>(customer.toJson(), HttpStatus.OK);
        } catch (StripeException e) {
            System.out.println("Error creating customer");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/listAllCards/{customerId}")
    public ResponseEntity<?> listAllCards(@PathVariable Long customerId) throws CustomerNotFoundException {
        try {
            PaymentMethodCollection paymentMethodCollections = stripeService.listAllCardOfCustomer(customerId);
            return new ResponseEntity<>(paymentMethodCollections.toJson(), HttpStatus.OK);
        } catch (StripeException e) {
            System.out.println("Error listing out all cards of the selected customer");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/saveCard")
    public ResponseEntity<?> saveCard(@RequestBody SaveCardRequest saveCardRequest) throws CustomerNotFoundException, StripeException, CreditCardNotFoundException {
        capstone.rt04.retailbackend.entities.Customer customer = stripeService.saveCard(saveCardRequest.getCustomerId(), saveCardRequest.getDefaultCard());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping("/makePaymentWithSavedCard")
    public ResponseEntity<?> makePaymentWithSavedCard(@RequestBody PaymentWithSavedCardRequest paymentWithSavedCardRequest) throws CustomerNotFoundException, InvalidCartTypeException, AddressNotFoundException {
        try {
            capstone.rt04.retailbackend.entities.Customer customer = stripeService.makePaymentWithSavedCard(paymentWithSavedCardRequest.getCustomerId(),
                    paymentWithSavedCardRequest.getPaymentMethodId(), paymentWithSavedCardRequest.getTotalAmount(), paymentWithSavedCardRequest.getShoppingCartId(),
                    paymentWithSavedCardRequest.getDeliveryAddress(), paymentWithSavedCardRequest.getBillingAddress());
            relationshipService.clearCustomerRelationships(customer);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (StripeException e) {
            System.out.println("Error creating customer");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/deleteCardOnStripeAndSql")
    public ResponseEntity<?> deleteCardOnStripeAndSql(@RequestBody DeleteCardRequest deleteCardRequest) throws CustomerNotFoundException, CreditCardNotFoundException {
        try {
            capstone.rt04.retailbackend.entities.Customer customer = stripeService.deleteCardOnStripeAndSql(deleteCardRequest.getCustomerId(), deleteCardRequest.getCreditCardId());
            relationshipService.clearCustomerRelationships(customer);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (StripeException e) {
            System.out.println("Error deleting card on stripe");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
