package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.ContactUs;
import capstone.rt04.retailbackend.repositories.ContactUsRepository;
import capstone.rt04.retailbackend.util.Constants;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
@Slf4j
public class ContactUsService {
    // Add a new complaint/compliment/enquiry/support ticket with details of the issue and customer’s email for staff to reply to

    private RestTemplate restTemplate;

    private final ValidationService validationService;
    private final ContactUsRepository contactUsRepository;

    public ContactUsService(ValidationService validationService, ContactUsRepository contactUsRepository) {
        this.validationService = validationService;
        this.contactUsRepository = contactUsRepository;

    }

    public ContactUs createNewContactUs(ContactUs contactUs) throws InputDataValidationException {
        Map<String, String> errorMap = validationService.generateErrorMap(contactUs);

//        if (contactUs.getCustomerEmail() == null) {
//            errorMap = new HashMap<>();
//            errorMap.put("customerEmail", "Please do not leave Blank");
//            throw new InputDataValidationException(errorMap, "Please do not leave Blank");
//        } else {
//            contactUsRepository.save(contactUs);
//        }
        if(errorMap == null) {
            contactUsRepository.save(contactUs);
            sendContactUsNotification(contactUs);
            return contactUs;
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Form");
        }

    }

    private void sendContactUsNotification(ContactUs contactUs) {
        restTemplate = new RestTemplate();
        Map<String, String> request = new HashMap<>();
        String fullName = contactUs.getFirstName() + " " + contactUs.getLastName();
        String email = contactUs.getCustomerEmail();
        request.put("email", email);
        request.put("fullName", fullName);
        request.put("contactUsCategory", contactUs.getContactUsCategory().toString());

        String endpoint = Constants.NODE_API_URL + "/email/contactUsConfirmation";
        try {
            ResponseEntity<?> response = restTemplate.postForEntity(endpoint, request, Object.class);
            if (response.getStatusCode().equals(HttpStatus.OK)) {
                log.info("Email sent successfully to " + email);
            } else {
                log.error("Error sending email to " + email);
            }
        } catch (Exception ex){
            log.error(ex.getMessage());
        }

    }

}
