package capstone.rt04.retailbackend.util.routeconstants;

public class CustomerControllerRoutes {
    public static final String CUSTOMER_BASE_ROUTE = "/api/customer";
    public static final String CREATE_NEW_CUSTOMER = "/createNewCustomer";
    public static final String GET_CUSTOMER_BY_EMAIL = "/getCustomerByEmail";
    public static final String LOGIN = "/login";
    public static final String DELETE_CUSTOMER = "/deleteCustomer/{customerId}";
    public static final String CHANGE_PASSWORD = "/changePassword";
    public static final String VERIFY = "/verify/{verificationCode}";

}
