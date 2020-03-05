package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.util.Constants;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import com.stripe.exception.StripeException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import javax.persistence.PersistenceException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static capstone.rt04.retailbackend.util.Constants.ONLINE_SHOPPING_CART;

/**
 * @author shawn
 */

@Service
@Transactional
@Slf4j
public class CustomerService {

    private JavaMailSender javaMailSender;
    private RestTemplate restTemplate;

    private final Environment environment;

    private final ValidationService validationService;
    private final ShoppingCartService shoppingCartService;
    private final ProductService productService;
    private final StyleService styleService;
    private final StripeService stripeService;

    private final CustomerRepository customerRepository;
    private final ReviewRepository reviewRepository;
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final MeasurementsRepository measurementsRepository;
    private final CreditCardRepository creditCardRepository;
    private final AddressRepository addressRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public CustomerService(JavaMailSender javaMailSender, RestTemplateBuilder builder, ValidationService validationService, ShoppingCartService shoppingCartService, ProductService productService, CustomerRepository customerRepository, ReviewRepository reviewRepository, ShoppingCartItemRepository shoppingCartItemRepository, ShoppingCartRepository shoppingCartRepository, VerificationCodeRepository verificationCodeRepository, MeasurementsRepository measurementsRepository, CreditCardRepository creditCardRepository, AddressRepository addressRepository, Environment environment, StyleService styleService, StripeService stripeService) {
        this.javaMailSender = javaMailSender;
        this.restTemplate = builder.build();
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
        this.stripeService = stripeService;
    }

    public Customer createNewCustomer(Customer customer) throws InputDataValidationException, CreateNewCustomerException, StripeException {
        validationService.throwExceptionIfInvalidBean(customer);
        try {
            //check email is new
            throwExceptionIfExistingCustomerHasEmail(customer.getEmail());

            customer.setPassword(encoder.encode(customer.getPassword()));
            Customer savedCustomer = customerRepository.save(customer);
            shoppingCartService.initializeShoppingCarts(savedCustomer.getCustomerId());
            stripeService.createStripeCustomer(savedCustomer.getCustomerId());
            VerificationCode vCode = generateVerificationCode(savedCustomer.getCustomerId());
            if (Arrays.asList(environment.getActiveProfiles()).contains("dev")) {
                nodeSendEmailVerificationLink("/account/verify/", vCode.getCode(), savedCustomer.getEmail(), savedCustomer.getFirstName(), savedCustomer.getLastName());
            }
            return lazyLoadCustomerFields(customer);
        } catch (PersistenceException | CustomerNotFoundException ex) {
            throw new CreateNewCustomerException("Error creating new customer");
        }

    }

    //for when customer signs up initially, email sent in create customer
    public Customer verify(String code) throws VerificationCodeExpiredException, VerificationCodeNotFoundException, AlreadyVerifiedException {
        VerificationCode verificationCode = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> new VerificationCodeNotFoundException(ErrorMessages.VERIFICATION_CODE_INVALID));
        if (verificationCode.getCustomer().isVerified()) {
            throw new AlreadyVerifiedException(ErrorMessages.ALREADY_VERIFIED);
        }
        if (verificationCode.getExpiryDateTime().before(new Timestamp(System.currentTimeMillis()))) {
            throw new VerificationCodeExpiredException(ErrorMessages.VERIFICATION_CODE_EXPIRED);
        }
        verificationCode.getCustomer().setVerified(true);
        verificationCode.setExpiryDateTime(new Timestamp(System.currentTimeMillis())); //expire it
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

