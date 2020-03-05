package capstone.rt04.retailbackend.util.routeconstants;

public class TransactionControllerRoutes {
    public static final String TRANSACTION_BASE_ROUTE = "/api/transaction";
    public static final String CREATE_TRANSACTION = "/createNewTransaction";
    public static final String RETRIEVE_TRANSACTION_BY_ID = "/retrieveTransactionById/{transactionId}";
    public static final String RETRIEVE_ALL_TRANSACTIONS = "/retrieveAllTransactions";
    public static final String RETRIEVE_CUSTOMER_TRANSACTIONS = "/retrieveCustomerTransactions";
    public static final String RETRIEVE_MATCHED_TRANSACTIONS = "/retrieveMatchedTransactions";
}
