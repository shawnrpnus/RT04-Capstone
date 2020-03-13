package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.ContactUs;
import capstone.rt04.retailbackend.request.contactUs.CreateNewContactUsRequest;
import capstone.rt04.retailbackend.request.contactUs.ReplyToEmailRequest;
import capstone.rt04.retailbackend.services.ContactUsService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.contactUs.ContactUsDeleteException;
import capstone.rt04.retailbackend.util.exceptions.contactUs.ContactUsNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.contactUs.CreateNewContactUsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.ContactUsControllerRoute.*;

@RestController
@RequestMapping(CONTACT_US_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})

public class ContactUsController {

    private final ContactUsService contactUsService;
    private final ValidationService validationService;


    public ContactUsController(ContactUsService contactUsService, ValidationService validationService) {
        this.contactUsService = contactUsService;
        this.validationService = validationService;
    }

    @GetMapping(RETRIEVE_ALL_CONTACT_US_CATEGORY_ENUM)
    public ResponseEntity<?> retrieveAllContactUsCategoryEnum() {
        return new ResponseEntity<>(Arrays.asList(ContactUsCategoryEnum.values()), HttpStatus.OK);
    }


    @PostMapping(CREATE_NEW_CONTACT_US)
    public ResponseEntity<?> createNewContactUs(@RequestBody CreateNewContactUsRequest createNewContactUsRequest) throws InputDataValidationException, CreateNewCategoryException, CreateNewContactUsException {

        ContactUs createContactUs = new ContactUs(ContactUsCategoryEnum.valueOf(createNewContactUsRequest.getContactUsCategory()), createNewContactUsRequest.getContent(), createNewContactUsRequest.getCustomerEmail(), createNewContactUsRequest.getFirstName(), createNewContactUsRequest.getLastName());
        ContactUs newContactUs = contactUsService.createNewContactUs(createContactUs);
        return new ResponseEntity<>(newContactUs, HttpStatus.CREATED);
    }

    @GetMapping(RETRIEVE_ALL_CONTACT_US)
    public ResponseEntity<?> retrieveAllContactUs() {
        List<ContactUs> contactUsList = contactUsService.retrieveAllContactUs();
        return new ResponseEntity<>(contactUsList, HttpStatus.OK);
    }

    @DeleteMapping(DELETE_CONTACT_US)
    public ResponseEntity<?> retrieveAllContactUs(@PathVariable Long contactUsId) throws ContactUsNotFoundException, ContactUsDeleteException {
        List<ContactUs> contactUsList = contactUsService.deleteContactUs(contactUsId);
        return new ResponseEntity<>(contactUsList, HttpStatus.OK);
    }

    @PostMapping(REPLY_TO_EMAIL)
    public ResponseEntity<?> replyToEmail(@RequestBody ReplyToEmailRequest replyToEmailRequest) throws ContactUsNotFoundException {
        List<ContactUs> contactUsList = contactUsService.replyToEmail(replyToEmailRequest.getContactUsId(),
                replyToEmailRequest.getReply());
        return new ResponseEntity<>(contactUsList, HttpStatus.OK);
    }
}
