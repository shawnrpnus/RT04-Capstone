package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.request.customer.*;
import capstone.rt04.retailbackend.services.CustomerService;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.ShoppingCartService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InsufficientStockException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes;
import com.stripe.exception.StripeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("Duplicates")
@RestController
@RequestMapping(CustomerControllerRoutes.CUSTOMER_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CustomerController {

    private final CustomerService customerService;
    private final ValidationService validationService;
    private final ShoppingCartService shoppingCartService;
    private final RelationshipService relationshipService;

    public CustomerController(CustomerService customerService, ValidationService validationService, ShoppingCartService shoppingCartService, RelationshipService relationshipService) {
        this.customerService = customerService;
        this.validationService = validationService;
        this.shoppingCartService = shoppingCartService;
        this.relationshipService = relationshipService;
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, String> rsp = new HashMap<>();
        rsp.put("message", "Hello!");
        return new ResponseEntity<>(rsp, HttpStatus.OK);
    }

    // 1. Sends verification link to customer's email
    @PostMapping(CustomerControllerRoutes.CREATE_NEW_CUSTOMER)
    public ResponseEntity<?> createNewCustomer(@RequestBody Customer customer) throws InputDataValidationException, CreateNewCustomerException, StripeException {
        Customer newCustomer = customerService.createNewCustomer(customer);
        relationshipService.clearCustomerRelationships(newCustomer);
        return new ResponseEntity<>(newCustomer, HttpStatus.CREATED);
    }

    // 2. Customer clicks verification link --> call this API
    @GetMapping(CustomerControllerRoutes.VERIFY)
    public ResponseEntity<?> verifyCustomer(@PathVariable String verificationCode) throws VerificationCodeExpiredException, VerificationCodeNotFoundException, AlreadyVerifiedException {
        Customer customer = customerService.verify(verificationCode);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.RESEND_VERIFY_EMAIL)
    public ResponseEntity<?> resetEmailCustomer(@RequestBody CustomerEmailRequest customerEmailRequest) throws CustomerNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(customerEmailRequest);
        customerService.nodeGenerateVerificationLinkAndSendEmail(customerEmailRequest.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping(CustomerControllerRoutes.GET_CUSTOMER_BY_EMAIL)
    public ResponseEntity<?> getCustomerByEmail(@RequestBody CustomerEmailRequest customerEmailRequest) throws CustomerNotFoundException {
        Customer customer = customerService.retrieveCustomerByEmail(customerEmailRequest.getEmail());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @GetMapping(CustomerControllerRoutes.RETRIEVE_CUSTOMER_BY_ID)
    public ResponseEntity<?> retrieveCustomerById(@RequestParam Long customerId) throws CustomerNotFoundException {
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @GetMapping(CustomerControllerRoutes.GET_CUSTOMER_FROM_CODE)
    public ResponseEntity<?> getCustomerFromCode(@PathVariable String code) throws VerificationCodeExpiredException {
        Customer customer = customerService.retrieveCustomerByVerificationCode(code);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    // 1. Customer clicks update email --> enters new email --> click send link --> call this API
    @PostMapping(CustomerControllerRoutes.SEND_UPDATE_EMAIL_LINK)
    public ResponseEntity<?> sendUpdateEmailLink(@RequestBody SendUpdateEmailLinkRequest req) throws CustomerNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(req);
        customerService.sendUpdateEmailLink(req.getCustomerId(), req.getEmail());
        Map<String, String> successMessage = new HashMap<>();
        successMessage.put("message", "Please check your email for the link to reset your password");
        return new ResponseEntity<>(successMessage, HttpStatus.OK);
    }

    // 2. Customer checks email --> clicks on link --> call this API --> redirect to success page
    @GetMapping(CustomerControllerRoutes.UPDATE_EMAIL)
    public ResponseEntity<?> updateEmailLinkClicked(@PathVariable String code) throws CustomerNotFoundException, VerificationCodeExpiredException, VerificationCodeNotFoundException {
        Customer customer = customerService.updateEmail(code);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.UPDATE_CUSTOMER)
    public ResponseEntity<?> updateCustomer(@RequestBody UpdateCustomerRequest req) throws CustomerNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(req);
        Customer updatedCustomer = customerService.updateCustomerDetails(req.getCustomerId(), req.getFirstName(), req.getLastName());
        relationshipService.clearCustomerRelationships(updatedCustomer);
        return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.LOGIN)
    public ResponseEntity<?> customerLogin(@RequestBody CustomerLoginRequest customerLoginRequest) throws CustomerNotVerifiedException, InvalidLoginCredentialsException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(customerLoginRequest);
        Customer customer = customerService.customerLogin(customerLoginRequest.getEmail(), customerLoginRequest.getPassword());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.CHANGE_PASSWORD)
    public ResponseEntity<?> changePassword(@RequestBody CustomerChangePasswordRequest customerChangePasswordRequest) throws CustomerNotFoundException, InvalidLoginCredentialsException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(customerChangePasswordRequest);

        customerService.changePassword(customerChangePasswordRequest.getCustomerId(),
                customerChangePasswordRequest.getOldPassword(),
                customerChangePasswordRequest.getNewPassword(),
                customerChangePasswordRequest.getConfirmNewPassword());
        Customer customer = customerService.retrieveCustomerByCustomerId(customerChangePasswordRequest.getCustomerId());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }


    // TODO: Implement below 2 methods with actual email and redirection etc.
    // Client clicks button to reset password --> call this API --> send email
    @PostMapping(CustomerControllerRoutes.SEND_RESET_PASSWORD_LINK)
    public ResponseEntity<?> sendresetPasswordLink(@RequestBody CustomerEmailRequest req) throws CustomerNotFoundException {
        customerService.sendResetPasswordLink(req.getEmail());
        Map<String, String> successMessage = new HashMap<>();
        successMessage.put("message", "Please check your email for the link to reset your password");
        return new ResponseEntity<>(successMessage, HttpStatus.OK);
    }

    // Client enters new password, clicks submit --> call this api
    @PostMapping(CustomerControllerRoutes.RESET_PASSWORD_POST)
    public ResponseEntity<?> resetPassword(@RequestBody CustomerResetPasswordRequest customerResetPasswordRequest) throws CustomerNotFoundException, VerificationCodeExpiredException, VerificationCodeNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(customerResetPasswordRequest);
        customerService.resetPassword(customerResetPasswordRequest.getVerificationCode(),
                customerResetPasswordRequest.getNewPassword(), customerResetPasswordRequest.getConfirmNewPassword());
        Map<String, String> successMessage = new HashMap<>();
        successMessage.put("message", "Please check your email for the link to reset your password");
        return new ResponseEntity<>(successMessage, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.UPDATE_MEASUREMENTS)
    public ResponseEntity<?> updateMeasurements(@RequestBody CustomerUpdateMeasurementsRequest customerUpdateMeasurementsRequest) throws CustomerNotFoundException, InputDataValidationException {
        Customer customer = customerService.updateMeasurements(
                customerUpdateMeasurementsRequest.getCustomerId(),
                customerUpdateMeasurementsRequest.getMeasurements());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.DELETE_MEASUREMENTS)
    public ResponseEntity<?> deleteMeasurements(@PathVariable Long customerId) throws CustomerNotFoundException {
        Customer customer = customerService.deleteMeasurements(customerId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_CREDIT_CARD)
    public ResponseEntity<?> addCreditCard(@RequestBody AddCreditCardRequest addCreditCardRequest) throws CustomerNotFoundException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(addCreditCardRequest);
        if (inputErrMap != null) return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        Customer customer = customerService.addCreditCard(addCreditCardRequest.getCustomerId(), addCreditCardRequest.getCreditCard());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @DeleteMapping(CustomerControllerRoutes.REMOVE_CREDIT_CARD)
    public ResponseEntity<?> removeCreditCard(@RequestBody RemoveCreditCardRequest removeCreditCardRequest) throws CustomerNotFoundException, CreditCardNotFoundException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(removeCreditCardRequest);
        if (inputErrMap != null) return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        Customer customer = customerService.deleteCreditCard(removeCreditCardRequest.getCustomerId(), removeCreditCardRequest.getCreditCardId());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_SHIPPING_ADDRESS_AT_CHECKOUT)
    public ResponseEntity<?> addShippingAddressAtCheckout(@RequestBody AddUpdateShippingAddressRequest addUpdateShippingAddressRequest) throws CustomerNotFoundException, InputDataValidationException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(addUpdateShippingAddressRequest);
        if (inputErrMap != null) return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        Address address = customerService.addShippingAddressAtCheckout(addUpdateShippingAddressRequest.getCustomerId(), addUpdateShippingAddressRequest.getShippingAddress());
        return new ResponseEntity<>(address, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_SHIPPING_ADDRESS)
    public ResponseEntity<?> addShippingAddress(@RequestBody AddUpdateShippingAddressRequest addUpdateShippingAddressRequest) throws CustomerNotFoundException, InputDataValidationException {
        Map<String, String> inputErrMap = validationService.generateErrorMap(addUpdateShippingAddressRequest);
        System.out.println(addUpdateShippingAddressRequest.getShippingAddress().getLat());
        System.out.println(addUpdateShippingAddressRequest.getShippingAddress().getLng());
        if (inputErrMap != null) return new ResponseEntity<>(inputErrMap, HttpStatus.BAD_REQUEST);
        Customer customer = customerService.addShippingAddress(addUpdateShippingAddressRequest.getCustomerId(), addUpdateShippingAddressRequest.getShippingAddress());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.UPDATE_SHIPPING_ADDRESS)
    public ResponseEntity<?> updateShippingAddress(@RequestBody AddUpdateShippingAddressRequest req) throws CustomerNotFoundException, AddressNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(req);
        Customer customer = customerService.updateShippingAddress(req.getCustomerId(), req.getShippingAddress());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @DeleteMapping(CustomerControllerRoutes.REMOVE_SHIPPING_ADDRESS)
    public ResponseEntity<?> removeShippingAddress(@PathVariable Long customerId, @PathVariable Long shippingAddressId) throws CustomerNotFoundException, AddressNotFoundException, InputDataValidationException {
//        validationService.throwExceptionIfInvalidBean(req);
//        Customer customer = customerService.deleteShippingAddress(req.getCustomerId(), req.getShippingAddressId());
        Customer customer = customerService.deleteShippingAddress(customerId, shippingAddressId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_TO_WISHLIST)
    public ResponseEntity<?> addToWishlist(@RequestParam Long customerId, @RequestParam Long productVariantId) throws CustomerNotFoundException, ProductVariantNotFoundException, WishlistException {
        Customer customer = customerService.addProductToWishlist(customerId, productVariantId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.REMOVE_FROM_WISHLIST)
    public ResponseEntity<?> removeFromWishlist(@RequestParam Long customerId, @RequestParam Long productVariantId) throws ProductVariantNotFoundException, CustomerNotFoundException {
        Customer customer = customerService.removeProductFromWishlist(customerId, productVariantId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.CLEAR_WISHLIST)
    public ResponseEntity<?> clearWishlist(@RequestParam Long customerId) throws CustomerNotFoundException {
        Customer customer = customerService.clearWishList(customerId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }


    @DeleteMapping(CustomerControllerRoutes.DELETE_CUSTOMER)
    public ResponseEntity<?> deleteCustomer(@PathVariable Long customerId) throws CustomerCannotDeleteException, CustomerNotFoundException {
        Customer deletedCustomer = customerService.removeCustomer(customerId);
        relationshipService.clearCustomerRelationships(deletedCustomer);
        return new ResponseEntity<>(deletedCustomer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_STYLE)
    public ResponseEntity<?> addStyle(@RequestBody AddStyleRequest req) throws CustomerNotFoundException, StyleNotFoundException {
        Customer customer = customerService.addStyle(req.getCustomerId(), req.getStylePreference(), req.getStyleId(), req.getGender());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.REMOVE_STYLE)
    public ResponseEntity<?> removeStyle(@RequestBody RemoveStyleRequest req) throws CustomerNotFoundException, StyleNotFoundException {
        Customer customer = customerService.removeStyle(req.getCustomerId(), req.getStyleChosen());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.UPDATE_SHOPPING_CART)
    public ResponseEntity<?> updateShoppingCart(@RequestBody UpdateShoppingCartRequest updateShoppingCartRequest) throws InputDataValidationException, ProductVariantNotFoundException, InvalidCartTypeException, CustomerNotFoundException, InsufficientStockException {
        validationService.throwExceptionIfInvalidBean(updateShoppingCartRequest);
        Customer customer = shoppingCartService.updateQuantityOfProductVariant(
                updateShoppingCartRequest.getQuantity(),
                updateShoppingCartRequest.getProductVariantId(),
                updateShoppingCartRequest.getCustomerId(),
                updateShoppingCartRequest.getCartType()
        );
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.UPDATE_IN_STORE_SHOPPING_CART)
    public ResponseEntity<?> updateInStoreShoppingCart(@RequestBody UpdateInStoreShoppingCartRequest req) throws InputDataValidationException, InvalidCartTypeException, ProductVariantNotFoundException, CustomerNotFoundException, StoreNotFoundException, InsufficientStockException {
        validationService.throwExceptionIfInvalidBean(req);
        Customer customer = shoppingCartService.updateQuantityOfProductVariantWithStore(
                req.getQuantity(),
                req.getProductVariantId(),
                req.getCustomerId(),
                req.getStoreId());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.CLEAR_SHOPPING_CART)
    public ResponseEntity<?> clearShoppingCart(@RequestParam Long customerId, @RequestParam String cartType) throws CustomerNotFoundException, InvalidCartTypeException {
        Customer customer = shoppingCartService.clearShoppingCart(customerId, cartType);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @GetMapping(CustomerControllerRoutes.GET_SHOPPING_CART_ITEMS_STOCK)
    public ResponseEntity<?> getShoppingCartItemsStock(@RequestParam Long customerId, @RequestParam String cartType,
                                                       @RequestParam(required = false) Boolean inStoreDeliverHome) throws CustomerNotFoundException, InvalidCartTypeException {
        Map<Long, Map<String, Object>>  result = shoppingCartService.getShoppingCartItemsStock(customerId, cartType, inStoreDeliverHome);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_WISHLIST_TO_SHOPPING_CART)
    public ResponseEntity<?> addWishlistToShoppingCart(@RequestParam Long customerId) throws InvalidCartTypeException, ProductVariantNotFoundException, CustomerNotFoundException, InsufficientStockException {
        Customer customer = customerService.addWishlistToShoppingCart(customerId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.ADD_TO_RESERVATION_CART)
    public ResponseEntity<?> addtoReservationCart(@RequestParam Long customerId, @RequestParam Long productVariantId) throws CustomerNotFoundException, ProductVariantNotFoundException {
        Customer customer = customerService.addProductToReservationCart(customerId, productVariantId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.REMOVE_FROM_RESERVATION_CART)
    public ResponseEntity<?> removeFromReservationCart(@RequestParam Long customerId, @RequestParam Long productVariantId) throws ProductVariantNotFoundException, CustomerNotFoundException {
        Customer customer = customerService.removeProductFromReservationCart(customerId, productVariantId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.CLEAR_RESERVATION_CART)
    public ResponseEntity<?> clearReservationCart(@RequestParam Long customerId) throws CustomerNotFoundException {
        Customer customer = customerService.clearReservationCart(customerId);
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.REGISTER_PUSH_NOTIFICATION_TOKEN)
    public ResponseEntity<?> registerPushNotifToken(@RequestBody RegisterPushNotifTokenRequest req) throws CustomerNotFoundException {
        Customer customer = customerService.registerPushNotificationToken(req.getCustomerId(), req.getToken());
        relationshipService.clearCustomerRelationships(customer);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

}
