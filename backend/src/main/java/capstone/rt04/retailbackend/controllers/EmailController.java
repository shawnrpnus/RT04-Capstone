package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.request.email.EmailRequest;
import capstone.rt04.retailbackend.services.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static capstone.rt04.retailbackend.util.routeconstants.EmailControllerRoutes.EMAIL_BASE_ROUTE;
import static capstone.rt04.retailbackend.util.routeconstants.EmailControllerRoutes.MASS_SEND_EMAIL;

@RestController
@RequestMapping(EMAIL_BASE_ROUTE)
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping(MASS_SEND_EMAIL)
    public ResponseEntity<?> massEmail(@RequestBody EmailRequest request){
        emailService.massSendPromotionalEmail(request.getSubject(), request.getContent(),request.getInstruction(),
                request.getButtonText(), request.getLink());
       return new ResponseEntity<>(ResponseEntity.ok("Emails has been sent to all customers!"), HttpStatus.OK);
    }
}
