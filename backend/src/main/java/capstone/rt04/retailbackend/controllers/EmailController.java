package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.request.email.EmailRequest;
import capstone.rt04.retailbackend.response.GenericSuccessResponse;
import capstone.rt04.retailbackend.services.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static capstone.rt04.retailbackend.util.routeconstants.EmailControllerRoutes.*;

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
       return new ResponseEntity<>(new GenericSuccessResponse("Emails has been sent to all customers!"), HttpStatus.OK);
    }
}
