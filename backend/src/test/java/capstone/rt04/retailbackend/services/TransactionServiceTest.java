package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class TransactionServiceTest {

    @Autowired
    private TransactionService transactionService;
    @Autowired
    private CustomerService customerService;
    private static Long transactionId1;

    private static Long customerId;

    @Test
    public void createTransaction() throws Exception {
        Customer customer = new Customer("Amy", "Tan", "amytan@gmail.com", "amytan");
        Customer createdCustomer = customerService.createNewCustomer(customer);
        customerId = createdCustomer.getCustomerId();

        //CollectionMode: IN-STORE, totalQuantity: 4
        Transaction validTransaction1 = new Transaction(createdCustomer);
        validTransaction1.setCollectionMode(CollectionModeEnum.IN_STORE);
        validTransaction1.setTotalQuantity(4);
        Transaction transaction1 = transactionService.testCreateNewTransaction(validTransaction1);
        transactionId1 = transaction1.getTransactionId();

        //CollectionMode: DELIVERY, DeliveryStatus: DELIVERED, totalQuantity: 3
        Transaction validTransaction2 = new Transaction(createdCustomer);
        validTransaction2.setCollectionMode(CollectionModeEnum.DELIVERY);
        validTransaction2.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
        validTransaction2.setTotalQuantity(3);
        Transaction transaction2 = transactionService.testCreateNewTransaction(validTransaction2);

        //CollectionMode: DELIVERY, DeliveryStatus: IN-TRANSIT, totalQuantity: 2
        Transaction validTransaction3 = new Transaction(createdCustomer);
        validTransaction3.setCollectionMode(CollectionModeEnum.DELIVERY);
        validTransaction3.setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);
        validTransaction3.setTotalQuantity(2);
        Transaction transaction3 = transactionService.testCreateNewTransaction(validTransaction3);

        //CollectionMode: DELIVERY, DeliveryStatus: DELIVERED, totalQuantity: 5
        Transaction validTransaction4 = new Transaction(createdCustomer);
        validTransaction4.setCollectionMode(CollectionModeEnum.DELIVERY);
        validTransaction4.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
        validTransaction4.setTotalQuantity(5);
        Transaction transaction4 = transactionService.testCreateNewTransaction(validTransaction4);
    }

    @Test
    public void retrieveOrderById() throws Exception {
        Transaction transaction = transactionService.retrieveTransactionById(transactionId1);
        assertThat(transaction.getTransactionId()).isEqualTo(transactionId1);
    }

    @Test
    public void retrievePastOrders() {
        List<Transaction> pastOrders = transactionService.retrievePastOrders();
        assertThat(pastOrders.size()).isEqualTo(4);
    }

    @Test
    public void filterSortPastOrders() {

        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.set(2019, Calendar.DECEMBER, 9); //Year, month and day of month
        String startDate = "2019-12-09 00:00:00";
        List<Transaction> transactionsMatched = new ArrayList<>();

        //retrieve transaction which matches collectionMode
        transactionsMatched = transactionService.filterSortOrderHistory(customerId, CollectionModeEnum.IN_STORE, null, null, null, null);
        assertThat(transactionsMatched.size()).isEqualTo(1);

        //retrieve transaction which matches deliveryStatus
        transactionsMatched = transactionService.filterSortOrderHistory(customerId,null, DeliveryStatusEnum.DELIVERED, null, null, null);
        assertThat(transactionsMatched.size()).isEqualTo(2);

        //retrieve transaction which matches dateRange
        transactionsMatched = transactionService.filterSortOrderHistory(customerId,null, null, startDate, null, null);
        assertThat(transactionsMatched.size()).isEqualTo(4);

        //retrieve transaction which matches collectionMode & deliveryStatus
        transactionsMatched = transactionService.filterSortOrderHistory(customerId, CollectionModeEnum.DELIVERY, DeliveryStatusEnum.DELIVERED, null, null, null);
        assertThat(transactionsMatched.size()).isEqualTo(2);
        assertThat(transactionsMatched.get(0).getTotalQuantity()).isEqualTo(5);

        //retrieve transaction which matches collectionMode & deliveryStatus sorted by totalQuantity from LOW_TO_HIGH
        transactionsMatched = transactionService.filterSortOrderHistory(customerId, CollectionModeEnum.DELIVERY, DeliveryStatusEnum.DELIVERED, null, null, SortEnum.QUANTITY_LOW_TO_HIGH);
        assertThat(transactionsMatched.size()).isEqualTo(2);
        assertThat(transactionsMatched.get(0).getTotalQuantity()).isEqualTo(3);

        //retrieve transaction which matches collectionMode & dateRange
        transactionsMatched = transactionService.filterSortOrderHistory(customerId, CollectionModeEnum.DELIVERY, null, startDate, null, null);
        assertThat(transactionsMatched.size()).isEqualTo(3);

        //retrieve transaction which matches deliveryStatus & dateRange
        transactionsMatched = transactionService.filterSortOrderHistory(customerId, null, DeliveryStatusEnum.DELIVERED, startDate, null, null);
        assertThat(transactionsMatched.size()).isEqualTo(2);

        //retrieve transaction which matches collectionMode, deliveryStatus & dateRange
        transactionsMatched = transactionService.filterSortOrderHistory(customerId, CollectionModeEnum.DELIVERY, DeliveryStatusEnum.IN_TRANSIT, startDate, null, null);
        assertThat(transactionsMatched.size()).isEqualTo(1);
    }

}
