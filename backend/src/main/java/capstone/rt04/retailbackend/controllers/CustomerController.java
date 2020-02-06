package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.services.CustomerService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CreateNewCustomerException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;




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
        return new ResponseEntity<>("Hello!", HttpStatus.OK);
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
            return null;
        }
    }
}
