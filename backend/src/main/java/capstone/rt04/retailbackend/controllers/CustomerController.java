package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.request.customer.CustomerChangePasswordRequest;
import capstone.rt04.retailbackend.request.customer.CustomerEmailRequest;
import capstone.rt04.retailbackend.request.customer.CustomerLoginRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.CustomerService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(CustomerControllerRoutes.CUSTOMER_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class CustomerController {

    private final CustomerService customerService;
    private final ValidationService validationService;

    public CustomerController(CustomerService customerService, ValidationService validationService) {
        this.customerService = customerService;
        this.validationService = validationService;
    }

    @GetMapping("/test")
    public ResponseEntity<?> test(){
        Map<String, String> rsp = new HashMap<>();
        rsp.put("message", "Hello!");
        return new ResponseEntity<>(rsp, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.CREATE_NEW_CUSTOMER)
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

    @PostMapping(CustomerControllerRoutes.GET_CUSTOMER_BY_EMAIL)
    public ResponseEntity<?> getCustomerByEmail(@RequestBody CustomerEmailRequest customerEmailRequest){
        try {
            Customer customer = customerService.retrieveCustomerByEmail(customerEmailRequest.getEmail());
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (CustomerNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping(CustomerControllerRoutes.LOGIN)
    public ResponseEntity<?> customerLogin(@RequestBody CustomerLoginRequest customerLoginRequest){
        try {
            Customer customer = customerService.customerLogin(customerLoginRequest.getEmail(), customerLoginRequest.getPassword());
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (InvalidLoginCredentialsException | CustomerNotVerifiedException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping(CustomerControllerRoutes.CHANGE_PASSWORD)
    public ResponseEntity<?> changePassword(@RequestBody CustomerChangePasswordRequest customerChangePasswordRequest){
        Map<String, String> inputErrMap = validationService.generateErrorMap(customerChangePasswordRequest);
        if (inputErrMap != null){
            return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        }
        try {
            customerService.changePassword(customerChangePasswordRequest.getCustomerId(),
                    customerChangePasswordRequest.getOldPassword(),
                    customerChangePasswordRequest.getNewPassword());
            Customer customer = customerService.retrieveCustomerByCustomerId(customerChangePasswordRequest.getCustomerId());
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (InvalidLoginCredentialsException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.UNAUTHORIZED);
        } catch (CustomerNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(CustomerControllerRoutes.VERIFY)
    public ResponseEntity<?> verifyCustomer(@PathVariable String verificationCode){
        try {
            Customer customer = customerService.verify(verificationCode);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (VerificationCodeInvalidException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(CustomerControllerRoutes.DELETE_CUSTOMER)
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
