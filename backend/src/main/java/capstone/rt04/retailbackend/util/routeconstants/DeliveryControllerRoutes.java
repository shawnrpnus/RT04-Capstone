package capstone.rt04.retailbackend.util.routeconstants;

public class DeliveryControllerRoutes {
    public static final String DELIVERY_BASE_ROUTE = "/api/delivery";

    // Delivery
    public static final String CREATE_DELIVERY_FOR_TRANSACTION = "/createDeliveryForTransaction";
    public static final String CREATE_DELIVERY_FOR_RESTOCK_ORDER = "/createDeliveryForRestockOrder";
    public static final String RETRIEVE_ALL_DELIVERY = "/retrieveAllDelivery";
    public static final String RECEIVE_RESTOCK_ORDER_ITEM_THROUGH_DELIVERY = "/receiveRestockOrderItemThroughDelivery";
    public static final String RECEIVE_TRANSACTION_THROUGH_DELIVERY = "/receiveTransactionThroughDelivery";
    public static final String RETRIEVE_DELIVERY_BY_ID = "/retrieveDeliveryById/{deliveryId}";
    public static final String DELETE_DELIVERY = "/deleteDelivery/{deliveryId}";
    public static final String AUTOMATE_DELIVERY_ALLOCATION = "/automateDeliveryAllocation/{staffId}";
    public static final String ESTIMATE_NUMBER_OF_DELIVERYMAN_REQUIRED = "/estimateNumberOfDeliveryManRequired";
    public static final String GENERATE_DELIVERY_ROUTE = "/generateDeliveryRoute/{deliveryId}";
    public static final String GENERATE_DELIVERY_ROUTE_FOR_TODAY = "/generateDeliveryRouteForToday";

    // Restock Order Item
    public static final String RETRIEVE_ALL_RESTOCK_ORDER_ITEM_TO_DELIVER = "/retrieveAllRestockOrderItemToDeliver";
}
