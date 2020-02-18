package capstone.rt04.retailbackend.util.routeconstants;

public class StaffControllerRoutes {
    public static final String STAFF_BASE_ROUTE = "/api/staff";
    public static final String CREATE_NEW_STAFF = "/createNewStaff";
    public static final String CREATE_NEW_STAFF_ACCOUNT = "/createNewStaffAccount";
    public static final String RETRIEVE_STAFF_BY_ID = "/retrieveStaffById/{staffId}";
    public static final String RETRIEVE_ALL_STAFF = "/retrieveAllStaff";
    public static final String UPDATE_STAFF = "/updateStaffDetails";
    public static final String DELETE_STAFF = "/deleteStaff/{staffId}";
    public static final String UPDATE_STAFF_ADDRESS = "/updateStaffAddress";
    public static final String LOGIN_STAFF = "/loginStaff";
    public static final String CHANGE_STAFF_PASSWORD = "/changeStaffPassword";
    public static final String SEND_STAFF_RESET_PASSWORD_LINK = "/sendStaffResetPasswordLink";
    public static final String RESET_STAFF_PASSWORD_POST = "/resetStaffPassword";
    public static final String RESET_STAFF_PASSWORD_GET = "/resetStaffPassword/{code}";

}
