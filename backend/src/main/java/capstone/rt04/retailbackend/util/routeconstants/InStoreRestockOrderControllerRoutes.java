package capstone.rt04.retailbackend.util.routeconstants;

public class InStoreRestockOrderControllerRoutes {
    public static final String IN_STORE_RESTOCK_ORDER_BASE_ROUTE = "/api/inStoreRestockOrder";
    public static final String CREATE_IN_STORE_RESTOCK_ORDER = "/createInStoreRestockOrder";
    public static final String RETRIEVE_ALL_IN_STORE_RESTOCK_ORDER = "/retrieveAllInStoreRestockOrder";
    public static final String RETRIEVE_IN_STORE_RESTOCK_ORDER_BY_ID = "/retrieveInStoreRestockOrderId/{inStoreRestockOrderId}";
    public static final String UPDATE_IN_STORE_RESTOCK_ORDER = "/updateInStoreRestockOrder";
    public static final String DELETE_IN_STORE_RESTOCK_ORDER = "/deleteInStoreRestockOrder/{inStoreRestockOrderId}";
    public static final String FULFILL_IN_STORE_RESTOCK_ORDER = "/fulfillInStoreRestockOrder/{inStoreRestockOrderId}";
    public static final String RECEIVE_STOCK = "/receiveStock/{inStoreRestockOrderId}";


}
