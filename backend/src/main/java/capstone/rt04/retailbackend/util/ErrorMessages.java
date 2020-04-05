package capstone.rt04.retailbackend.util;

public class ErrorMessages {
    public static final String EMAIL_INVALID = "Email format is invalid!";
    public static final String EMAIL_REQUIRED = "Email is required!";
    public static final String EMAIL_TAKEN = "There is already a registered user with this email!";


    public static final String FIRST_NAME_REQUIRED = "First name is required!";
    public static final String LAST_NAME_REQUIRED = "Last name is required!";

    public static final String LOGIN_FAILED = "Email or password is invalid!";
    public static final String NEW_PASSWORD_REQUIRED = "New password is required!";
    public static final String CONFIRM_NEW_PASSWORD_REQUIRED = "Please confirm your new password";
    public static final String PASSWORDS_MUST_MATCH = "Passwords must match!";
    public static final String NEW_PASSWORDS_DO_NOT_MATCH = "New passwords do not match";

    public static final String OLD_PASSWORD_INCORRECT = "Old password is incorrect!";
    public static final String OLD_PASSWORD_REQUIRED = "Old password is required!";
    public static final String PASSWORD_REQUIRED = "Password is required!";
    public static final String USERNAME_REQUIRED = "Username is required!";
    public static final String CUSTOMER_NOT_VERIFIED = "Please click the verification link in your email to activate your account";

    public static final String VERIFICATION_CODE_INVALID = "Invalid verification code!";
    public static final String VERIFICATION_CODE_EXPIRED = "Verification code has expired!";
    public static final String ALREADY_VERIFIED = "Customer has already been verified!";

    public static final String PROMO_CODE_NAME_REQUIRED = "Promo code name is required!";
    public static final String PROMO_CODE_TAKEN = "Promo code is already created!";
    public static final String NUM_REMAINING_REQUIRED = "Quantity is required!";
    public static final String ENTER_DISCOUNT= "Enter the promo discount!";
    public static final String ENTER_MIN= "Minimum amount needed!";
    public static final String INVALID_PERCENTAGE_DISCOUNT= "Please enter a discount that is less than 100%!";
    public static final String FLAT_PERCENTAGE_NOT_NULL = "Percentage discount and flat discount cannot be both empty or 0";
    public static final String PRODUCTS_REQUIRED = "Products are required!";
    public static final String TAG_REQUIRED = "Tag is required!";
    public static final String SERIAL_NUMBER_UNIQUE ="Serial number must be unique";

    public static final String STYLE_NAME_REQUIRED = "Style categoryName is required!";
    public static final String STYLE_ALREADY_EXISTS = "This style already exists!";

    public static final String TAG_NAME_REQUIRED = "Tag categoryName is required!";

    public static final String NRIC_TAKEN = "There is already a staff with this NRIC!" ;
    public static final String STAFF_LOGIN_FAILED = "Username or password is invalid!";


    public static final String NRIC_REQUIRED = "NRIC is required!";
    public static final String NRIC_MAX = "Please enter only last 4 characters of NRIC!";
    public static final String NRIC_FIRST_THREE = "First 3 characters have to be digits!";
    public static final String NRIC_LAST_LETTER = "Last input has to be an alphabet!";
    public static final String SALARY_REQUIRED ="Salary is required!";
    public static final String STAFF_ACCOUNT_ALREADY_CONFIGURED ="An account has already been configured for this staff!";
    public static final String STAFF_DOES_NOT_EXIST = "Staff does not exist!";
    public static final String INCORRECT_PASSWORD = "Password is wrong!";
    public static final String INCORRECT_USERNAME = "Username is wrong!";
    public static final String STORE_CANNOT_ASSIGN= "Do not assign a store to HR or IT!";

    public static final String SERIAL_NUMBER_REQUIRED = "Serial number is required!";
    public static final String PRODUCT_NAME_REQUIRED = "Product name is required!";
    public static final String DESCRIPTION_REQUIRED = "Description is required!";
    public static final String PRICE_REQUIRED = "Price is required!";
    public static final String COST_REQUIRED = "Cost is required!";
    public static final String CATEGORY_REQUIRED = "Category is required!";
    public static final String PRODUCT_ID_REQUIRED ="Product ID is required!";

    public static final String CREATE_NEW_PRODUCT_FAILED = "Failed in creating new product!";

    public static final String SKU_TAKEN = "The product SKU is already exists!";

    public static final String STATUS_REQUIRED = "Status is required!";

    public static final String REFUND_ID_REQUIRED = "Refund Id is required!";
    public static final String REFUND_LINE_ITEM_HANDLER_ID_REQUIRED = "Refund Line Item Handler Id is required!";
    public static final String REFUND_LINE_ITEM_ID_REQUIRED = "Refund Line Item Id is required!";
    public static final String REFUND_LINE_ITEM_ALREADY_DONE  = "Refund Line Item already past this progress!";
    public static final String REFUND_NOT_SELECTED = "Refund must be selected!";
    public static final String REFUND_REASON_EMPTY = "Reason must not be empty";
    public static final String REFUND_MODE = "Refund Mode must be selected";
    public static final String REFUND_STORE_ID_EMPTY = "Store Id must be valid";
}
