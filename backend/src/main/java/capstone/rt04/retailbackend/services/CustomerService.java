package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @author shawn
 */

@Service
@Transactional
public class CustomerService {

    private final ValidationService validationService;
    private final ShoppingCartService shoppingCartService;
    private final ProductService productService;

    private final CustomerRepository customerRepository;
    private final ReviewRepository reviewRepository;
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final MeasurementsRepository measurementsRepository;
    private final CreditCardRepository creditCardRepository;
    private final AddressRepository addressRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public CustomerService(ValidationService validationService, ShoppingCartService shoppingCartService, ProductService productService, CustomerRepository customerRepository, ReviewRepository reviewRepository, ShoppingCartItemRepository shoppingCartItemRepository, ShoppingCartRepository shoppingCartRepository, VerificationCodeRepository verificationCodeRepository, MeasurementsRepository measurementsRepository, CreditCardRepository creditCardRepository, AddressRepository addressRepository) {
        this.validationService = validationService;
        this.shoppingCartService = shoppingCartService;
        this.productService = productService;
        this.customerRepository = customerRepository;
        this.reviewRepository = reviewRepository;
        this.shoppingCartItemRepository = shoppingCartItemRepository;
        this.shoppingCartRepository = shoppingCartRepository;
        this.verificationCodeRepository = verificationCodeRepository;
        this.measurementsRepository = measurementsRepository;
        this.creditCardRepository = creditCardRepository;
        this.addressRepository = addressRepository;
    }

    public Customer createNewCustomer(Customer customer) throws InputDataValidationException, CreateNewCustomerException {
        Map<String, String> errorMap = validationService.generateErrorMap(customer);

        if (errorMap == null) {//no errors
            try {
                //check email is new
                Customer existingCustomer = null;
                try {
                    existingCustomer = retrieveCustomerByEmail(customer.getEmail());
                } catch (CustomerNotFoundException ex) {
                }
                if (existingCustomer != null) {
                    errorMap = new HashMap<>();
                    errorMap.put("email", "This email is already taken!");
                    throw new InputDataValidationException(errorMap, "Email already taken");
                }

                customer.setPassword(encoder.encode(customer.getPassword()));
                Customer savedCustomer = customerRepository.save(customer);
                shoppingCartService.initializeShoppingCarts(savedCustomer.getCustomerId());
                generateVerificationCode(savedCustomer.getCustomerId());
                //TODO: Send verification email
                return customer;
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
                throw new CreateNewCustomerException("Error creating new customer");
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Customer");
        }
    }

    public Customer retrieveCustomerByCustomerId(Long customerId) throws CustomerNotFoundException {
        if (customerId == null) {
            throw new CustomerNotFoundException("Customer ID not provided");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with id: " + customerId + " does not exist"));
        return lazyLoadCustomerFields(customer);
    }

    public Customer retrieveCustomerByEmail(String email) throws CustomerNotFoundException {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new CustomerNotFoundException("Customer email " + email + "does not exist!"));

        return lazyLoadCustomerFields(customer);
    }

    public Customer updateEmail(Long customerId, String newEmail) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        customer.setEmail(newEmail);
        // TODO: Send verification email
        return customer;
    }

    public Customer customerLogin(String email, String password) throws InvalidLoginCredentialsException {
        try {
            Customer customer = retrieveCustomerByEmail(email);
            if (encoder.matches(password, customer.getPassword())) {
                return customer;
            } else {
                throw new InvalidLoginCredentialsException("Email or password is invalid!");
            }

        } catch (CustomerNotFoundException ex) {
            throw new InvalidLoginCredentialsException("Email or password is invalid!");
        }
    }

    public void changePassword(Long customerId, String oldPassword, String newPassword) throws CustomerNotFoundException, InvalidLoginCredentialsException {
        Customer customer = retrieveCustomerByCustomerId(customerId);

        if (encoder.matches(oldPassword, customer.getPassword())) {
            customer.setPassword(encoder.encode(newPassword));
        } else {
            throw new InvalidLoginCredentialsException("The old password is incorrect!");
        }
    }

