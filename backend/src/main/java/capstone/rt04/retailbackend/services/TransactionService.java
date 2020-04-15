package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.AddressRepository;
import capstone.rt04.retailbackend.repositories.TransactionLineItemRepository;
import capstone.rt04.retailbackend.repositories.TransactionRepository;
import capstone.rt04.retailbackend.response.analytics.SalesByDay;
import capstone.rt04.retailbackend.util.Constants;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
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
import com.stripe.model.PaymentMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
@Slf4j
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
        return pastOrders;
    }

    public List<Transaction> retrieveCustomerTransactions(Long customerId) {
        List<Transaction> txns = transactionRepository.findAllByCustomer_CustomerId(customerId);
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

    /*view order details*/
    public Transaction retrieveTransactionByQRCode(Long transactionId, Long storeId) throws TransactionNotFoundException {
        Transaction transaction = retrieveTransactionById(transactionId);

        if (transaction.getStoreToCollect() == null) {
            throw new TransactionNotFoundException("Collection Mode is not In-Store!");
        }
        if (!transaction.getStoreToCollect().getStoreId().equals(storeId)) {
            throw new TransactionNotFoundException("Wrong Store! Please collect at: " + transaction.getStoreToCollect().getStoreName());
        }
        return transaction;
    }

    public TransactionLineItem retrieveTransactionLineItemById(Long transactionLineItemId) throws TransactionNotFoundException {
        if (transactionLineItemId == null) {
            throw new TransactionNotFoundException("Transaction Line Item ID not provided");
        }

        TransactionLineItem transactionLineItem = transactionLineItemRepository.findById(transactionLineItemId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction Line Item ID " + transactionLineItemId + " does not exist"));


        return transactionLineItem;
    }

    /*retrieve transaction by the order number*/
    public Transaction retrieveTransactionByOrderNumber(String orderNumber) throws TransactionNotFoundException {
        if (orderNumber.isEmpty()) {
            throw new TransactionNotFoundException("Transaction Order Number is not provided");
        }

        Transaction transaction = transactionRepository.findByOrderNumber(orderNumber);

        if (transaction == null) {
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

    /*
    (1) Buy in store, collect in store: storeId == storeToCollectId, collectionModeEnum == IN_STORE
    (2) Buy in store, deliver home: storeId != null, storeToCollectId == null, collectionModeEnum == DELIVERY
    (3) Buy online, collect in store: storeId == null, storeToCollectId != null, collectionModeEnum == IN_STORE
    (4) Buy online, deliver home: storeId == null, storeToCollectId == null, collectionModeEnum == DELIVERY
    */
    public Transaction createNewTransaction(Long customerId, Long storeId, String cartType, Address deliveryAddress,
                                            Address billingAddress, Long storeToCollectId, Long promoCodeId,
                                            CollectionModeEnum collectionModeEnum, String cardIssuer, String cardLast4,
                                            String paymentMethodId) throws CustomerNotFoundException, InvalidCartTypeException, AddressNotFoundException, StoreNotFoundException, PromoCodeNotFoundException, StripeException {
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
            transactionLineItem = new TransactionLineItem(shoppingCartItem.getProductVariant().getProduct().getPrice().multiply(quantity).setScale(2, BigDecimal.ROUND_HALF_UP),
                    shoppingCartItem.getQuantity(), null, shoppingCartItem.getProductVariant());
            //TODO: Update final subtotal based on discount and promo code

            for (Discount discount : shoppingCartItem.getProductVariant().getProduct().getDiscounts()) {
                finalPrice = productService.applyDiscount(discount, shoppingCartItem.getProductVariant().getProduct(), null);
                if (finalPrice != null) {
                    transactionLineItem.setFinalSubTotal(finalPrice.multiply(quantity).setScale(2, BigDecimal.ROUND_HALF_UP));
                    break;
                } else {
                    transactionLineItem.setFinalSubTotal(null);
                }
            }

            totalQuantity += shoppingCartItem.getQuantity();
            transactionLineItemRepository.save(transactionLineItem);
            transactionLineItems.add(transactionLineItem);
        }

        //Deducting appropriate stock
        for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
            // Looping through product stock of the selected product variant to find warehouse stock
            for (ProductStock productStock : shoppingCartItem.getProductVariant().getProductStocks()) {
                if ((collectionModeEnum.equals(CollectionModeEnum.DELIVERY) || storeId == null)
                        && productStock.getWarehouse() != null) { //cover all except buy & collect in store
                    // Deduct from warehouse
                    //System.out.println("Deduct from warehouse");
                    productStock.setQuantity(productStock.getQuantity() - shoppingCartItem.getQuantity());
                } else if (collectionModeEnum.equals(CollectionModeEnum.IN_STORE) &&
                        productStock.getStore() != null &&
                        productStock.getStore().getStoreId().equals(storeId)) {
                    // Deduct from the correct store ONLY when buying in store
//                    System.out.println("Deduct from db store ID: " + productStock.getStore().getStoreId() + " - pass in store ID "
//                            + storeId);
                    productStock.setQuantity(productStock.getQuantity() - shoppingCartItem.getQuantity());
                }
            }
        }

        //Address logic
        if (deliveryAddress != null) {
            if (deliveryAddress.getAddressId() == null) {
                addressRepository.save(deliveryAddress);
                transaction.setDeliveryAddress(deliveryAddress);
            } else {
                Address txnDeliveryAddress = addressRepository.findById(deliveryAddress.getAddressId())
                        .orElseThrow(() -> new AddressNotFoundException("Address not found"));
                transaction.setDeliveryAddress(txnDeliveryAddress);
            }
        }
        if (billingAddress != null) {
            if (billingAddress.getAddressId() == null) {
                addressRepository.save(billingAddress);
                transaction.setBillingAddress(billingAddress);
            } else {
                Address txnBillingAddress = addressRepository.findById(billingAddress.getAddressId())
                        .orElseThrow(() -> new AddressNotFoundException("Address not found"));
                transaction.setBillingAddress(txnBillingAddress);
            }
        }

        // Store to collect for self-pickup after online purchase
        if (storeToCollectId != null) {
            Store store = storeService.retrieveStoreById(storeToCollectId);
            transaction.setStoreToCollect(store);
        }

        //the store where the transaction was made (via mobile app)
        if (storeId != null) {
            Store storeBoughtAt = storeService.retrieveStoreById(storeId);
            transaction.setStore(storeBoughtAt);
        }

        transaction.getTransactionLineItems().addAll(transactionLineItems);
        transaction.setInitialTotalPrice(shoppingCart.getFinalTotalAmount());

        // Promo Code
        if (promoCodeId != null) {
            PromoCode promoCode = promoCodeService.retrievePromoCodeById(promoCodeId);
            if (!customer.getUsedPromoCodes().contains(promoCode)) {
                if (promoCode.getFlatDiscount() != null && promoCode.getFlatDiscount().compareTo(BigDecimal.ZERO) != 0) {
                    transaction.setFinalTotalPrice(shoppingCart.getFinalTotalAmount().subtract(promoCode.getFlatDiscount()));
                } else if (promoCode.getPercentageDiscount() != null && promoCode.getPercentageDiscount().compareTo(BigDecimal.ZERO) != 0) {
                    transaction.setFinalTotalPrice(shoppingCart.getFinalTotalAmount().multiply(BigDecimal.ONE.subtract(
                            promoCode.getPercentageDiscount().divide(BigDecimal.valueOf(100)))).setScale(2, BigDecimal.ROUND_HALF_UP));
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
        if (cardIssuer == null || cardLast4 == null) {
            PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
            PaymentMethod.Card card = paymentMethod.getCard();
            transaction.setCardIssuer(card.getBrand());
            transaction.setCardLast4(card.getLast4());
        } else {
            transaction.setCardIssuer(cardIssuer);
            transaction.setCardLast4(cardLast4);
        }
        //Collection mode - IN_STORE or DELIVERY
        transaction.setCollectionMode(collectionModeEnum);
        transaction.setDeliveryStatus(DeliveryStatusEnum.TO_BE_DELIVERED);
        Transaction savedTransaction = transactionRepository.save(transaction);

        for (TransactionLineItem lineItem : transactionLineItems) {
            lineItem.setTransaction(savedTransaction);
        }
        // Clear cart only when transaction is created successfully
        shoppingCartService.clearShoppingCart(customerId, cartType);

        return savedTransaction;
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

    public Transaction confirmReceivedTransaction(Long transactionId) throws TransactionNotFoundException {
        Transaction transaction = retrieveTransactionById(transactionId);
        if (!transaction.getCollectionMode().equals(CollectionModeEnum.IN_STORE)) {
            throw new TransactionNotFoundException("Collection Mode is not In-Store!");
        }
        if (!transaction.getDeliveryStatus().equals(DeliveryStatusEnum.READY_FOR_COLLECTION)) {
            throw new TransactionNotFoundException("Transaction " + transaction.getOrderNumber() + " not ready for collection");
        }
        transaction.setDeliveryStatus(DeliveryStatusEnum.COLLECTED);

        return transaction;
    }

    public List<Transaction> retrieveAllTransaction() {
        List<Transaction> transactions = transactionRepository.findAll();
        lazyLoadTransaction(transactions);
        return transactions;
    }

    public List<Transaction> retrieveAllTransactionsByStoreId(Long storeId) {
        List<Transaction> transactions = retrieveAllTransaction();
        List<Transaction> transactionsForStoreOrWarehouse = new ArrayList<>();
        if (storeId != null) {
            transactionsForStoreOrWarehouse = transactionRepository.findAllByStore_StoreId(storeId);
        } else {
            //warehouse [online purchase]
            for (Transaction t : transactions) {
                if (t.getStore() == null) {
                    transactionsForStoreOrWarehouse.add(t);
                }
            }
        }
        lazyLoadTransaction(transactionsForStoreOrWarehouse);
        return transactionsForStoreOrWarehouse;
    }

    public List<Transaction> retrieveAllTransactionsByStoreToCollectId(Long storeToCollectId) {
        List<Transaction> transactions = retrieveAllTransaction();
        List<Transaction> transactionsForStoreOrWarehouse = new ArrayList<>();
        if (storeToCollectId != null) {
            transactionsForStoreOrWarehouse = transactionRepository.findAllByStoreToCollect_StoreId(storeToCollectId);
        } else {
            //warehouse [delivery]
            for (Transaction t : transactions) {
                if (t.getCollectionMode() == CollectionModeEnum.DELIVERY) {
                    transactionsForStoreOrWarehouse.add(t);
                }
            }
        }
        lazyLoadTransaction(transactionsForStoreOrWarehouse);

        return transactionsForStoreOrWarehouse;
    }

    public List<Transaction> getCustomerInStoreTransactions(Long customerId) {
        List<Transaction> inStoreTxns = transactionRepository.findAllByCustomer_CustomerIdAndStoreIsNotNull(customerId);
        lazyLoadTransaction(inStoreTxns);
        return inStoreTxns;
    }

    public List<Transaction> getCustomerInStoreCollectionTransactions(Long customerId) {
        List<Transaction> txns = transactionRepository.findAllByCustomer_CustomerIdAndStoreIsNullAndStoreToCollectIsNotNull(customerId);
        lazyLoadTransaction(txns);
        return txns;
    }

    public void generateTestTransactions(Integer numTxns) throws AddressNotFoundException, StripeException, InvalidCartTypeException, CustomerNotFoundException, PromoCodeNotFoundException, StoreNotFoundException, InputDataValidationException, ProductVariantNotFoundException, InsufficientStockException {
        Random r = new Random();
        // 4 types of transactions
        List<Customer> allCustomers = customerService.retrieveAllCustomers();
        List<ProductVariant> productVariants = productService.retrieveAllProductVariant();
        List<Store> stores = storeService.retrieveAllStores();

        Address address = new Address("Residential College 4", null, "138614",
                "NUS RC4", "1.306610", "103.773840");

        for (int i = 0; i < numTxns; i++) {
            // Random customer
            Customer customer = allCustomers.get(r.nextInt(allCustomers.size()));

            int onlineOrInstore = r.nextInt(2); // 0 for online, 1 for in-store
            int collectOrDeliver = r.nextInt(2); // 0 for collect, 1 for deliver
            int numProductVariants = r.nextInt(5) + 1;

            List<Address> addresses = customer.getShippingAddresses();
            if (addresses == null || addresses.size() == 0) {
                customer = customerService.addShippingAddress(customer.getCustomerId(), address);
                address = customer.getShippingAddresses().get(0);
            } else {
                address = customer.getShippingAddresses().get(0);
            }

            if (onlineOrInstore == 0) { //ONLINE
                // Update ONLINE shopping cart with random num of items
                for (int p = 0; p < numProductVariants; p++) {
                    ProductVariant pv = productVariants.get(r.nextInt(productVariants.size()));

                    customer = shoppingCartService.updateQuantityOfProductVariant(r.nextInt(2) + 1,
                            pv.getProductVariantId(), customer.getCustomerId(), Constants.ONLINE_SHOPPING_CART);

                }
                // Either collect in store, or deliver home
                if (collectOrDeliver == 0) { //collect
                    // (3) Buy online, collect in store: storeId == null, storeToCollectId != null,
                    // collectionModeEnum == IN_STORE
                    Transaction t = createNewTransaction(customer.getCustomerId(), null, Constants.ONLINE_SHOPPING_CART,
                            address, address, stores.get(r.nextInt(stores.size())).getStoreId(),
                            null, CollectionModeEnum.IN_STORE, "Visa", "4242", null);
                    t.setDeliveryStatus(DeliveryStatusEnum.COLLECTED);
                } else { //deliver
                    // (4) Buy online, deliver home: storeId == null, storeToCollectId == null, collectionModeEnum == DELIVERY
                    Transaction t = createNewTransaction(customer.getCustomerId(), null, Constants.ONLINE_SHOPPING_CART,
                            address, address, null,
                            null, CollectionModeEnum.DELIVERY, "Visa", "4242", null);
                    t.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
                }

            } else { //IN-STORE
                // Update IN-STORE shopping cart
                Store store = stores.get(r.nextInt(stores.size()));
                for (int p2 = 0; p2 < numProductVariants; p2++) {
                    ProductVariant pv = productVariants.get(r.nextInt(productVariants.size()));

                    customer = shoppingCartService.updateQuantityOfProductVariantWithStore(r.nextInt(2) + 1,
                            pv.getProductVariantId(), customer.getCustomerId(), store.getStoreId());

                }
                // Either collect in store, or deliver home
                Long storeId = stores.get(r.nextInt(stores.size())).getStoreId();
                if (collectOrDeliver == 0) { //collect
                    // (1) Buy in store, collect in store: storeId == storeToCollectId, collectionModeEnum == IN_STORE
                    Transaction t = createNewTransaction(customer.getCustomerId(), storeId, Constants.IN_STORE_SHOPPING_CART,
                            address, address, storeId,
                            null, CollectionModeEnum.IN_STORE, "Visa", "4242", null);
                    t.setDeliveryStatus(DeliveryStatusEnum.COLLECTED);
                } else { //deliver
                    // (2) Buy in store, deliver home: storeId != null, storeToCollectId == null, collectionModeEnum == DELIVERY
                    Transaction t = createNewTransaction(customer.getCustomerId(), storeId, Constants.IN_STORE_SHOPPING_CART,
                            address, address, null,
                            null, CollectionModeEnum.DELIVERY, "Visa", "4242", null);
                    t.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
                }
            }
        }
    }

    //Strings must be YYYY-MM-DD
    public List<SalesByDay> retrieveSalesByDayWithParameters(String fromDateString, String toDateString, List<Long> fromStoreIds, Boolean onlineSelected) {
        List<SalesByDay> result = new ArrayList<>();
        List<Transaction> allTransactions = transactionRepository.findAllByOrderByCreatedDateTime();

        SalesByDay salesForDay = new SalesByDay();
        LocalDate earliestTransactionDate = allTransactions.get(0).getCreatedLocalDate();
        LocalDate latestTransactionDate = allTransactions.get(allTransactions.size() - 1).getCreatedLocalDate();
        salesForDay.setDate(earliestTransactionDate);
        for (Transaction transaction : allTransactions) {
            //date not in range --> exclude
            if (!transaction.isBetween(fromDateString, toDateString)) continue;

            // if stores are selected, and my transaction's store is not inside, don't include
            if (fromStoreIds != null
                    && transaction.getStore() != null
                    && !fromStoreIds.contains(transaction.getStore().getStoreId())) continue;

            //if online is FALSE, and my transaction is made online, don't include
            if (onlineSelected != null && !onlineSelected && transaction.getStore() == null) continue;


            LocalDate transactionDate = transaction.getCreatedLocalDate();
            if (!salesForDay.getDate().isEqual(transactionDate)) {
                //if different date and have transactions, calculate average, then add old object to the result
                if (salesForDay.getTotalTransactions() > 0) {
                    //salesForDay.calculateAverageTotalSales();
                    addZeroValues(salesForDay, fromStoreIds, onlineSelected);
                    result.add(salesForDay.createCopy());
                }
                //create new object to be tracked outside loop
                salesForDay = new SalesByDay();
                salesForDay.setDate(transactionDate);
            }
            //if same date, just add to total and increment num transactions
            salesForDay.addToTotalSales(transaction.getFinalTotalPrice());
            salesForDay.incrementTotalTransactions();
            salesForDay.calculateAverageTotalSales();
            if (transaction.getStore() != null) {
                salesForDay.addTotalSalesForStore(transaction.getStore().getStoreId(), transaction.getFinalTotalPrice());
                salesForDay.incrementTotalTransactionsForStore(transaction.getStore().getStoreId());
                salesForDay.calculateAverageTotalSalesForStore(transaction.getStore().getStoreId());
            } else {
                salesForDay.addTotalSalesForOnline(transaction.getFinalTotalPrice());
                salesForDay.incrementTotalTransactionsForOnline();
                salesForDay.calculateAverageTotalSalesForOnline();
            }
        }
        // add the last salesForDay (since in the loop is only added when date changes)
        if (salesForDay.getTotalTransactions() > 0) {
            //salesForDay.calculateAverageTotalSales();
            addZeroValues(salesForDay, fromStoreIds, onlineSelected);
            result.add(salesForDay.createCopy());
        }

        //fill in empty dates
        List<LocalDate> dateList = generateDateList(fromDateString, toDateString, earliestTransactionDate, latestTransactionDate);
        int currDateIndex = 0;
        int currResultIndex = 0;
        while (currDateIndex < dateList.size()) {
            LocalDate currDate = dateList.get(currDateIndex);
            if (currResultIndex < result.size()) {
                //dates within earliest & latest transaction dates
                SalesByDay currElement = result.get(currResultIndex);
                if (!currElement.getDate().isEqual(currDate)) {
                    SalesByDay emptySalesByDay = new SalesByDay();
                    emptySalesByDay.setDate(currDate);
                    addZeroValues(emptySalesByDay, fromStoreIds, onlineSelected);
                    result.add(currResultIndex, emptySalesByDay);
                }
            } else {
                //dates extending past latest transaction date
                SalesByDay emptySalesByDay = new SalesByDay();
                emptySalesByDay.setDate(currDate);
                addZeroValues(emptySalesByDay, fromStoreIds, onlineSelected);
                result.add(emptySalesByDay);
            }
            currDateIndex++;
            currResultIndex++;

        }
        return result;
    }

    private void addZeroValues(SalesByDay salesForDay, List<Long> storeIds, Boolean onlineSelected) {
        Map<String, Object> pointOfPurchaseData = salesForDay.getPointOfPurchaseData();
        if (storeIds == null) {
            storeIds = new ArrayList<>();
            List<Store> stores = storeService.retrieveAllStores();
            for (Store s : stores) {
                storeIds.add(s.getStoreId());
            }
        }

        for (Long storeId : storeIds) {
            String totalSalesKey = storeId + "-totalSales";
            String totalTransactionsKey = storeId + "-totalTransactions";
            String avgKey = storeId + "-averageTotalSales";
            if (pointOfPurchaseData.get(totalSalesKey) == null) {
                pointOfPurchaseData.put(totalSalesKey, BigDecimal.ZERO);
                pointOfPurchaseData.put(totalTransactionsKey, 0);
                pointOfPurchaseData.put(avgKey, BigDecimal.ZERO);
            }
        }

        if ((onlineSelected == null || onlineSelected) && pointOfPurchaseData.get("online-totalSales") == null) {
            String totalSalesKey = "online-totalSales";
            String totalTransactionsKey = "online-totalTransactions";
            String avgKey = "online-averageTotalSales";
            pointOfPurchaseData.put(totalSalesKey, BigDecimal.ZERO);
            pointOfPurchaseData.put(totalTransactionsKey, 0);
            pointOfPurchaseData.put(avgKey, BigDecimal.ZERO);
        }
    }

    private List<LocalDate> generateDateList(String fromDateString, String toDateString, LocalDate earliestTransactionDate, LocalDate latestTransactionDate) {
        List<LocalDate> dateList;
        if (!(fromDateString == null && toDateString == null)) {
            if (fromDateString != null && toDateString == null) {
                dateList = generateLocalDateInterval(LocalDate.parse(fromDateString), latestTransactionDate);
            } else if (fromDateString == null) { //only haveToDateString
                dateList = generateLocalDateInterval(earliestTransactionDate, LocalDate.parse(toDateString));
            } else { //have both
                dateList = generateLocalDateInterval(LocalDate.parse(fromDateString), LocalDate.parse(toDateString));
            }
        } else {
            dateList = generateLocalDateInterval(earliestTransactionDate, latestTransactionDate);
        }
        return dateList;
    }

    private List<LocalDate> generateLocalDateInterval(LocalDate fromDate, LocalDate toDate) {
        List<LocalDate> result = new ArrayList<>();
        for (LocalDate date = fromDate; date.isBefore(toDate) || date.isEqual(toDate); date = date.plusDays(1)) {
            log.info(date.toString());
            result.add(date);
        }
        return result;
    }
}
