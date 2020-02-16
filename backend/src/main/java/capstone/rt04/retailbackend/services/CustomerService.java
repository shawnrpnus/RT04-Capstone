package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static capstone.rt04.retailbackend.util.Constants.ONLINE_SHOPPING_CART;

/**
 * @author shawn
 */

@Service
@Transactional
public class CustomerService {

    private JavaMailSender javaMailSender;

    private final Environment environment;

    private final ValidationService validationService;
    private final ShoppingCartService shoppingCartService;
    private final ProductService productService;
    private final StyleService styleService;

    private final CustomerRepository customerRepository;
    private final ReviewRepository reviewRepository;
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final MeasurementsRepository measurementsRepository;
    private final CreditCardRepository creditCardRepository;
    private final AddressRepository addressRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public CustomerService(JavaMailSender javaMailSender, ValidationService validationService, ShoppingCartService shoppingCartService, ProductService productService, CustomerRepository customerRepository, ReviewRepository reviewRepository, ShoppingCartItemRepository shoppingCartItemRepository, ShoppingCartRepository shoppingCartRepository, VerificationCodeRepository verificationCodeRepository, MeasurementsRepository measurementsRepository, CreditCardRepository creditCardRepository, AddressRepository addressRepository, Environment environment, StyleService styleService) {
        this.javaMailSender = javaMailSender;
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
        this.environment = environment;
        this.styleService = styleService;
    }

    public Customer createNewCustomer(Customer customer) throws InputDataValidationException, CreateNewCustomerException {
        validationService.throwExceptionIfInvalidBean(customer);
        try {
            //check email is new
            Customer existingCustomer = null;
            try {
                existingCustomer = retrieveCustomerByEmail(customer.getEmail());
            } catch (CustomerNotFoundException ex) {
            }
            if (existingCustomer != null) {
                Map<String, String> errorMap = new HashMap<>();
                errorMap.put("email", ErrorMessages.EMAIL_TAKEN);
                throw new InputDataValidationException(errorMap, ErrorMessages.EMAIL_TAKEN);
            }

            customer.setPassword(encoder.encode(customer.getPassword()));
            Customer savedCustomer = customerRepository.save(customer);
            shoppingCartService.initializeShoppingCarts(savedCustomer.getCustomerId());
            VerificationCode vCode = generateVerificationCode(savedCustomer.getCustomerId());
            if (Arrays.asList(environment.getActiveProfiles()).contains("dev")) {
                sendEmailVerificationLink(vCode.getCode(), "shawnroshan@gmail.com"); //TODO: to change to actual email
            }
            return lazyLoadCustomerFields(customer);
        } catch (PersistenceException | CustomerNotFoundException ex) {
            System.out.println(ex.getMessage());
            throw new CreateNewCustomerException("Error creating new customer");
        }

    }

