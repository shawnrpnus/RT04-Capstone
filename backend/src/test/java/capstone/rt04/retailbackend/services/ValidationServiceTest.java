package capstone.rt04.retailbackend.services;


import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Customer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ValidationServiceTest {

    @Autowired
    private ValidationService validationService;

    @Test
    public void testGenerateErrorMap() throws Exception {
        System.out.println("generateErrorMap");
        Category entity = new Category();
        Customer customer = new Customer("FirstName", "LastName", "Invalid@EmaiL@Com", "password");

        Map<String, String> expResult = new HashMap<>();
        expResult.put("name", "Category must have a name");
        Map<String, String> result = validationService.generateErrorMap(entity);
        assertThat(result).isEqualTo(expResult);

        Map<String, String> expResult2 = new HashMap<>();
        expResult2.put("email", "Email format is invalid");
        result = validationService.generateErrorMap(customer);
        assertThat(result).isEqualTo(expResult2);
    }
}