    public Customer verify(String code) throws VerificationCodeInvalidException {
        VerificationCode verificationCode = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> new VerificationCodeInvalidException("Invalid verification code"));

        verificationCode.getCustomer().setVerified(true);
        return verificationCode.getCustomer();
    }

    public String generateVerificationCode(Long customerId) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        VerificationCode currentCode = customer.getVerificationCode();
        if (currentCode != null) {
            currentCode.setCustomer(null);
            customer.setVerificationCode(null);
            verificationCodeRepository.delete(currentCode);
        }

        String code = RandomStringUtils.randomAlphanumeric(32);
        VerificationCode existingCode = verificationCodeRepository.findByCode(code).orElse(null);
        while (existingCode != null) {
            code = RandomStringUtils.randomAlphanumeric(32);
            existingCode = verificationCodeRepository.findByCode(code).orElse(null);
        }

        long now = System.currentTimeMillis();
        long nowPlus1Hour = now + TimeUnit.HOURS.toMillis(1);

        VerificationCode verificationCode = new VerificationCode(code, new Timestamp(nowPlus1Hour), customer);
        verificationCodeRepository.save(verificationCode);
        customer.setVerificationCode(verificationCode);

        //TODO: Send email

        return code;
    }

    public void resetPassword(Long customerId, String code, String newPassword) throws CustomerNotFoundException, VerificationCodeInvalidException {
        Customer customer = retrieveCustomerByCustomerId(customerId);

        if (code.equals(customer.getVerificationCode().getCode())) {
            if (customer.getVerificationCode().getExpiryDateTime().before(new Timestamp(System.currentTimeMillis()))) {
                throw new VerificationCodeInvalidException("Verification code has expired! Please request for a new one");
            }
            customer.setPassword(encoder.encode(newPassword));
        } else {
            throw new VerificationCodeInvalidException("Incorrect verification code entered");
        }
    }

    public Measurements updateMeasurements(Long customerId, Measurements measurements) throws InputDataValidationException, CustomerNotFoundException {
        Map<String, String> errorMap = validationService.generateErrorMap(measurements);
        if (errorMap == null) {
            Customer customer = retrieveCustomerByCustomerId(customerId);
            Measurements currentMeasurements = customer.getMeasurements();
            if (currentMeasurements != null) {
                customer.setMeasurements(null);
                measurementsRepository.delete(currentMeasurements);
            }
            customer.setMeasurements(measurements);
            measurementsRepository.save(measurements);
            return measurements;
        } else {
            throw new InputDataValidationException(errorMap, "Invalid measurements");
        }
    }

    public Customer addCreditCard(Long customerId, CreditCard creditCard) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        creditCardRepository.save(creditCard);
        customer.addCreditCard(creditCard);
        return customer;
    }

    public CreditCard getCreditCard(Long customerId, Long creditCardId) throws CustomerNotFoundException, CreditCardNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        for (CreditCard c : customer.getCreditCards()) {
            if (c.getCreditCardId().equals(creditCardId)) {
                return c;
            }
        }
        throw new CreditCardNotFoundException("Credit card with id: " + creditCardId + " does not exist;");
    }

    public Customer deleteCreditCard(Long customerId, Long creditCardId) throws CustomerNotFoundException, CreditCardNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        CreditCard creditCardToRemove = getCreditCard(customerId, creditCardId);

        customer.getCreditCards().remove(creditCardToRemove);
        creditCardRepository.delete(creditCardToRemove);
        return customer;
    }

    public Customer addShippingAddress(Long customerId, Address shippingAddress) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        addressRepository.save(shippingAddress);
        customer.addShippingAddress(shippingAddress);
        return customer;
    }

    public Address getShippingAddress(Long customerId, Long addressId) throws CustomerNotFoundException, AddressNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        for (Address address : customer.getShippingAddresses()) {
            if (address.getAddressId().equals(addressId)) {
                return address;
            }
        }
        throw new AddressNotFoundException("Address id: " + addressId + " not found for customer id: " + customerId);
    }

    public Address updateShippingAddress(Long customerId, Address newShippingAddress) throws CustomerNotFoundException, AddressNotFoundException {
        Address addressToUpdate = getShippingAddress(customerId, newShippingAddress.getAddressId());
        addressToUpdate.setBuildingName(newShippingAddress.getBuildingName());
        addressToUpdate.setDefault(newShippingAddress.isDefault());
        addressToUpdate.setLine1(newShippingAddress.getLine1());
        addressToUpdate.setLine2(newShippingAddress.getLine2());
        addressToUpdate.setPostalCode(newShippingAddress.getPostalCode());
        addressToUpdate.setXCoordinate(newShippingAddress.getXCoordinate());
        addressToUpdate.setYCoordinate(newShippingAddress.getYCoordinate());
        return addressToUpdate;
    }

    public Customer deleteShippingAddress(Long customerId, Long shippingAddressId) throws CustomerNotFoundException, AddressNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        Address shippingAddressToRemove = getShippingAddress(customerId, shippingAddressId);

        customer.getShippingAddresses().remove(shippingAddressToRemove);
        addressRepository.delete(shippingAddressToRemove);
        return customer;
    }

    public Customer addProductToWishlist(Long customerId, Long productVariantId) throws CustomerNotFoundException, ProductVariantNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        customer.getWishlistItems().add(productVariant);
        return customer;
    }

    public Customer removeProductFromWishlist(Long customerId, Long productVariantId) throws ProductVariantNotFoundException, CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        customer.getWishlistItems().remove(productVariant);
        return customer;
    }

    public Customer clearWishList(Long customerId) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        customer.setWishlistItems(new ArrayList<>());
        return customer;
    }

    //method used just for test case removal
    public Customer removeCustomer(Long customerId) throws CustomerNotFoundException, CustomerCannotDeleteException {
        Customer customer = retrieveCustomerByCustomerId(customerId);

        if ((customer.getTransactions() != null && customer.getTransactions().size() > 0)
                || (customer.getRefunds() != null && customer.getRefunds().size() > 0)
                || (customer.getReservations() != null && customer.getReservations().size() > 0)) {
            throw new CustomerCannotDeleteException("Customer cannot be deleted due to existing associations "
                    + "(transactions/refund/reservations) with the store");
        }

        customer.setUsedPromoCodes(null);

        /* cascade remove for:
            1. measurements
            2. verificationCode
            3. creditCards
            4. shippingAddresses
         */

        // Clear relationship with reviews, and delete reviews
        for (Review r : customer.getReviews()) {
            r.getProduct().getReviews().remove(r);
            r.setProduct(null);
            r.getStaff().getRepliedReviews().remove(r);
            r.setStaff(null);
            reviewRepository.delete(r);
        }
        customer.setReviews(null);
        // ----------------------------------------------------

        // Clear relationship with both shopping carts
        List<ShoppingCart> shoppingCarts = new ArrayList<>();
        shoppingCarts.add(customer.getInStoreShoppingCart());
        shoppingCarts.add(customer.getOnlineShoppingCart());
        customer.setOnlineShoppingCart(null);
        customer.setInStoreShoppingCart(null);
        for (ShoppingCart shoppingCart : shoppingCarts) {
            if (shoppingCart != null) {
                List<ShoppingCartItem> shoppingCartItems = shoppingCart.getShoppingCartItems();
                shoppingCart.setShoppingCartItems(null);
                for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
                    shoppingCartItem.setProductVariant(null);
                    shoppingCartItemRepository.delete(shoppingCartItem);
                }
                shoppingCart.setShoppingCartItems(null);
                shoppingCartRepository.delete(shoppingCart);
            }
        }

        //----------------------------------------

        customer.setWishlistItems(null);

        customer.setReservationCartItems(null);

        customerRepository.delete(customer);

        return customer;
    }

    public Customer lazyLoadCustomerFields(Customer customer){
        customer.getCreditCards().size();
        customer.getShippingAddresses().size();
        customer.getMeasurements();
        customer.getWishlistItems().size();
        customer.getReservations().size();
        customer.getRefunds().size();
        customer.getTransactions().size();
        customer.getUsedPromoCodes().size();
        customer.getReviews().size();
        return customer;
    }
}

