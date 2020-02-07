package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @author shawn
 */

@Service
@Transactional
public class CustomerService {

    private final ValidationService validationService;

    private final CustomerRepository customerRepository;
    private final ReviewRepository reviewRepository;
    private final OnlineShoppingCartItemRepository onlineShoppingCartItemRepository;
    private final OnlineShoppingCartRepository onlineShoppingCartRepository;
    private final InStoreShoppingCartRepository inStoreShoppingCartRepository;
    private final InStoreShoppingCartItemRepository inStoreShoppingCartItemRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final MeasurementsRepository measurementsRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public CustomerService(ValidationService validationService, CustomerRepository customerRepository, ReviewRepository reviewRepository, OnlineShoppingCartItemRepository onlineShoppingCartItemRepository, OnlineShoppingCartRepository onlineShoppingCartRepository, InStoreShoppingCartRepository inStoreShoppingCartRepository, InStoreShoppingCartItemRepository inStoreShoppingCartItemRepository, VerificationCodeRepository verificationCodeRepository, MeasurementsRepository measurementsRepository) {
        this.validationService = validationService;
        this.customerRepository = customerRepository;
        this.reviewRepository = reviewRepository;
        this.onlineShoppingCartItemRepository = onlineShoppingCartItemRepository;
        this.onlineShoppingCartRepository = onlineShoppingCartRepository;
        this.inStoreShoppingCartRepository = inStoreShoppingCartRepository;
        this.inStoreShoppingCartItemRepository = inStoreShoppingCartItemRepository;
        this.verificationCodeRepository = verificationCodeRepository;
        this.measurementsRepository = measurementsRepository;
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

                customerRepository.save(customer);
                return customer;
            } catch (Exception ex) {
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

        return customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with id: " + customerId + " does not exist"));
    }

    public Customer retrieveCustomerByEmail(String email) throws CustomerNotFoundException {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new CustomerNotFoundException("Customer email " + email + "does not exist!"));

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

    public String requestVerificationCode(Long customerId) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);

        String code = RandomStringUtils.randomAlphanumeric(6);

        long now = System.currentTimeMillis();

        long nowPlus1Hour = now + TimeUnit.HOURS.toMillis(1);

        VerificationCode verificationCode = new VerificationCode(code, new Timestamp(nowPlus1Hour));

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

    //TODO: Update credit cards

    //TODO: Update shipping addresses


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
        OnlineShoppingCart onlineShoppingCart = customer.getOnlineShoppingCart();
        if (onlineShoppingCart != null) {
            for (OnlineShoppingCartItem osci : onlineShoppingCart.getOnlineShoppingCartItems()) {
                osci.setProductVariant(null);
                onlineShoppingCart.getOnlineShoppingCartItems().remove(osci);
                onlineShoppingCartItemRepository.delete(osci);
            }
            onlineShoppingCart.setOnlineShoppingCartItems(null);
            onlineShoppingCart.setCustomer(null);
            onlineShoppingCartRepository.delete(onlineShoppingCart);
        }

        InStoreShoppingCart inStoreShoppingCart = customer.getInStoreShoppingCart();
        if (inStoreShoppingCart != null) {
            for (InStoreShoppingCartItem item : inStoreShoppingCart.getInStoreShoppingCartItems()) {
                item.setProductVariant(null);
                inStoreShoppingCart.getInStoreShoppingCartItems().remove(item);
                inStoreShoppingCartItemRepository.delete(item);
            }
            inStoreShoppingCart.setInStoreShoppingCartItems(null);
            inStoreShoppingCart.setCustomer(null);
            inStoreShoppingCartRepository.delete(inStoreShoppingCart);
        }
        //----------------------------------------

        customer.setWishlistItems(null);

        customer.setReservationCartItems(null);

        customerRepository.delete(customer);

        return customer;
    }
}

