package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.entities.TransactionLineItem;
import capstone.rt04.retailbackend.request.transaction.TransactionCreateRequest;
import capstone.rt04.retailbackend.request.transaction.TransactionRetrieveRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.TransactionService;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.TransactionControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;


@RestController
@RequestMapping(TransactionControllerRoutes.TRANSACTION_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class TransactionController {

    private final TransactionService transactionService;
    private final RelationshipService relationshipService;

    public TransactionController(TransactionService transactionService, RelationshipService relationshipService) {
        this.transactionService = transactionService;
        this.relationshipService = relationshipService;
    }

//    @PostMapping(TransactionControllerRoutes.CREATE_TRANSACTION)
//    public ResponseEntity<?> createNewTransaction(@RequestBody TransactionCreateRequest transactionCreateRequest) throws CustomerNotFoundException, InvalidCartTypeException {
//        Customer customer = transactionService.createNewTransaction(transactionCreateRequest.getCustomerId(),
//                transactionCreateRequest.getShoppingCartId(), transactionCreateRequest.getCartType());
//        relationshipService.clearCustomerRelationships(customer);
//        return new ResponseEntity<>(customer, HttpStatus.CREATED);
//    }

    @GetMapping(TransactionControllerRoutes.RETRIEVE_TRANSACTION_BY_ID)
    public ResponseEntity<?> retrieveTransactionById(@PathVariable Long transactionId) {
        try {
            Transaction transaction = transactionService.retrieveTransactionById(transactionId);
            relationshipService.clearTransactionRelationships(transaction);
            return new ResponseEntity<>(transaction, HttpStatus.OK);
        } catch (TransactionNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(TransactionControllerRoutes.RETRIEVE_ALL_TRANSACTIONS)
    public ResponseEntity<?> retrievePastOrders() {
        List<Transaction> txns = transactionService.retrievePastOrders();
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @GetMapping(TransactionControllerRoutes.RETRIEVE_CUSTOMER_TRANSACTIONS)
    public ResponseEntity<?> retrieveCustomerTransactions(@RequestParam Long customerId) {
        List<Transaction> txns = transactionService.retrieveCustomerTransactions(customerId);
        for (Transaction txn : txns) {
            relationshipService.clearTransactionRelationships(txn);
        }
        Collections.sort(txns, Comparator.comparing(Transaction::getTransactionId).reversed());
        return new ResponseEntity<>(txns, HttpStatus.OK);
    }

    @PostMapping(TransactionControllerRoutes.RETRIEVE_MATCHED_TRANSACTIONS)
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


}
