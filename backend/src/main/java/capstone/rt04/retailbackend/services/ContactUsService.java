package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.entities.ContactUs;
import capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum;
import capstone.rt04.retailbackend.util.exceptions.contactUs.CreateNewContactUsException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional

public class ContactUsService {
    // Add a new complaint/compliment/enquiry/support ticket with details of the issue and customer’s email for staff to reply to

    private JavaMailSender javaMailSender;
    private final ValidationService validationService;
    private final ContactUsRepository contactUsRepository;

    public ContactUsService(JavaMailSender javaMailSender, ValidationService validationService, ContactUsRepository contactUsRepository) {
        this.javaMailSender = javaMailSender;
        this.validationService = validationService;
        this.contactUsRepository = contactUsRepository;

    }

    public ContactUs createNewContactUs(ContactUs contactUs) throws CreateNewContactUsException, InputDataValidationException {
        Map<String, String> errorMap = validationService.generateErrorMap(contactUs);

        if (contactUs.getCustomerEmail() == null) {
            errorMap = new HashMap<>();
            errorMap.put("customerEmail", "Please do not leave Blank");
            throw new InputDataValidationException(errorMap, "Please do not leave Blank");
        } else {
            contactUsRepository.save(contactUs);
        }

        return contactUs;
    }

    private void sendContactUsNotification(String contactUsEmail, long contactUsId) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(contactUsEmail);
        msg.setSubject("Contact Us Ticket");
        msg.setText("We have received your message and will be replying to you shortly. Your Contact Us Number is" + contactUsId);
        javaMailSender.send(msg);

    }

}
