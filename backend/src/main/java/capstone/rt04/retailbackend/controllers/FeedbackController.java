package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.request.staff.StaffCreateRequest;
import capstone.rt04.retailbackend.services.FeedbackService;
import capstone.rt04.retailbackend.request.customer.*;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import capstone.rt04.retailbackend.util.routeconstants.FeedbackControllerRoute;


import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(FeedbackControllerRoute.FEEDBACK_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})

public class FeedbackController {

    private final FeedbackService feedbackService;
    private final ValidationService validationService;


    public FeedbackController(FeedbackService feedbackService, ValidationService validationService) {
        this.feedbackService = feedbackService;
        this.validationService = validationService;
    }

    @PostMapping(FeedbackControllerRoute.CREATE_NEW_FEEDBACK)
    public ResponseEntity<?> createNewFeedback(@RequestBody ContactUs createFeedback) throws InputDataValidationException {
        ContactUs newFeedback = feedbackService.createNewFeedback(createFeedback, createFeedback.getContactUsCategory(), createFeedback.getContent(), createFeedback.getCustomerEmail());
        return new ResponseEntity<>(newFeedback, HttpStatus.CREATED);
    }


}
