package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.AddressRepository;
import capstone.rt04.retailbackend.repositories.TransactionLineItemRepository;
import capstone.rt04.retailbackend.repositories.TransactionRepository;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
import capstone.rt04.retailbackend.util.exceptions.customer.AddressNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionLineItemRepository transactionLineItemRepository;
    private final AddressRepository addressRepository;

    private final CustomerService customerService;
    private final ShoppingCartService shoppingCartService;

    public TransactionService(TransactionRepository transactionRepository, TransactionLineItemRepository transactionLineItemRepository, AddressRepository addressRepository, CustomerService customerService, ShoppingCartService shoppingCartService) {
        this.transactionRepository = transactionRepository;
        this.transactionLineItemRepository = transactionLineItemRepository;
        this.addressRepository = addressRepository;
        this.customerService = customerService;
        this.shoppingCartService = shoppingCartService;
    }

    /*create new transaction - not the actual one; simplified just for testing other use cases*/
    public Transaction testCreateNewTransaction(Transaction transaction) {
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

    public List<Transaction> retrieveCustomerTransactions(Long customerId) {
        List<Transaction> txns = transactionRepository.findAllByCustomer_CustomerId(customerId);
        lazyLoadTransaction(txns);
        return txns;
    }


    /*view order details*/
    public Transaction retrieveTransactionById(Long transactionId) throws TransactionNotFoundException {
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

    /*filterAndSort order history*/
    //sort by totalQuantity, finalTotalPrice. default: by latest transactions
    //filter by collection mode, delivery status, date range (based on createdDateTime)
    //dateTime must be in format 'YYYY-MM-DD hh:mm:ss'
    public List<Transaction> filterSortOrderHistory(Long customerId, CollectionModeEnum collectionMode, DeliveryStatusEnum deliveryStatus,
                                                    String startDate, String endDate, SortEnum sortEnum) {


        boolean matchCollectionMode, matchDeliveryStatus, matchDateRange;

        List<Transaction> transactionsToReturn = new ArrayList<>();
        List<Transaction> allTransactions = retrieveCustomerTransactions(customerId);

        for (Transaction transaction : allTransactions) {
            matchCollectionMode = false;
            matchDeliveryStatus = false;
            matchDateRange = false;


            //convert transaction timestamp into Date obj
            Timestamp transactionTimestamp = transaction.getCreatedDateTime();

            //check which criteria(s) have been selected
            if ((startDate != null && endDate != null)) {
                //isThereDateRange = true;
                Timestamp startTimestamp = Timestamp.valueOf(startDate);
                Timestamp endTimestamp = Timestamp.valueOf(endDate);
                if (transactionTimestamp.after(startTimestamp) && transactionTimestamp.before(endTimestamp)) {
                    matchDateRange = true;
                }
            }
            if (startDate != null && endDate == null) {
                Timestamp startTimestamp = Timestamp.valueOf(startDate);
                if (transactionTimestamp.after(startTimestamp)) {
                    matchDateRange = true;
                }
            }
            if (startDate == null && endDate != null) {
                Timestamp endTimestamp = Timestamp.valueOf(endDate);
                if (transactionTimestamp.before(endTimestamp)) {
                    matchDateRange = true;
                }
            }
            if (startDate == null && endDate == null) {
                matchDateRange = true;
            }

            if (collectionMode != null) {
                if (transaction.getCollectionMode() == collectionMode) {
                    matchCollectionMode = true;
                }
            } else {
                matchCollectionMode = true;
            }

            if (deliveryStatus != null) {
                if (transaction.getDeliveryStatus() == deliveryStatus) {
                    matchDeliveryStatus = true;
                }
            } else {
                matchDeliveryStatus = true;
            }

            if (matchCollectionMode && matchDateRange && matchDeliveryStatus) {
                transactionsToReturn.add(transaction);
            }

        }

        if (sortEnum == SortEnum.PRICE_LOW_TO_HIGH) {
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getFinalTotalPrice));
        } else if (sortEnum == SortEnum.PRICE_HIGH_TO_LOW) {
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getFinalTotalPrice).reversed());
        } else if (sortEnum == SortEnum.DATE_OLDEST_FIRST) {
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getTransactionId));
        } else if (sortEnum == SortEnum.DATE_NEWEST_FIRST) {
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getTransactionId).reversed());
        } else {
            //default sort by latest transaction
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getTransactionId).reversed());
        }

        lazyLoadTransaction(transactionsToReturn);
        return transactionsToReturn;
    }

    // TODO: Make this method reusable for in-store checkout
    // TODO: Add in address / promo code / discount to calculate final price?
    public Customer createNewTransaction(Long customerId, Long shoppingCartId, String cartType, Address deliveryAddress, Address billingAddress) throws CustomerNotFoundException, InvalidCartTypeException, AddressNotFoundException {
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        ShoppingCart shoppingCart = shoppingCartService.retrieveShoppingCart(customerId, cartType);

        Transaction transaction = new Transaction(customer);
        TransactionLineItem transactionLineItem;
        List<TransactionLineItem> transactionLineItems = new ArrayList<>();
        List<ShoppingCartItem> shoppingCartItems = new ArrayList<>(shoppingCart.getShoppingCartItems());
        Integer totalQuantity = 0;

        // Transferring to transaction line item
        for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
            transactionLineItem = new TransactionLineItem(shoppingCartItem.getProductVariant().getProduct().getPrice(),
                    shoppingCartItem.getQuantity(), null, shoppingCartItem.getProductVariant());
            totalQuantity += shoppingCartItem.getQuantity();
            transactionLineItemRepository.save(transactionLineItem);
            transactionLineItems.add(transactionLineItem);
        }

        //Address logic
        if (deliveryAddress.getAddressId() == null) {
            addressRepository.save(deliveryAddress);
            transaction.setDeliveryAddress(deliveryAddress);
        } else {
            Address txnDeliveryAddress = addressRepository.findById(deliveryAddress.getAddressId())
                    .orElseThrow(() -> new AddressNotFoundException("Address not found"));
            transaction.setDeliveryAddress(txnDeliveryAddress);
        }
        if (billingAddress.getAddressId() == null) {
            addressRepository.save(billingAddress);
            transaction.setBillingAddress(billingAddress);
        } else {
            Address txnBillingAddress = addressRepository.findById(billingAddress.getAddressId())
                    .orElseThrow(() -> new AddressNotFoundException("Address not found"));
            transaction.setBillingAddress(txnBillingAddress);
        }

        transaction.getTransactionLineItems().addAll(transactionLineItems);
        transaction.setInitialTotalPrice(shoppingCart.getInitialTotalAmount());
        // TODO: Add DISCOUNT / PROMOCODE Logic here, for now final = initial
        transaction.setFinalTotalPrice(shoppingCart.getInitialTotalAmount());
        transaction.setTotalQuantity(totalQuantity);
        transaction.setCollectionMode(CollectionModeEnum.DELIVERY);
        transaction.setDeliveryStatus(DeliveryStatusEnum.PROCESSING);
        transactionRepository.save(transaction);

        for (TransactionLineItem lineItem : transactionLineItems) {
            lineItem.setTransaction(transaction);
        }

        // Clear cart only when transaction is created successfully
        shoppingCartService.clearShoppingCart(customerId, cartType);


        return customer;
    }

}
