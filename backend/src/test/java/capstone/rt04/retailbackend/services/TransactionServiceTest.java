package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

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

    @Test
    public void createTransaction() throws Exception {
        Customer customer = new Customer("Amy", "Tan", "amytan@gmail.com", "amytan");
        Customer createdCustomer = customerService.createNewCustomer(customer);
        Transaction validTransaction1 = new Transaction(createdCustomer);
        validTransaction1.setCollectionMode(CollectionModeEnum.IN_STORE);
        Transaction transaction1 = transactionService.createNewTransaction(validTransaction1);
        transactionId1 = transaction1.getTransactionId();
        Transaction validTransaction2 = new Transaction(createdCustomer);
        validTransaction2.setDeliveryStatus(DeliveryStatusEnum.DELIVERED);
        Transaction transaction2 = transactionService.createNewTransaction(validTransaction2);
    }
    @Test
    public void retrieveOrderById() throws Exception {
        Transaction transaction = transactionService.retrieveTransactionById(transactionId1);
        assertThat(transaction.getTransactionId()).isEqualTo(transactionId1);
    }

    @Test
    public void retrievePastOrders() {
        List<Transaction> pastOrders = transactionService.retrievePastOrders();
        assertThat(pastOrders.size()).isEqualTo(2);
    }

}
