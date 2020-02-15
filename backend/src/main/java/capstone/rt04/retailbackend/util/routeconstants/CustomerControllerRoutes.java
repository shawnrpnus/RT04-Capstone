package capstone.rt04.retailbackend.util.routeconstants;

public class CustomerControllerRoutes {
    public static final String CUSTOMER_BASE_ROUTE = "/api/customer";
    public static final String CREATE_NEW_CUSTOMER = "/createNewCustomer";
    public static final String GET_CUSTOMER_BY_EMAIL = "/getCustomerByEmail";
    public static final String SEND_UPDATE_EMAIL_LINK = "/sendUpdateEmailLink";
    public static final String UPDATE_EMAIL = "/updateEmail/{code}";
    public static final String UPDATE_CUSTOMER = "/updateCustomer";
    public static final String LOGIN = "/login";
    public static final String DELETE_CUSTOMER = "/deleteCustomer/{customerId}";
    public static final String CHANGE_PASSWORD = "/changePassword";
    public static final String VERIFY = "/verify/{verificationCode}";
    public static final String SEND_RESET_PASSWORD_LINK = "/sendResetPasswordLink";
    public static final String RESET_PASSWORD_POST = "/resetPassword";
    public static final String RESET_PASSWORD_GET = "/resetPassword/{code}";
    public static final String GET_CUSTOMER_FROM_CODE = "/getCustomerFromCode/{code}";
    public static final String UPDATE_MEASUREMENTS = "/updateMeasurements";
    public static final String DELETE_MEASUREMENTS = "/deleteMeasurements";
    public static final String ADD_CREDIT_CARD = "/addCreditCard";
    public static final String REMOVE_CREDIT_CARD = "/removeCreditCard";
    public static final String ADD_SHIPPING_ADDRESS = "/addShippingAddress";
    public static final String UPDATE_SHIPPING_ADDRESS = "/updateShippingAddress";
    public static final String REMOVE_SHIPPING_ADDRESS = "/removeShippingAddress";
    public static final String ADD_TO_WISHLIST = "/addToWishlist";
    public static final String REMOVE_FROM_WISHLIST = "/removeFromWishlist";
    public static final String CLEAR_WISHLIST = "/clearWishlist";
    public static final String ADD_STYLE = "/addStyle";
    public static final String REMOVE_STYLE = "/removeStyle";
    public static final String UPDATE_SHOPPING_CART = "/addToShoppingCart";
    public static final String CLEAR_SHOPPING_CART = "/clearShoppingCart";
    public static final String ADD_TO_RESERVATION_CART = "/addToReservationCart";
    public static final String REMOVE_FROM_RESERVATION_CART = "/removeFromReservationCart";
    public static final String CLEAR_RESERVATION_CART = "/clearReservationCart";

}