    //for when customer signs up initially, email sent in create customer
    public Customer verify(String code) throws VerificationCodeInvalidException {
        VerificationCode verificationCode = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> new VerificationCodeInvalidException(ErrorMessages.VERIFICATION_CODE_INVALID));
        if (verificationCode.getExpiryDateTime().before(new Timestamp(System.currentTimeMillis()))) {
            throw new VerificationCodeInvalidException(ErrorMessages.VERIFICATION_CODE_EXPIRED);
        }
        verificationCode.getCustomer().setVerified(true);
        return lazyLoadCustomerFields(verificationCode.getCustomer());
    }

    public Customer retrieveCustomerByCustomerId(Long customerId) throws CustomerNotFoundException {
//        if (customerId == null) {
//            throw new CustomerNotFoundException("Customer ID not provided");
//        }
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with id: " + customerId + " does not exist"));
        return lazyLoadCustomerFields(customer);
    }

    public Customer retrieveCustomerByEmail(String email) throws CustomerNotFoundException {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new CustomerNotFoundException("Customer email: " + email + "does not exist!"));

        return lazyLoadCustomerFields(customer);
    }

    public Customer retrieveCustomerByVerificationCode(String code) throws VerificationCodeInvalidException {
        VerificationCode verificationCode = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> new VerificationCodeInvalidException(ErrorMessages.VERIFICATION_CODE_INVALID));
        return lazyLoadCustomerFields(verificationCode.getCustomer());
    }

    /*
        Process: login > update email > put in new email >
        system send new email with verification link > click link > new email updated
     */
    // TODO: Update with actual link
    public void sendUpdateEmailLink(Long customerId, String newEmail) throws CustomerNotFoundException {
        VerificationCode vCode = generateVerificationCode(customerId);
        Customer customer = retrieveCustomerByCustomerId(customerId);
        customer.setRequestedNewEmail(newEmail);
        if (Arrays.asList(environment.getActiveProfiles()).contains("dev")) {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(newEmail);
            msg.setSubject("Click to update your email");
            msg.setText("http://localhost:8080/api/customer/updateEmail/" + vCode.getCode());
            javaMailSender.send(msg);
        }
    }

    public Customer updateEmail(String code) throws CustomerNotFoundException, VerificationCodeInvalidException {
        VerificationCode verificationCode = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> new VerificationCodeInvalidException(ErrorMessages.VERIFICATION_CODE_INVALID));
        if (verificationCode.getExpiryDateTime().before(new Timestamp(System.currentTimeMillis()))) {
            throw new VerificationCodeInvalidException(ErrorMessages.VERIFICATION_CODE_EXPIRED);
        }
        Customer customer = verificationCode.getCustomer();
        customer.setEmail(customer.getRequestedNewEmail());
        customer.setRequestedNewEmail(null);
        return lazyLoadCustomerFields(customer);
    }

    public Customer updateCustomerDetails(Customer customer) throws CustomerNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(customer);
        Customer customerToUpdate = retrieveCustomerByCustomerId(customer.getCustomerId());
        customerToUpdate.setFirstName(customer.getFirstName());
        customerToUpdate.setLastName(customer.getLastName());
        return lazyLoadCustomerFields(customerToUpdate);
    }

    public Customer customerLogin(String email, String password) throws InvalidLoginCredentialsException, CustomerNotVerifiedException {
        try {
            Customer customer = retrieveCustomerByEmail(email);
            if (encoder.matches(password, customer.getPassword())) {
                if (!customer.isVerified()) {
                    throw new CustomerNotVerifiedException(ErrorMessages.CUSTOMER_NOT_VERIFIED);
                }
                return lazyLoadCustomerFields(customer);
            } else {
                throw new InvalidLoginCredentialsException(ErrorMessages.LOGIN_FAILED);
            }

        } catch (CustomerNotFoundException ex) {
            throw new InvalidLoginCredentialsException(ErrorMessages.LOGIN_FAILED);
        }
    }

    public void changePassword(Long customerId, String oldPassword, String newPassword) throws CustomerNotFoundException, InvalidLoginCredentialsException {
        Customer customer = retrieveCustomerByCustomerId(customerId);

        if (encoder.matches(oldPassword, customer.getPassword())) {
            customer.setPassword(encoder.encode(newPassword));
        } else {
            throw new InvalidLoginCredentialsException(ErrorMessages.OLD_PASSWORD_INCORRECT);
        }
    }

    public VerificationCode generateVerificationCode(Long customerId) throws CustomerNotFoundException {
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

        return verificationCode;
    }

    // TODO: Update with actual link
    private void sendEmailVerificationLink(String code, String email) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Activate your account");
        msg.setText("http://localhost:8080/api/customer/verify/" + code);
        javaMailSender.send(msg);
    }

    //customer click forget password --> send email to customer's email
    //give link /api/customer/resetpassword/948273h1fadnenfjns
    //customer inputs new password at that link
    //on front-end, make api call by extracting the code from the link
    public void resetPassword(Long customerId, String code, String newPassword) throws CustomerNotFoundException, VerificationCodeInvalidException {
        Customer customer = retrieveCustomerByCustomerId(customerId);

        if (code.equals(customer.getVerificationCode().getCode())) {
            if (customer.getVerificationCode().getExpiryDateTime().before(new Timestamp(System.currentTimeMillis()))) {
                throw new VerificationCodeInvalidException(ErrorMessages.VERIFICATION_CODE_EXPIRED);
            }
            customer.setPassword(encoder.encode(newPassword));
        } else {
            throw new VerificationCodeInvalidException(ErrorMessages.VERIFICATION_CODE_INVALID);
        }
    }

    // TODO: Update with actual link
    public void sendResetPasswordLink(Long customerId) throws CustomerNotFoundException {
        VerificationCode vCode = generateVerificationCode(customerId);
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(vCode.getCustomer().getEmail());
        msg.setSubject("Reset your password");
        msg.setText("http://localhost:8080/api/customer/resetPassword/" + vCode.getCode());
        javaMailSender.send(msg);
    }

    public Customer updateMeasurements(Long customerId, Measurements measurements) throws InputDataValidationException, CustomerNotFoundException {
        validationService.throwExceptionIfInvalidBean(measurements);
        Customer customer = retrieveCustomerByCustomerId(customerId);
        Measurements currentMeasurements = customer.getMeasurements();
        if (currentMeasurements != null) {
            customer.setMeasurements(null);
            measurementsRepository.delete(currentMeasurements);
        }
        customer.setMeasurements(measurements);
        measurementsRepository.save(measurements);
        return lazyLoadCustomerFields(customer);
    }

    public Customer deleteMeasurements(Long customerId) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        Measurements m = customer.getMeasurements();
        customer.setMeasurements(null);
        measurementsRepository.delete(m);
        return customer;
    }

    public Customer addCreditCard(Long customerId, CreditCard creditCard) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        creditCardRepository.save(creditCard);
        customer.addCreditCard(creditCard);
        return lazyLoadCustomerFields(customer);
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
        return lazyLoadCustomerFields(customer);
    }


    public Customer addShippingAddress(Long customerId, Address shippingAddress) throws CustomerNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(shippingAddress);
        Customer customer = retrieveCustomerByCustomerId(customerId);
        addressRepository.save(shippingAddress);
        if (shippingAddress.isDefault()) {
            customer = setOtherAddressesToNonDefault(customerId);
        }
        if (shippingAddress.isBilling()) {
            customer = setOtherAddressesToNonBilling(customerId);
        }
        customer.addShippingAddress(shippingAddress);
        return lazyLoadCustomerFields(customer);
    }

    private Customer setOtherAddressesToNonDefault(Long customerId) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        for (Address addr : customer.getShippingAddresses()) {
            addr.setDefault(false);
        }
        return customer;
    }

    private Customer setOtherAddressesToNonBilling(Long customerId) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        for (Address addr : customer.getShippingAddresses()) {
            addr.setBilling(false);
        }
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

    public Address updateShippingAddress(Long customerId, Address newShippingAddress) throws CustomerNotFoundException, AddressNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(newShippingAddress);
        Address addressToUpdate = getShippingAddress(customerId, newShippingAddress.getAddressId());
        addressToUpdate.setBuildingName(newShippingAddress.getBuildingName());

        if (newShippingAddress.isDefault()) {
            setOtherAddressesToNonDefault(customerId);
        }
        addressToUpdate.setDefault(newShippingAddress.isDefault());

        if (newShippingAddress.isBilling()) {
            setOtherAddressesToNonBilling(customerId);
        }
        addressToUpdate.setBilling(newShippingAddress.isBilling());
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

        return lazyLoadCustomerFields(customer);
    }

    public Customer addProductToWishlist(Long customerId, Long productVariantId) throws CustomerNotFoundException, ProductVariantNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        customer.getWishlistItems().add(productVariant);
        return lazyLoadCustomerFields(customer);
    }

    public Customer removeProductFromWishlist(Long customerId, Long productVariantId) throws ProductVariantNotFoundException, CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        customer.getWishlistItems().remove(productVariant);
        return lazyLoadCustomerFields(customer);
    }

    public Customer clearWishList(Long customerId) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        customer.setWishlistItems(new ArrayList<>());
        return lazyLoadCustomerFields(customer);
    }

    // ONLINE CART ONLY
    public Customer addWishlistToShoppingCart(Long customerId) throws CustomerNotFoundException, InvalidCartTypeException, ProductVariantNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        for (ProductVariant pv : customer.getWishlistItems()){
            shoppingCartService.updateQuantityOfProductVariant(1, pv.getProductVariantId(), customerId, ONLINE_SHOPPING_CART);
        }
        customer = retrieveCustomerByCustomerId(customerId);
        return customer;
    }

    public Customer addStyle(Long customerId, Long styleId) throws CustomerNotFoundException, StyleNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        Style style = styleService.retrieveStyleByStyleId(styleId);
        if (!customer.getPreferredStyles().contains(style)) {
            customer.getPreferredStyles().add(style);
            style.getCustomers().add(customer);
        }
        return lazyLoadCustomerFields(customer);
    }

    public Customer removeStyle(Long customerId, Long styleId) throws CustomerNotFoundException, StyleNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        Style style = styleService.retrieveStyleByStyleId(styleId);
        customer.getPreferredStyles().remove(style);
        style.getCustomers().remove(customer);
        return lazyLoadCustomerFields(customer);
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

        //clear relationships with styles
        List<Style> styles = customer.getPreferredStyles();
        customer.setPreferredStyles(null);
        for (Style style : styles) {
            style.getCustomers().remove(customer);
        }

        customer.setWishlistItems(null);

        customer.setReservationCartItems(null);

        customerRepository.delete(customer);

        return customer;
    }

    public Customer lazyLoadCustomerFields(Customer customer) {
        customer.getCreditCards().size();
        customer.getShippingAddresses().size();
        customer.getMeasurements();
        customer.getWishlistItems().size();
        customer.getReservations().size();
        customer.getRefunds().size();
        customer.getTransactions().size();
        customer.getUsedPromoCodes().size();
        customer.getReviews().size();
        customer.getVerificationCode();
        customer.getPreferredStyles().size();
        if (customer.getOnlineShoppingCart() != null) {
            customer.getOnlineShoppingCart().getShoppingCartItems().size();
            for (ShoppingCartItem sci : customer.getOnlineShoppingCart().getShoppingCartItems()) {
                sci.getProductVariant().getProduct();
            }
        }
        if (customer.getInStoreShoppingCart() != null) {
            customer.getInStoreShoppingCart().getShoppingCartItems().size();
            for (ShoppingCartItem sci : customer.getInStoreShoppingCart().getShoppingCartItems()) {
                sci.getProductVariant().getProduct();
            }
        }

        return customer;
    }


}

