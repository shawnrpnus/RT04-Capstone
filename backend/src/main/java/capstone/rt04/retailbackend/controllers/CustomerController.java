package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.CreditCard;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.request.customer.CustomerEmailRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.CustomerService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CreateNewCustomerException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerCannotDeleteException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import javax.xml.ws.Response;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = {"http://localhost:3000"})
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/test")
    public ResponseEntity<?> test(){
        Map<String, String> rsp = new HashMap<>();
        rsp.put("message", "Hello!");
        return new ResponseEntity<>(rsp, HttpStatus.OK);
    }

    @PostMapping("/createNewCustomer")
    public ResponseEntity<?> createNewCustomer(@RequestBody Customer customer) {
        try {
            Customer newCustomer = customerService.createNewCustomer(customer);
            return new ResponseEntity<>(newCustomer, HttpStatus.CREATED);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (CreateNewCustomerException ex) {
            //TODO: create a response entity
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/getCustomerByEmail")
    public ResponseEntity<?> getCustomerByEmail(@RequestBody CustomerEmailRequest customerEmailRequest){
        try {
            Customer customer = customerService.retrieveCustomerByEmail(customerEmailRequest.getEmail());
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (CustomerNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/deleteCustomer/{customerId}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long customerId){
        try {
            Customer deletedCustomer = customerService.removeCustomer(customerId);
            return new ResponseEntity<>(deletedCustomer, HttpStatus.OK);
        } catch (CustomerNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (CustomerCannotDeleteException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
