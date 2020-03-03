package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.request.transaction.TransactionCreateRequest;
import capstone.rt04.retailbackend.request.transaction.TransactionRetrieveRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.TransactionService;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.TransactionControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(TransactionControllerRoutes.TRANSACTION_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping(TransactionControllerRoutes.CREATE_TRANSACTION)
    public ResponseEntity<?> createNewTransaction(@RequestBody TransactionCreateRequest transactionCreateRequest) throws CustomerNotFoundException, InvalidCartTypeException {
        Customer customer = transactionService.createNewTransaction(transactionCreateRequest.getCustomerId(),
                transactionCreateRequest.getShoppingCartId(), transactionCreateRequest.getCartType());
        return new ResponseEntity<>(customer, HttpStatus.CREATED);
    }

    @GetMapping(TransactionControllerRoutes.RETRIEVE_TRANSACTION_BY_ID)
    public ResponseEntity<?> retrieveTransactionById(@PathVariable Long transactionId) {
        try {
            Transaction transaction = transactionService.retrieveTransactionById(transactionId);
            return new ResponseEntity<>(transaction, HttpStatus.OK);
        } catch (TransactionNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(TransactionControllerRoutes.RETRIEVE_ALL_TRANSACTIONS)
    public ResponseEntity<?> retrievePastOrders() {
        try {
            return new ResponseEntity<>(transactionService.retrievePastOrders(), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(TransactionControllerRoutes.RETRIEVE_MATCHED_TRANSACTIONS)
    public ResponseEntity<?> retrieveMatchedOrders(@RequestBody TransactionRetrieveRequest transactionRetrieveRequest) {
        try {
            List<Transaction> transactions = transactionService.filterSortOrderHistory(transactionRetrieveRequest.getCollectionMode(), transactionRetrieveRequest.getDeliveryStatus(),
                    transactionRetrieveRequest.getStartDate(), transactionRetrieveRequest.getEndDate(),
                    transactionRetrieveRequest.getSortEnum());
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
