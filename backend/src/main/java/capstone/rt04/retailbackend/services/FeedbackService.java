package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.entities.ContactUs;
import capstone.rt04.retailbackend.repositories.StaffRepository;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.feedback.CreateNewFeedbackException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional

public class FeedbackService {
    // Add a new complaint/compliment/enquiry/support ticket with details of the issue and customer’s email for staff to reply to

    private JavaMailSender javaMailSender;
    private final ValidationService validationService;
    private final FeedbackRepository feedbackRepository;

    public FeedbackService(JavaMailSender javaMailSender, ValidationService validationService, FeedbackRepository feedbackRepository){
        this.javaMailSender = javaMailSender;
        this.validationService = validationService;
        this.feedbackRepository = feedbackRepository;

    }

    public ContactUs createNewFeedback(ContactUs contactUs) throws CreateNewFeedbackException, InputDataValidationException {
        Map<String, String> errorMap = validationService.generateErrorMap(contactUs);

        if (contactUs.getCustomerEmail() == null) {
            errorMap = new HashMap<>();
            errorMap.put("customerEmail", "Please do not leave Blank");
            throw new InputDataValidationException(errorMap, "Please do not leave Blank");
        } else{
            feedbackRepository.save(contactUs);
        }

        return contactUs;
    }
        private void sendFeedbackNotification(String feedbackEmail, long contactUsId) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(feedbackEmail);
        msg.setSubject("Feedback Ticket");
        msg.setText("We have received your feedback and will be replying to you shortly. Your Feedback Number is" + contactUsId  );
            javaMailSender.send(msg);

    }

}
