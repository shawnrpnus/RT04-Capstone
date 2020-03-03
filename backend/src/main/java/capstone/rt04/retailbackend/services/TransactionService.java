package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.TransactionLineItemRepository;
import capstone.rt04.retailbackend.repositories.TransactionRepository;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
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

    private final CustomerService customerService;
    private final ShoppingCartService shoppingCartService;

    public TransactionService(TransactionRepository transactionRepository, TransactionLineItemRepository transactionLineItemRepository, CustomerService customerService, ShoppingCartService shoppingCartService) {
        this.transactionRepository = transactionRepository;
        this.transactionLineItemRepository = transactionLineItemRepository;
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
    public List<Transaction> filterSortOrderHistory(CollectionModeEnum collectionMode, DeliveryStatusEnum deliveryStatus,
                                                    Date startDate, Date endDate, SortEnum sortEnum) {

        boolean matchCollectionMode, matchDeliveryStatus, matchDateRange;
        boolean isThereDateRange, isCollectionModeSelected, isDeliveryStatusSelected;

        List<Transaction> transactionsToReturn = new ArrayList<>();
        List<Transaction> allTransactions = transactionRepository.findAll();

        for (Transaction transaction : allTransactions) {
            matchCollectionMode = false;
            matchDeliveryStatus = false;
            matchDateRange = false;
            isThereDateRange = false;
            isCollectionModeSelected = false;
            isDeliveryStatusSelected = false;

            //convert transaction timestamp into Date obj
            Timestamp transactionTimestamp = transaction.getCreatedDateTime();
            Date transactionDate = new Date(transactionTimestamp.getTime());

            //check which criteria(s) have been selected
            if ((startDate != null && endDate != null) || (startDate != null && endDate == null)) {
                isThereDateRange = true;
                if (startDate != null && endDate != null) {
                    if (transactionDate.compareTo(startDate) >= 0 && transactionDate.compareTo(endDate) <= 0) {
                        matchDateRange = true;
                    }
                }
                if (startDate != null && endDate == null) {
                    if (transactionDate.compareTo(startDate) >= 0) {
                        matchDateRange = true;
                    }
                }
            }
            if (collectionMode != null) {
                isCollectionModeSelected = true;
                if (transaction.getCollectionMode() == collectionMode) {
                    matchCollectionMode = true;
                }
            }
            if (deliveryStatus != null) {
                isDeliveryStatusSelected = true;
                if (transaction.getDeliveryStatus() == deliveryStatus) {
                    matchDeliveryStatus = true;
                }
            }

            //only filter by date
            if (isThereDateRange && !isCollectionModeSelected && !isDeliveryStatusSelected) {
                if (matchDateRange) {
                    transactionsToReturn.add(transaction);
                }
            }

            //only filter by collection mode
            if (isCollectionModeSelected && !isThereDateRange && !isDeliveryStatusSelected) {
                if (matchCollectionMode) {
                    transactionsToReturn.add(transaction);
                }
            }

            //only filter by delivery status
            if (isDeliveryStatusSelected && !isThereDateRange && !isCollectionModeSelected) {
                if (matchDeliveryStatus) {
                    transactionsToReturn.add(transaction);
                }
            }

            //filter by date & collection mode
            if (isCollectionModeSelected && isThereDateRange && !isDeliveryStatusSelected) {
                if (matchCollectionMode && matchDateRange) {
                    transactionsToReturn.add(transaction);
                }
            }

            //filter by date & delivery status
            if (isDeliveryStatusSelected && isThereDateRange && !isCollectionModeSelected) {
                if (matchDeliveryStatus && matchDateRange) {
                    transactionsToReturn.add(transaction);
                }
            }

            //filter by collection mode & delivery status
            if (isCollectionModeSelected && isDeliveryStatusSelected && !isThereDateRange) {
                if (matchCollectionMode && matchDeliveryStatus) {
                    transactionsToReturn.add(transaction);
                }
            }

            //filter by date, collection mode & delivery status
            if (isCollectionModeSelected && isDeliveryStatusSelected && isThereDateRange) {
                if (matchCollectionMode && matchDeliveryStatus && matchDateRange) {
                    transactionsToReturn.add(transaction);
                }
            }
        }

        if (sortEnum == SortEnum.PRICE_LOW_TO_HIGH) {
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getFinalTotalPrice));
        } else if (sortEnum == SortEnum.PRICE_HIGH_TO_LOW) {
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getFinalTotalPrice).reversed());
        } else if (sortEnum == SortEnum.QUANTITY_LOW_TO_HIGH) {
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getTotalQuantity));
        } else if (sortEnum == SortEnum.QUANTITY_HIGH_TO_LOW) {
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getTotalQuantity).reversed());
        } else {
            //default sort by latest transaction
            Collections.sort(transactionsToReturn, Comparator.comparing(Transaction::getTransactionId).reversed());
        }

        lazyLoadTransaction(transactionsToReturn);
        transactionsToReturn.toString();
        return transactionsToReturn;
    }

    public Customer createNewTransaction(Long customerId, Long shoppingCartId, String cartType) throws CustomerNotFoundException, InvalidCartTypeException {
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

        transaction.getTransactionLineItems().addAll(transactionLineItems);
        transaction.setInitialTotalPrice(shoppingCart.getInitialTotalAmount());
        transaction.setTotalQuantity(totalQuantity);
        transaction.setCollectionMode(CollectionModeEnum.DELIVERY);
        transactionRepository.save(transaction);

        for(TransactionLineItem lineItem : transactionLineItems) {
            lineItem.setTransaction(transaction);
        }

        // Clear cart only when transaction is created successfully
        shoppingCartService.clearShoppingCart(customerId, cartType);

        return customer;
    }

}
