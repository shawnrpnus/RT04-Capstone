package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.repositories.TransactionRepository;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TransactionService {

    @Autowired
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    /*create new transaction - not the actual one; simplified just for testing other use cases*/
    public Transaction createNewTransaction(Transaction transaction) {
        transactionRepository.save(transaction);
        return transaction;
    }

    /*view order history*/
    //retrieve list of past orders
    public List<Transaction> retrievePastOrders() {
        List<Transaction> pastOrders = transactionRepository.findAll();
        lazyLoadTransaction(pastOrders);
        pastOrders.toString();
        return pastOrders;
    }

    /*view order details*/
    public Transaction retrieveTransactionById(Long transactionId) throws TransactionNotFoundException{
        if (transactionId == null) {
            throw new TransactionNotFoundException("transaction ID not provided");
        }

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction ID " + transactionId + " does not exist!"));

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);
        lazyLoadTransaction(transactions);

        return transaction;
    }

    /*Lazy Load Transaction*/
    private void lazyLoadTransaction(List<Transaction> transactions) {
        for (Transaction transaction : transactions) {
            transaction.getPromoCode();
            transaction.getTransactionLineItems().size();
            transaction.getDeliveries().size();
            transaction.getCustomer();
            transaction.getStore();
        }
    }

    /*filter order history*/

    /*sort order history*/
}
