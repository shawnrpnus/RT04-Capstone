package capstone.rt04.retailbackend.util.routeconstants;

public class TransactionControllerRoutes {
    public static final String TRANSACTION_BASE_ROUTE = "/api/transaction";
    public static final String CREATE_TRANSACTION = "/createNewTransaction";
    public static final String RETRIEVE_TRANSACTION_BY_ID = "/retrieveTransactionById/{transactionId}";
    public static final String RETRIEVE_TRANSACTION_TO_SEND_FOR_DELIVERY = "/retrieveTransactionToSendForDelivery";
    public static final String RETRIEVE_ALL_TRANSACTIONS = "/retrieveAllTransactions";
    public static final String RETRIEVE_ALL_STORE_TRANSACTION = "/retrieveAllStoreTransactions";
    public static final String RETRIEVE_ALL_STORE_TO_COLLECT_TRANSACTION = "/retrieveAllStoreToCollectTransactions";
    public static final String RETRIEVE_CUSTOMER_TRANSACTIONS = "/retrieveCustomerTransactions";
    public static final String RETRIEVE_CUSTOMER_IN_STORE_TRANSACTIONS = "/retrieveCustomerInStoreTransactions";
    public static final String RETRIEVE_CUSTOMER_IN_STORE_COLLECION_TRANSACTIONS = "/retrieveCustomerInStoreCollectionTransactions";
    public static final String RETRIEVE_MATCHED_TRANSACTIONS = "/retrieveMatchedTransactions";
    public static final String RETRIEVE_TRANSACTION_BY_ORDER_NUMBER = "/retrieveTransactionByOrderNumber/{orderNumber}";
    public static final String CONFIRM_RECEIVED_TRANSACTION = "/confirmReceivedTransaction";
    public static final String RETRIEVE_TRANSACTION_BY_QR_CODE = "/retrieveTransactionByQRCode/{transactionId}/{storeId}";
}
