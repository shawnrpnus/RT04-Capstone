package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.request.promoCode.PromoCodeCreateRequest;
import capstone.rt04.retailbackend.request.promoCode.PromoCodeUpdateRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.PromoCodeService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.CreateNewPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.InvalidPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeUsedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.PromoCodeControllerRoutes.*;

@RestController
@RequestMapping(PROMO_CODE_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PromoCodeController {

    private final PromoCodeService promoCodeService;
    private final ValidationService validationService;

    public PromoCodeController(PromoCodeService promoCodeService, ValidationService validationService) {
        this.promoCodeService = promoCodeService;
        this.validationService = validationService;
    }

    @PostMapping(CREATE_NEW_PROMO_CODE)
    public ResponseEntity<?> createNewPromoCode(@RequestBody PromoCodeCreateRequest promoCodeCreateRequest) throws InputDataValidationException {

        try {
            PromoCode newPromoCode = promoCodeService.createNewPromoCode(promoCodeCreateRequest.getPromoCode());
            return new ResponseEntity<>(newPromoCode, HttpStatus.CREATED);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (CreateNewPromoCodeException ex) {
            return new ResponseEntity<>(ex, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(RETRIEVE_PROMO_CODE_BY_ID)
    public ResponseEntity<?> retrievePromoCodeById(@PathVariable Long promoCodeId) {
        try {
            PromoCode promoCode = promoCodeService.retrievePromoCodeById(promoCodeId);
            return new ResponseEntity<>(promoCode, HttpStatus.OK);
        } catch (PromoCodeNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_PROMO_CODE)
    public ResponseEntity<?> retrieveAllPromoCode() {
        try {
            List<PromoCode> promoCodes = promoCodeService.retrieveAllPromoCodes();
            return new ResponseEntity<>(promoCodes, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(REMOVE_PROMO_CODE)
    public ResponseEntity<?> removePromoCode(@PathVariable Long promoCodeId) throws PromoCodeNotFoundException{
        PromoCode deletedPromoCode = promoCodeService.deletePromoCode(promoCodeId);
        return new ResponseEntity<>(deletedPromoCode, HttpStatus.OK);
    }

    @PostMapping(UPDATE_PROMO_CODE)
    public ResponseEntity<?> updatePromoCode(@RequestBody PromoCodeUpdateRequest promoCodeUpdateRequest) throws PromoCodeNotFoundException, InputDataValidationException {
        try {
            PromoCode updatedPromoCode = promoCodeService.updatePromoCode(promoCodeUpdateRequest.getNewPromoCode());
            return new ResponseEntity<>(updatedPromoCode, HttpStatus.OK);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (PromoCodeNotFoundException ex){
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(APPLY_PROMO_CODE)
    public ResponseEntity<?> applyPromoCode(@RequestParam Long customerId, @RequestParam String promoCode,
                                            @RequestParam BigDecimal finalTotalAmount)
            throws PromoCodeUsedException, PromoCodeNotFoundException, CustomerNotFoundException, InvalidPromoCodeException {
        PromoCode code = promoCodeService.applyPromoCode(customerId, promoCode, finalTotalAmount);
        return new ResponseEntity<>(code, HttpStatus.OK);
    }
}
