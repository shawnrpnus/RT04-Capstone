package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.request.transaction.SalesByCategoryRequest;
import capstone.rt04.retailbackend.request.transaction.SalesByDayRequest;
import capstone.rt04.retailbackend.request.transaction.TransactionRetrieveRequest;
import capstone.rt04.retailbackend.request.transaction.UpdateTransactionRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.response.analytics.SalesByDay;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.TransactionService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.AddressNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InsufficientStockException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import com.stripe.exception.StripeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import static capstone.rt04.retailbackend.util.routeconstants.TransactionControllerRoutes.*;


@RestController
@RequestMapping(TRANSACTION_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class TransactionController {

    private final TransactionService transactionService;
    private final RelationshipService relationshipService;

    public TransactionController(TransactionService transactionService, RelationshipService relationshipService) {
        this.transactionService = transactionService;
        this.relationshipService = relationshipService;
    }

//    @PostMapping(CREATE_TRANSACTION)
//    public ResponseEntity<?> createNewTransaction(@RequestBody TransactionCreateRequest transactionCreateRequest) throws CustomerNotFoundException, InvalidCartTypeException {
//        Customer customer = transactionService.createNewTransaction(transactionCreateRequest.getCustomerId(),
//                transactionCreateRequest.getShoppingCartId(), transactionCreateRequest.getCartType());
//        relationshipService.clearCustomerRelationships(customer);
//        return new ResponseEntity<>(customer, HttpStatus.CREATED);
//    }

    @GetMapping(RETRIEVE_TRANSACTION_BY_ID)
    public ResponseEntity<?> retrieveTransactionById(@PathVariable Long transactionId) {
        try {
            Transaction transaction = transactionService.retrieveTransactionById(transactionId);
            relationshipService.clearTransactionRelationships(transaction);
            return new ResponseEntity<>(transaction, HttpStatus.OK);
        } catch (TransactionNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(RETRIEVE_TRANSACTION_BY_QR_CODE)
    public ResponseEntity<?> retrieveTransactionByQRCode(@PathVariable Long transactionId, @PathVariable Long storeId) {
        try {
            Transaction transaction = transactionService.retrieveTransactionByQRCode(transactionId, storeId);
            relationshipService.clearTransactionRelationships(transaction);
            relationshipService.clearTransactionForQRCodeRelationships(transaction);
            return new ResponseEntity<>(transaction, HttpStatus.OK);
        } catch (TransactionNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(RETRIEVE_TRANSACTION_BY_ORDER_NUMBER)
    public ResponseEntity<?> retrieveTransactionByOrderNumber(@PathVariable String orderNumber) {
        try {
            Transaction transaction = transactionService.retrieveTransactionByOrderNumber(orderNumber);
            relationshipService.clearTransactionRelationshipsForStaffSide(transaction);
            relationshipService.clearCustomerRelationships(transaction.getCustomer());
            return new ResponseEntity<>(transaction, HttpStatus.OK);
        } catch (TransactionNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(RETRIEVE_TRANSACTION_TO_SEND_FOR_DELIVERY)
    public ResponseEntity<?> retrieveInstoreCollectionTransaction() {
        List<Transaction> transactions = transactionService.retrieveTransactionsToBeDelivered();
        for (Transaction txn : transactions) {
            relationshipService.clearTransactionRelationships(txn);
        }
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_TRANSACTIONS)
    public ResponseEntity<?> retrievePastOrders() {
        List<Transaction> txns = transactionService.retrievePastOrders();
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_STORE_TRANSACTION)
    public ResponseEntity<?> retrieveAllStoreTransactions(@RequestParam(required = false) Long storeId) {
        List<Transaction> txns = transactionService.retrieveAllTransactionsByStoreId(storeId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_STORE_TO_COLLECT_TRANSACTION)
    public ResponseEntity<?> retrieveAllStoreToCollectTransactions(@RequestParam(required = false) Long storeId) {
        List<Transaction> txns = transactionService.retrieveAllTransactionsByStoreToCollectId(storeId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_CUSTOMER_TRANSACTIONS)
    public ResponseEntity<?> retrieveCustomerTransactions(@RequestParam Long customerId) {
        List<Transaction> txns = transactionService.retrieveCustomerTransactions(customerId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        Collections.sort(txns, Comparator.comparing(Transaction::getCreatedDateTime).reversed());
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_CUSTOMER_IN_STORE_TRANSACTIONS)
    public ResponseEntity<?> retrieveCustomerInStoreTransactions(@RequestParam Long customerId) {
        List<Transaction> txns = transactionService.getCustomerInStoreTransactions(customerId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        Collections.sort(txns, Comparator.comparing(Transaction::getCreatedDateTime).reversed());
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping("/retrieveCustomerCompletedInStoreTransactions")
    public ResponseEntity<?> retrieveCustomerCompletedInStoreTransactions(@RequestParam Long customerId) {
        List<Transaction> txns = transactionService.getCustomerCompletedInStoreTransactions(customerId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        Collections.sort(txns, Comparator.comparing(Transaction::getCreatedDateTime).reversed());
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping("/retrieveCustomerPendingInStoreTransactions")
    public ResponseEntity<?> retrieveCustomerPendingInStoreTransactions(@RequestParam Long customerId) {
        List<Transaction> txns = transactionService.getCustomerPendingInStoreTransaction(customerId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        Collections.sort(txns, Comparator.comparing(Transaction::getCreatedDateTime).reversed());
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_CUSTOMER_IN_STORE_COLLECION_TRANSACTIONS)
    public ResponseEntity<?> retrieveCustomerInStoreCollectionTransactions(@RequestParam Long customerId) {
        List<Transaction> txns = transactionService.getCustomerInStoreCollectionTransactions(customerId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        Collections.sort(txns, Comparator.comparing(Transaction::getCreatedDateTime).reversed());
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping("/retrieveCustomerCompletedInStoreCollections")
    public ResponseEntity<?> retrieveCustomerCompletedInStoreCollectionTransactions(@RequestParam Long customerId) {
        List<Transaction> txns = transactionService.getCustomerCompletedInStoreCollectionTransactions(customerId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        Collections.sort(txns, Comparator.comparing(Transaction::getCreatedDateTime).reversed());
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping("/retrieveCustomerPendingInStoreCollections")
    public ResponseEntity<?> retrieveCustomerPendingInStoreCollectionTransactions(@RequestParam Long customerId) {
        List<Transaction> txns = transactionService.getCustomerPendingInStoreCollectionTransactions(customerId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        Collections.sort(txns, Comparator.comparing(Transaction::getCreatedDateTime).reversed());
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @PostMapping(RETRIEVE_MATCHED_TRANSACTIONS)
    public ResponseEntity<?> retrieveMatchedOrders(@RequestBody TransactionRetrieveRequest transactionRetrieveRequest) {
        try {
            List<Transaction> transactions = transactionService.filterSortOrderHistory(transactionRetrieveRequest.getCustomerId(), transactionRetrieveRequest.getCollectionMode(), transactionRetrieveRequest.getDeliveryStatus(),
                    transactionRetrieveRequest.getStartDate(), transactionRetrieveRequest.getEndDate(),
                    transactionRetrieveRequest.getSortEnum());
            for (Transaction transaction : transactions) {
                relationshipService.clearTransactionRelationships(transaction);
            }
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(CONFIRM_RECEIVED_TRANSACTION)
    public ResponseEntity<?> confirmReceivedTransaction(@RequestBody UpdateTransactionRequest updateTransactionRequest) {
        try {
            Transaction transaction = transactionService.confirmReceivedTransaction(updateTransactionRequest.getTransactionId());
            return new ResponseEntity<>(transaction, HttpStatus.OK);
        } catch (TransactionNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/generateTestTransactions/{numTxns}")
    public ResponseEntity<?> generateTestTransactions(@PathVariable Integer numTxns) throws PromoCodeNotFoundException, StoreNotFoundException, InvalidCartTypeException, StripeException, AddressNotFoundException, InputDataValidationException, ProductVariantNotFoundException, InsufficientStockException, CustomerNotFoundException {

        transactionService.generateTestTransactions(numTxns);
        return new ResponseEntity<>("Transactions generated successfully", HttpStatus.OK);

    }

    @PostMapping("/retrieveSalesByDay")
    public ResponseEntity<?> retrieveSalesByDay(@RequestBody SalesByDayRequest req){
        List<SalesByDay> res = transactionService.retrieveSalesByDayWithParameters(req.getFromDateString(),
                req.getToDateString(), req.getFromStoreIds(), req.getOnlineSelected());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/retrieveSalesByCategory")
    public ResponseEntity<?> retrieveSalesByCategory(@RequestBody SalesByCategoryRequest req){
        Map<String, Object> res = transactionService.getSalesByCategory(req.getFromDateString(),
                req.getToDateString());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
