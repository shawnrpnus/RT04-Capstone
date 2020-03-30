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
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionLineItemRepository transactionLineItemRepository;
    private final AddressRepository addressRepository;

    private final StoreService storeService;
    private final ProductService productService;
    private final CustomerService customerService;
    private final PromoCodeService promoCodeService;
    private final ShoppingCartService shoppingCartService;

    public TransactionService(TransactionRepository transactionRepository, TransactionLineItemRepository transactionLineItemRepository,
                              AddressRepository addressRepository, StoreService storeService, CustomerService customerService,
                              ShoppingCartService shoppingCartService, @Lazy ProductService productService, PromoCodeService promoCodeService) {
        this.transactionRepository = transactionRepository;
        this.transactionLineItemRepository = transactionLineItemRepository;
        this.addressRepository = addressRepository;
        this.storeService = storeService;
        this.customerService = customerService;
        this.shoppingCartService = shoppingCartService;
        this.productService = productService;
        this.promoCodeService = promoCodeService;
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

    public List<Transaction> retrieveInstoreCollectionTransaction() {
        List<Transaction> txns = transactionRepository.findAllByStoreToCollectIsNotNullAndDeliveryStatusEquals(DeliveryStatusEnum.PROCESSING);
        lazyLoadTransaction(txns);
        return txns;
    }

    public List<Transaction> retrieveTransactionsToBeDelivered() {
        List<Transaction> txns = transactionRepository.findAllByDeliveryStatusEquals(DeliveryStatusEnum.TO_BE_DELIVERED);
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

    public TransactionLineItem retrieveTransactionLineItemById(Long transactionLineItemId) throws TransactionNotFoundException {
        if(transactionLineItemId == null) {
            throw new TransactionNotFoundException("Transaction Line Item ID not provided");
        }

        TransactionLineItem transactionLineItem = transactionLineItemRepository.findById(transactionLineItemId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction Line Item ID " + transactionLineItemId + " does not exist"));


        return transactionLineItem;
    }

    /*retrieve transaction by the order number*/
    public Transaction retrieveTransactionByOrderNumber(String orderNumber) throws TransactionNotFoundException {
        if(orderNumber.isEmpty()) {
            throw new TransactionNotFoundException("Transaction Order Number is not provided");
        }

        Transaction transaction = transactionRepository.findByOrderNumber(orderNumber);

        if(transaction == null) {
            throw new TransactionNotFoundException("Transaction with Order Number " + orderNumber + " does not exist!");
        }
//        List<Transaction> transactions = new ArrayList<>();
//        transactions.add(transaction);
//        lazyLoadTransaction(transactions);

        transaction.getCustomer().getCustomerId();

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
    public Customer createNewTransaction(Long customerId, Long storeId, String cartType, Address deliveryAddress,
                                         Address billingAddress, Long storeToCollectId, Long promoCodeId) throws CustomerNotFoundException, InvalidCartTypeException, AddressNotFoundException, StoreNotFoundException, PromoCodeNotFoundException {
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        ShoppingCart shoppingCart = shoppingCartService.retrieveShoppingCart(customerId, cartType);

        Transaction transaction = new Transaction(customer);
        TransactionLineItem transactionLineItem;
        List<TransactionLineItem> transactionLineItems = new ArrayList<>();
        List<ShoppingCartItem> shoppingCartItems = new ArrayList<>(shoppingCart.getShoppingCartItems());
        Integer totalQuantity = 0;
        BigDecimal finalPrice;
        BigDecimal quantity;

        // Transferring to transaction line item
        for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
            quantity = new BigDecimal(shoppingCartItem.getQuantity());
            transactionLineItem = new TransactionLineItem(shoppingCartItem.getProductVariant().getProduct().getPrice().multiply(quantity),
                    shoppingCartItem.getQuantity(), null, shoppingCartItem.getProductVariant());
            //TODO: Update final subtotal based on discount and promo code

            for (Discount discount : shoppingCartItem.getProductVariant().getProduct().getDiscounts()) {
                finalPrice = productService.applyDiscount(discount, shoppingCartItem.getProductVariant().getProduct(), null);
                if (finalPrice != null) {
                    transactionLineItem.setFinalSubTotal(finalPrice.multiply(quantity));
                    break;
                } else {
                    transactionLineItem.setFinalSubTotal(transactionLineItem.getInitialSubTotal());
                }
            }

            totalQuantity += shoppingCartItem.getQuantity();
            transactionLineItemRepository.save(transactionLineItem);
            transactionLineItems.add(transactionLineItem);
        }

        // Get from warehouse
        for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
            // Looping through product stock of the selected product variant to find warehouse stock
            for (ProductStock productStock : shoppingCartItem.getProductVariant().getProductStocks()) {
                if (storeId == null && productStock.getWarehouse() != null) {
                    // Deduct from warehouse
                    System.out.println("Deduct from warehouse");
                    productStock.setQuantity(productStock.getQuantity() - 1);
                } else if (storeId != null && productStock.getStore().getStoreId() != storeId) {
                    // Deduct from the correct store
                    System.out.println("Deduct from db store ID: " + productStock.getStore().getStoreId() + " - pass in store ID "
                            + storeId);
                    productStock.setQuantity(productStock.getQuantity() - 1);
                }
            }
        }

        //Address logic
        if (deliveryAddress != null && billingAddress != null) {
            if (deliveryAddress != null && deliveryAddress.getAddressId() == null) {
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
        }

        if (storeToCollectId != null) {
            Store store = storeService.retrieveStoreById(storeToCollectId);
            transaction.setStoreToCollect(store);
            transaction.setCollectionMode(CollectionModeEnum.IN_STORE);
        } else {
            transaction.setCollectionMode(CollectionModeEnum.DELIVERY);
        }

        transaction.getTransactionLineItems().addAll(transactionLineItems);
        transaction.setInitialTotalPrice(shoppingCart.getFinalTotalAmount());

        if (promoCodeId != null) {
            PromoCode promoCode = promoCodeService.retrievePromoCodeById(promoCodeId);
            if (!customer.getUsedPromoCodes().contains(promoCode)) {
                if (promoCode.getFlatDiscount().compareTo(BigDecimal.ZERO) != 0) {
                    transaction.setFinalTotalPrice(shoppingCart.getFinalTotalAmount().subtract(promoCode.getFlatDiscount()));
                } else if (promoCode.getPercentageDiscount().compareTo(BigDecimal.ZERO) != 0) {
                    transaction.setFinalTotalPrice(shoppingCart.getFinalTotalAmount().multiply(BigDecimal.ONE.subtract(
                            promoCode.getPercentageDiscount().divide(BigDecimal.valueOf(100)))));
                }
                customer.getUsedPromoCodes().add(promoCode);
                promoCode.getTransactions().add(transaction);
                promoCode.setNumRemaining(promoCode.getNumRemaining() - 1);
                transaction.setPromoCode(promoCode);
            } else {
                transaction.setFinalTotalPrice(shoppingCart.getFinalTotalAmount());
            }
        } else {
            transaction.setFinalTotalPrice(shoppingCart.getFinalTotalAmount());
        }

        transaction.setTotalQuantity(totalQuantity);
        transaction.setDeliveryStatus(DeliveryStatusEnum.TO_BE_DELIVERED);
        transactionRepository.save(transaction);

        for (TransactionLineItem lineItem : transactionLineItems) {
            lineItem.setTransaction(transaction);
        }

        // Clear cart only when transaction is created successfully
        shoppingCartService.clearShoppingCart(customerId, cartType);


        return customer;
    }

    public List<Transaction> receiveTransactionThroughDelivery(List<Long> transactionIds) throws TransactionNotFoundException {
        Transaction transaction;
        for (Long transactionId : transactionIds) {
            transaction = retrieveTransactionById(transactionId);
            if (transaction.getCollectionMode().equals(CollectionModeEnum.IN_STORE)) {
                transaction.setDeliveryStatus(DeliveryStatusEnum.READY_FOR_COLLECTION);
            } else {
                transaction.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
            }
        }
        return retrieveTransactionsToBeDelivered();
    }
}
