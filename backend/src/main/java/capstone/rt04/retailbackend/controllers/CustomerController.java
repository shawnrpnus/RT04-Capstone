package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.request.customer.*;
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
    public ResponseEntity<?> test() {
        Map<String, String> rsp = new HashMap<>();
        rsp.put("message", "Hello!");
        return new ResponseEntity<>(rsp, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.CREATE_NEW_CUSTOMER)
    public ResponseEntity<?> createNewCustomer(@RequestBody Customer customer) throws InputDataValidationException, CreateNewCustomerException {
        Customer newCustomer = customerService.createNewCustomer(customer);
        return new ResponseEntity<>(newCustomer, HttpStatus.CREATED);

    }

    @PostMapping(CustomerControllerRoutes.GET_CUSTOMER_BY_EMAIL)
    public ResponseEntity<?> getCustomerByEmail(@RequestBody CustomerEmailRequest customerEmailRequest) throws CustomerNotFoundException {
        Customer customer = customerService.retrieveCustomerByEmail(customerEmailRequest.getEmail());
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }


    @PostMapping(CustomerControllerRoutes.LOGIN)
    public ResponseEntity<?> customerLogin(@RequestBody CustomerLoginRequest customerLoginRequest) throws CustomerNotVerifiedException, InvalidLoginCredentialsException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(customerLoginRequest);
        if (inputErrMap != null) {
            return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        }

        Customer customer = customerService.customerLogin(customerLoginRequest.getEmail(), customerLoginRequest.getPassword());
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.CHANGE_PASSWORD)
    public ResponseEntity<?> changePassword(@RequestBody CustomerChangePasswordRequest customerChangePasswordRequest) throws CustomerNotFoundException, InvalidLoginCredentialsException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(customerChangePasswordRequest);
        if (inputErrMap != null) {
            return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        }

        customerService.changePassword(customerChangePasswordRequest.getCustomerId(),
                customerChangePasswordRequest.getOldPassword(),
                customerChangePasswordRequest.getNewPassword());
        Customer customer = customerService.retrieveCustomerByCustomerId(customerChangePasswordRequest.getCustomerId());
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @GetMapping(CustomerControllerRoutes.VERIFY)
    public ResponseEntity<?> verifyCustomer(@PathVariable String verificationCode) throws VerificationCodeInvalidException {
        Customer customer = customerService.verify(verificationCode);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.RESET_PASSWORD)
    public ResponseEntity<?> resetPassword(@RequestBody CustomerResetPasswordRequest customerResetPasswordRequest) throws CustomerNotFoundException, VerificationCodeInvalidException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(customerResetPasswordRequest);
        if (inputErrMap != null) {
            return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        }
        customerService.resetPassword(customerResetPasswordRequest.getCustomerId(),
                customerResetPasswordRequest.getVerificationCode(),
                customerResetPasswordRequest.getNewPassword());
        Customer customer = customerService.retrieveCustomerByCustomerId(customerResetPasswordRequest.getCustomerId());
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.UPDATE_MEASUREMENTS)
    public ResponseEntity<?> updateMeasurements(@RequestBody CustomerUpdateMeasurementsRequest customerUpdateMeasurementsRequest) throws CustomerNotFoundException, InputDataValidationException {
        Measurements measurements = customerService.updateMeasurements(
                customerUpdateMeasurementsRequest.getCustomerId(),
                customerUpdateMeasurementsRequest.getMeasurements());
        return new ResponseEntity<>(measurements, HttpStatus.OK);
    }

    // TODO: CD credit cards
    @PostMapping(CustomerControllerRoutes.ADD_CREDIT_CARD)
    public ResponseEntity<?> addCreditCard(@RequestBody AddCreditCardRequest addCreditCardRequest) {
        Map<String, String> inputErrMap = validationService.generateErrorMap(addCreditCardRequest);
        if (inputErrMap != null) {
            return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        }
        return null;
    }

    // TODO: CUD shipping address
    // TODO: CRUD wishlist

    @DeleteMapping(CustomerControllerRoutes.DELETE_CUSTOMER)
    public ResponseEntity<?> deleteCustomer(@PathVariable Long customerId) throws CustomerCannotDeleteException, CustomerNotFoundException {
        Customer deletedCustomer = customerService.removeCustomer(customerId);
        return new ResponseEntity<>(deletedCustomer, HttpStatus.OK);
    }
}
