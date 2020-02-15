package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.request.customer.*;
import capstone.rt04.retailbackend.services.CustomerService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
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

    @PostMapping(CustomerControllerRoutes.UPDATE_CUSTOMER)
    public ResponseEntity<?> updateCustomer(@RequestBody Customer customer) throws CustomerNotFoundException, InputDataValidationException {
        Customer updatedCustomer = customerService.updateCustomerDetails(customer);
        return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
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

    @PostMapping(CustomerControllerRoutes.ADD_CREDIT_CARD)
    public ResponseEntity<?> addCreditCard(@RequestBody AddCreditCardRequest addCreditCardRequest) throws CustomerNotFoundException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(addCreditCardRequest);
        if (inputErrMap != null) return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        Customer customer = customerService.addCreditCard(addCreditCardRequest.getCustomerId(), addCreditCardRequest.getCreditCard());
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @DeleteMapping(CustomerControllerRoutes.REMOVE_CREDIT_CARD)
    public ResponseEntity<?> removeCreditCard(@RequestBody RemoveCreditCardRequest removeCreditCardRequest) throws CustomerNotFoundException, CreditCardNotFoundException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(removeCreditCardRequest);
        if (inputErrMap != null) return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        Customer customer = customerService.deleteCreditCard(removeCreditCardRequest.getCustomerId(), removeCreditCardRequest.getCreditCardId());
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_SHIPPING_ADDRESS)
    public ResponseEntity<?> addShippingAddress(@RequestBody AddUpdateShippingAddressRequest addUpdateShippingAddressRequest) throws CustomerNotFoundException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(addUpdateShippingAddressRequest);
        if (inputErrMap != null) return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        Customer customer = customerService.addShippingAddress(addUpdateShippingAddressRequest.getCustomerId(), addUpdateShippingAddressRequest.getShippingAddress());
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.UPDATE_SHIPPING_ADDRESS)
    public ResponseEntity<?> updateShippingAddress(@RequestBody AddUpdateShippingAddressRequest req) throws CustomerNotFoundException, AddressNotFoundException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(req);
        if (inputErrMap != null) return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        Address address = customerService.updateShippingAddress(req.getCustomerId(), req.getShippingAddress());
        return new ResponseEntity<>(address, HttpStatus.OK);
    }

    @DeleteMapping(CustomerControllerRoutes.REMOVE_SHIPPING_ADDRESS)
    public ResponseEntity<?> removeShippingAddress(@RequestBody RemoveShippingAddressRequest req) throws CustomerNotFoundException, AddressNotFoundException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(req);
        if (inputErrMap != null) return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        Customer customer = customerService.deleteShippingAddress(req.getCustomerId(), req.getShippingAddressId());
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_TO_WISHLIST)
    public ResponseEntity<?> addToWishlist(@RequestParam Long customerId, @RequestParam Long productVariantId) throws CustomerNotFoundException, ProductVariantNotFoundException {
        Customer customer = customerService.addProductToWishlist(customerId, productVariantId);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.REMOVE_FROM_WISHLIST)
    public ResponseEntity<?> removeFromWishlist(@RequestParam Long customerId, @RequestParam Long productVariantId) throws ProductVariantNotFoundException, CustomerNotFoundException {
        Customer customer = customerService.removeProductFromWishlist(customerId, productVariantId);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.CLEAR_WISHLIST)
    public ResponseEntity<?> clearWishlist(@RequestParam Long customerId) throws CustomerNotFoundException {
        Customer customer = customerService.clearWishList(customerId);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @DeleteMapping(CustomerControllerRoutes.DELETE_CUSTOMER)
    public ResponseEntity<?> deleteCustomer(@PathVariable Long customerId) throws CustomerCannotDeleteException, CustomerNotFoundException {
        Customer deletedCustomer = customerService.removeCustomer(customerId);
        return new ResponseEntity<>(deletedCustomer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_STYLE)
    public ResponseEntity<?> addStyle(@RequestParam Long customerId, @RequestParam Long styleId) throws CustomerNotFoundException, StyleNotFoundException {
        Customer customer = customerService.addStyle(customerId, styleId);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.REMOVE_STYLE)
    public ResponseEntity<?> removeStyle(@RequestParam Long customerId, @RequestParam Long styleId) throws CustomerNotFoundException, StyleNotFoundException {
        Customer customer = customerService.removeStyle(customerId, styleId);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

}
