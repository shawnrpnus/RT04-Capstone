package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.request.payment.PaymentRequest;
import capstone.rt04.retailbackend.services.StripeService;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/")
@CrossOrigin(origins = {"http://localhost:3000"})
public class PaymentController {

    @Autowired
    private StripeService stripeService;

    @PostMapping("/simulatePayment")
    public ResponseEntity<?> simulatePayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            PaymentIntent paymentIntent = stripeService.createPayment(paymentRequest.getTotalAmount(), "sgd");
            return new ResponseEntity<>(paymentIntent.getClientSecret(), HttpStatus.OK);
        } catch (StripeException e) {
            System.out.println("Error simulating payment");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/saveCard/{customerId}")
    public ResponseEntity<?> saveCard(@PathVariable Long customerId) throws CustomerNotFoundException {
        try {
            String clientSecret = stripeService.saveCare(customerId);
            return new ResponseEntity<>(clientSecret, HttpStatus.OK);
        } catch (StripeException e) {
            System.out.println("Error saving card");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/createCustomer")
    public ResponseEntity<?> createCustomer() throws CustomerNotFoundException {
        try {
            Customer customer = stripeService.createCustomer(new Long(1553));
            return new ResponseEntity<>(customer.toJson(), HttpStatus.OK);
        } catch (StripeException e) {
            System.out.println("Error creating customer");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
