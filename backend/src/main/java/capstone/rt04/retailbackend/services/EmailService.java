package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Customer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@Slf4j
public class EmailService {

    @Value("${node.backend.url}")
    private String NODE_API_URL;
    private RestTemplate restTemplate;

    private final CustomerService customerService;

    public EmailService(@Lazy CustomerService customerService) {
        this.customerService = customerService;
    }

    public void massSendPromotionalEmail(String subject, String content, String instruction, String buttonText, String link) {
        List<Customer> customers = customerService.retrieveAllCustomers();
        String emails = "";
        restTemplate = new RestTemplate();
        Integer index = 0;
        for (Customer customer : customers) {
            index += 1;
            emails += customer.getEmail();
            if (index < customers.size()) emails += ",";
        }
        Map<String, String> request = new HashMap<>();
        request.put("subject", subject);
        request.put("emails", emails);
        request.put("intro", content); // intro == content : string / string[]
        request.put("instructions", instruction);
        request.put("buttonText", buttonText);
        request.put("link", link);

        String endpoint = NODE_API_URL + "/email/massSendEmail";
        ResponseEntity<?> response = restTemplate.postForEntity(endpoint, request, Object.class);
        if (response.getStatusCode().equals(HttpStatus.OK)) {
            log.info("Email sent successfully sent!");
        } else {
            log.error("Error sending email");
            throw new Error("Error sending email");
        }
    }

    public void triggerPushNotificationForPromotion() {

    }

}
