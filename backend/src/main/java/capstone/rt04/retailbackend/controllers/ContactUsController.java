package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.services.ContactUsService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.contactUs.CreateNewContactUsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import capstone.rt04.retailbackend.util.routeconstants.ContactUsControllerRoute;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ContactUsControllerRoute.CONTACT_US_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})

public class ContactUsController {

    private final ContactUsService contactUsService;
    private final ValidationService validationService;


    public ContactUsController(ContactUsService contactUsService, ValidationService validationService) {
        this.contactUsService = contactUsService;
        this.validationService = validationService;
    }

    @PostMapping(ContactUsControllerRoute.CREATE_NEW_CONTACT_US)
    public ResponseEntity<?> createNewContactUs(@RequestBody ContactUs createContactUs) throws InputDataValidationException, CreateNewCategoryException, CreateNewContactUsException {
        ContactUs newContactUs = contactUsService.createNewContactUs(createContactUs);
        return new ResponseEntity<>(newContactUs, HttpStatus.CREATED);
    }
}
