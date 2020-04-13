package capstone.rt04.retailbackend.util.routeconstants;

public class StaffControllerRoutes {
    public static final String STAFF_BASE_ROUTE = "/api/staff";
    public static final String CREATE_NEW_STAFF = "/createNewStaff";
    public static final String CREATE_NEW_ROLE= "/createNewRole";
    public static final String CREATE_NEW_DEPARTMENT = "/createNewDepartment";
    public static final String CREATE_NEW_STAFF_ACCOUNT = "/createNewStaffAccount";
    public static final String RETRIEVE_STAFF_BY_ID = "/retrieveStaffById/{staffId}";
    public static final String RETRIEVE_ALL_STAFF = "/retrieveAllStaff";
    public static final String RETRIEVE_ALL_DELIVERY_STAFF = "/retrieveAllDeliveryStaff";
    public static final String RETRIEVE_ALL_ROLES = "/retrieveAllRoles";
    public static final String RETRIEVE_ALL_DEPARTMENTS = "/retrieveAllDepartments";
    public static final String UPDATE_STAFF = "/updateStaffDetails";
    public static final String DELETE_STAFF = "/deleteStaff/{staffId}";
    public static final String REASSIGN_STAFF_STORE = "/reassignStaffStore";
    public static final String LOGIN_STAFF = "/loginStaff";
    public static final String CHANGE_STAFF_PASSWORD = "/changeStaffPassword";
    public static final String RESET_STAFF_PASSWORD = "/resetStaffPassword";
    public static final String RETRIEVE_STAFF_WITH_NO_ACCOUNT = "/retrieveStaffWithNoAccount";
    public static final String REGISTER_PUSH_NOTIF_TOKEN = "/registerPushNotificationToken";
    public static final String RETRIEVE_ALL_STORE_STAFF = "/retrieveAllStoreStaff";
    public static final String RETRIEVE_STAFF_OF_STORE = "/retrieveStoreStaff/{storeId}";
}