        System.out.println(customerRepository.findAll());

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new CustomerNotFoundException("Customer email: " + email + "does not exist!"));

        return lazyLoadCustomerFields(customer);
    }

    public List<Customer> retrieveAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        for (Customer c : customers) {
            lazyLoadCustomerFields(c);
        }
        return customers;
    }

    public Customer retrieveCustomerByVerificationCode(String code) throws VerificationCodeExpiredException {
        VerificationCode verificationCode = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> new VerificationCodeExpiredException(ErrorMessages.VERIFICATION_CODE_INVALID));
        return lazyLoadCustomerFields(verificationCode.getCustomer());
    }

    /*
        Process: login > update email > put in new email >
        system send new email with verification link > click link > new email updated
     */
    // TODO: Update with actual link
    public void sendUpdateEmailLink(Long customerId, String newEmail) throws CustomerNotFoundException, InputDataValidationException {
        throwExceptionIfExistingCustomerHasEmail(newEmail);

        VerificationCode vCode = generateVerificationCode(customerId);
        Customer customer = retrieveCustomerByCustomerId(customerId);
        customer.setRequestedNewEmail(newEmail);
        nodeSendEmailVerificationLink("/account/updateEmail/", vCode.getCode(),
                newEmail, customer.getFirstName(), customer.getLastName());
    }

    //after customer clicks link, redirect to front-end page which call the api that calls this
    public Customer updateEmail(String code) throws CustomerNotFoundException, VerificationCodeExpiredException, VerificationCodeNotFoundException {
        VerificationCode verificationCode = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> new VerificationCodeNotFoundException(ErrorMessages.VERIFICATION_CODE_INVALID));
        if (verificationCode.getExpiryDateTime().before(new Timestamp(System.currentTimeMillis()))) {
            throw new VerificationCodeExpiredException(ErrorMessages.VERIFICATION_CODE_EXPIRED);
        }
        Customer customer = verificationCode.getCustomer();
        customer.setEmail(customer.getRequestedNewEmail());
        customer.setRequestedNewEmail(null);
        verificationCode.setExpiryDateTime(new Timestamp(System.currentTimeMillis())); //expire it
        return lazyLoadCustomerFields(customer);
    }

    public Customer updateCustomerDetails(Long customerId, String firstName, String lastName) throws CustomerNotFoundException, InputDataValidationException {
        Customer customerToUpdate = retrieveCustomerByCustomerId(customerId);
        customerToUpdate.setFirstName(firstName);
        customerToUpdate.setLastName(lastName);
        return lazyLoadCustomerFields(customerToUpdate);
    }

    public Customer customerLogin(String email, String password) throws InvalidLoginCredentialsException, CustomerNotVerifiedException {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("email", ErrorMessages.LOGIN_FAILED);
        errorMap.put("password", ErrorMessages.LOGIN_FAILED);
        try {
            Customer customer = retrieveCustomerByEmail(email);
            if (encoder.matches(password, customer.getPassword())) {
                if (!customer.isVerified()) {
                    errorMap.put("email", ErrorMessages.CUSTOMER_NOT_VERIFIED);
                    errorMap.remove("password");
                    throw new CustomerNotVerifiedException(errorMap, ErrorMessages.CUSTOMER_NOT_VERIFIED);
                }
                return lazyLoadCustomerFields(customer);
            } else {
                throw new InvalidLoginCredentialsException(errorMap, ErrorMessages.LOGIN_FAILED);
            }

        } catch (CustomerNotFoundException ex) {
            throw new InvalidLoginCredentialsException(errorMap, ErrorMessages.LOGIN_FAILED);
        }
    }

    public void changePassword(Long customerId, String oldPassword, String newPassword) throws CustomerNotFoundException, InvalidLoginCredentialsException {
        Customer customer = retrieveCustomerByCustomerId(customerId);

        if (encoder.matches(oldPassword, customer.getPassword())) {
            customer.setPassword(encoder.encode(newPassword));
        } else {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("oldPassword", ErrorMessages.OLD_PASSWORD_INCORRECT);
            throw new InvalidLoginCredentialsException(errorMap, ErrorMessages.OLD_PASSWORD_INCORRECT);
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

    public void nodeGenerateVerificationLinkAndSendEmail(String email) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByEmail(email);
        VerificationCode verificationCode = generateVerificationCode(customer.getCustomerId());
        if (Arrays.asList(environment.getActiveProfiles()).contains("dev")) {
            nodeSendEmailVerificationLink("/account/verify/", verificationCode.getCode(), customer.getEmail(), customer.getFirstName(), customer.getLastName());
        }
    }

    //link, email, fullname
    private void nodeSendEmailVerificationLink(String path, String code, String email, String firstName, String lastName) {
        restTemplate = new RestTemplate();
        Map<String, String> request = new HashMap<>();
        String fullName = firstName + " " + lastName;
        String link = Constants.FRONTEND_URL + path + code;
        request.put("link", link);
        request.put("email", email);
        request.put("fullName", fullName);

        String endpoint = Constants.NODE_API_URL + "/email/sendVerificationEmail";
        try {
            ResponseEntity<?> response = restTemplate.postForEntity(endpoint, request, Object.class);
            if (response.getStatusCode().equals(HttpStatus.OK)) {
                log.info("Email sent successfully to " + email);
            } else {
                log.error("Error sending email to " + email);
            }
        } catch (Exception ex){
            log.error(ex.getMessage());
        }


    }

    //customer click forget password --> send email to customer's email
    //give link /api/customer/resetpassword/948273h1fadnenfjns
    //customer inputs new password at that link
    //on front-end, make api call by extracting the code from the link
    public void resetPassword(String code, String newPassword, String confirmNewPassword) throws VerificationCodeExpiredException, VerificationCodeNotFoundException, InputDataValidationException {
        if (!newPassword.equals(confirmNewPassword)) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("newPassword", ErrorMessages.PASSWORDS_MUST_MATCH);
            errorMap.put("confirmNewPassword", ErrorMessages.PASSWORDS_MUST_MATCH);
            throw new InputDataValidationException(errorMap, ErrorMessages.PASSWORDS_MUST_MATCH);
        }
        VerificationCode vCode = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> new VerificationCodeNotFoundException(ErrorMessages.VERIFICATION_CODE_INVALID));
        Customer customer = vCode.getCustomer();
        if (code.equals(customer.getVerificationCode().getCode())) {
            if (customer.getVerificationCode().getExpiryDateTime().before(new Timestamp(System.currentTimeMillis()))) {
                throw new VerificationCodeExpiredException(ErrorMessages.VERIFICATION_CODE_EXPIRED);
            }
            vCode.setExpiryDateTime(new Timestamp(System.currentTimeMillis())); //expire it
            customer.setPassword(encoder.encode(newPassword));
        }
    }

    // TODO: Update with actual link
    public void sendResetPasswordLink(String email) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByEmail(email);
        VerificationCode vCode = generateVerificationCode(customer.getCustomerId());
        nodeSendEmailVerificationLink("/account/resetPassword/", vCode.getCode(),
                vCode.getCustomer().getEmail(), vCode.getCustomer().getFirstName(),
                vCode.getCustomer().getLastName());
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
//        creditCard.setNumber(AES.encrypt(creditCard.getNumber(), SECRET_KEY));
//        creditCard.setCvv(AES.encrypt(creditCard.getCvv(), SECRET_KEY));
        creditCardRepository.save(creditCard);
        customer.addCreditCard(creditCard);
        return lazyLoadCustomerFields(customer);
    }

    public CreditCard retrieveCreditCardByCreditCardId(Long customerId, Long creditCardId) throws CustomerNotFoundException, CreditCardNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        for (CreditCard c : customer.getCreditCards()) {
            if (c.getCreditCardId().equals(creditCardId)) {
                return c;
            }
        }
        throw new CreditCardNotFoundException("Credit card with id: " + creditCardId + " does not exist;");
    }

    public CreditCard retrieveCreditCardByPaymentMethodId(Long customerId, String paymentMethodId) throws CustomerNotFoundException, CreditCardNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        for (CreditCard c : customer.getCreditCards()) {
            if (c.getPaymentMethodId().equals(paymentMethodId)) {
                return c;
            }
        }
        return null;
    }

    public Customer deleteCreditCard(Long customerId, Long creditCardId) throws CustomerNotFoundException, CreditCardNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        CreditCard creditCardToRemove = retrieveCreditCardByCreditCardId(customerId, creditCardId);

        customer.getCreditCards().remove(creditCardToRemove);
        creditCardRepository.delete(creditCardToRemove);
        return lazyLoadCustomerFields(customer);
    }


    public Customer addShippingAddress(Long customerId, Address shippingAddress) throws CustomerNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(shippingAddress);
        Customer customer = retrieveCustomerByCustomerId(customerId);

        if (shippingAddress.isDefault()) {
            customer = setOtherAddressesToNonDefault(customerId);
        }
        if (shippingAddress.isBilling()) {
            customer = setOtherAddressesToNonBilling(customerId);
        }
        addressRepository.save(shippingAddress);
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

    public Customer updateShippingAddress(Long customerId, Address newShippingAddress) throws CustomerNotFoundException, AddressNotFoundException, InputDataValidationException {
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
        Customer customer = retrieveCustomerByCustomerId(customerId);
        return customer;
    }

    public Customer deleteShippingAddress(Long customerId, Long shippingAddressId) throws CustomerNotFoundException, AddressNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        Address shippingAddressToRemove = getShippingAddress(customerId, shippingAddressId);

        customer.getShippingAddresses().remove(shippingAddressToRemove);

        //dont delete, in case referenced by other stuff e.g. transaction

        return lazyLoadCustomerFields(customer);
    }

    public Customer addProductToWishlist(Long customerId, Long productVariantId) throws CustomerNotFoundException, ProductVariantNotFoundException, WishlistException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        if (customer.getWishlistItems().contains(productVariant)) {
            throw new WishlistException("Already in wishlist!");
        }
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
        for (ProductVariant pv : customer.getWishlistItems()) {
            shoppingCartService.updateQuantityOfProductVariant(1, pv.getProductVariantId(), customerId, ONLINE_SHOPPING_CART);
        }
        customer = retrieveCustomerByCustomerId(customerId);
        return customer;
    }

    public Customer addStyle(Long customerId, String stylePreference) throws CustomerNotFoundException, StyleNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        String[] styleChoices = stylePreference.split(",");
        int vinCount = 0;
        int boCount = 0;
        int chicCount = 0;
        int artCount = 0;
        int soCount = 0;
        String styleChosen = "";
        if (customer.getStyle() != null && customer.getStylePreference() != "") {
            customer.setStyle(null);
        }
        customer.setStylePreference(stylePreference);
        for (String styleChoice: styleChoices) {
            if (styleChoice.equals("0")) {
                vinCount++;
            } else if (styleChoice.equals("1")) {
                boCount++;
            } else if (styleChoice.equals("2")) {
                chicCount++;
            } else if (styleChoice.equals("3")) {
                artCount++;
            } else {
                soCount++;
            }
        }
        if ((vinCount >= boCount) && (vinCount >= chicCount) && (vinCount >= artCount) && (vinCount >= soCount)) {
            Style vintage = styleService.retrieveStyleByStyleName("Vintage");
            customer.setStyle(vintage);
            vintage.getCustomers().add(customer);
        } else if ((boCount >= chicCount) && (boCount >= artCount) && (boCount >= soCount)) {
            Style bohemian = styleService.retrieveStyleByStyleName("Bohemian");
            customer.setStyle(bohemian);
            bohemian.getCustomers().add(customer);
        } else if ((chicCount >= artCount) && (chicCount >= soCount)) {
            Style chic = styleService.retrieveStyleByStyleName("Chic");
            customer.setStyle(chic);
            chic.getCustomers().add(customer);
        } else if (artCount >= soCount) {
            Style artsy = styleService.retrieveStyleByStyleName("Artsy");
            customer.setStyle(artsy);
            artsy.getCustomers().add(customer);
        } else {
            Style sophisticated = styleService.retrieveStyleByStyleName("Sophisticated");
            customer.setStyle(sophisticated);
            sophisticated.getCustomers().add(customer);
        }

        return lazyLoadCustomerFields(customer);
    }

    public Customer removeStyle(Long customerId, String styleChosen) throws CustomerNotFoundException, StyleNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        Style style = styleService.retrieveStyleByStyleName(styleChosen);
        customer.setStyle(null);
        style.getCustomers().remove(customer);
        customer.setStylePreference("");
        return lazyLoadCustomerFields(customer);
    }

    public Customer addProductToReservationCart(Long customerId, Long productVariantId) throws CustomerNotFoundException, ProductVariantNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        customer.getReservationCartItems().add(productVariant);
        return lazyLoadCustomerFields(customer);
    }

    public Customer removeProductFromReservationCart(Long customerId, Long productVariantId) throws ProductVariantNotFoundException, CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        customer.getReservationCartItems().remove(productVariant);
        return lazyLoadCustomerFields(customer);
    }

    public Customer clearReservationCart(Long customerId) throws CustomerNotFoundException {
        Customer customer = retrieveCustomerByCustomerId(customerId);
        customer.setReservationCartItems(new ArrayList<>());
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
        Style customerStyle = customer.getStyle();
        customer.setStyle(null);
        customerStyle.getCustomers().remove(customer);

        customer.setWishlistItems(null);

        customer.setReservationCartItems(null);

        customerRepository.delete(customer);

        return customer;
    }

    private void throwExceptionIfExistingCustomerHasEmail(String email) throws InputDataValidationException {
        Customer existingCustomer = null;
        try {
            existingCustomer = retrieveCustomerByEmail(email);
        } catch (CustomerNotFoundException ex) {
        }
        if (existingCustomer != null) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("email", ErrorMessages.EMAIL_TAKEN);
            throw new InputDataValidationException(errorMap, ErrorMessages.EMAIL_TAKEN);
        }
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
        customer.getStyle();
        customer.getStylePreference();
        customer.getReservationCartItems().size();
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