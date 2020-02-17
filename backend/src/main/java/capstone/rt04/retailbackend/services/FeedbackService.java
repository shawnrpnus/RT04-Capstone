package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.*;
import capstone.rt04.retailbackend.entities.ContactUs;
import capstone.rt04.retailbackend.repositories.StaffRepository;
import capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public ContactUs createNewFeedback(ContactUs ContactUs, ContactUsCategoryEnum categoryEnum, String content, String customerEmail){

        ContactUs newFeedback = feedbackRepository.save(ContactUs);
        newFeedback.setContactUsCategory(categoryEnum);
        newFeedback.setCustomerEmail(customerEmail);
        newFeedback.setContent(content);
        return newFeedback;
    }

        private void sendFeedbackNotification(String feedbackEmail, long contactUsId) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(feedbackEmail);
        msg.setSubject("Feedback Ticket");
        msg.setText("We have received your feedback and will be replying to you shortly. Your Feedback Number is" + contactUsId  );
            javaMailSender.send(msg);

    }




}
