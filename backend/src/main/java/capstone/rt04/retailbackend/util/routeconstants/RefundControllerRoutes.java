package capstone.rt04.retailbackend.util.routeconstants;

public class RefundControllerRoutes {
    public static final String REFUND_BASE_ROUTE = "/api/refund";
    public static final String CREATE_IN_STORE_REFUND_RECORD = "/createRefundRecord";
    public static final String CREATE_ONLINE_REFUND_RECORD = "/createOnlineRefundRecord";
    public static final String UPDATE_REFUND_RECORD = "/updateRefundRecord";
    public static final String RETRIEVE_ALL_REFUND_STATUS_ENUM = "/retrieveAllRefundStatusEnum";
    public static final String RETRIEVE_ALL_REFUND_MODE_ENUM = "/retrieveAllRefundModeEnum";
    public static final String RETRIEVE_ALL_REFUND_PROGRESS_ENUM = "/retrieveAllRefundProgressEnum";
    public static final String RETRIEVE_ALL_REFUNDS = "/retrieveAllRefunds";
    public static final String RETRIEVE_REFUND_BY_ID = "/retrieveRefundById/{refundId}";
    public static final String RETRIEVE_REFUNDS_BY_CUSTOMER_ID = "/retrieveRefundsByCustomerId/{customerId}";
    public static final String RETRIEVE_REFUNDS_BY_TRANSACTION_ID = "/retrieveRefundsByTransactionId";
    public static final String RETRIEVE_ALL_REFUNDS_BY_PARAMETER = "/retrieveAllRefundsByParameter";

}
