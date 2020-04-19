package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.repositories.PromoCodeRepository;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PromoCodeService {

    private final ValidationService validationService;
    private final CustomerService customerService;

    private final PromoCodeRepository promoCodeRepository;

    public PromoCodeService(ValidationService validationService, @Lazy CustomerService customerService,
                            PromoCodeRepository promoCodeRepository) {

        this.validationService = validationService;
        this.customerService = customerService;
        this.promoCodeRepository = promoCodeRepository;
    }

    public PromoCode createNewPromoCode(PromoCode promoCode) throws InputDataValidationException, CreateNewPromoCodeException, PromoCodeNotFoundException {

        validationService.throwExceptionIfInvalidBean(promoCode);

        try {
            PromoCode existingPromoCode = null;
            try {
                // checking for duplicate
                existingPromoCode = retrievePromoCodeByName(promoCode.getPromoCodeName());
                if (existingPromoCode != null) {
                    Map<String, String> errorMap = new HashMap<>();
                    errorMap.put("promoCodeName", ErrorMessages.PROMO_CODE_TAKEN);
                    throw new InputDataValidationException(errorMap, ErrorMessages.PROMO_CODE_TAKEN);
                }
            } catch (PromoCodeNotFoundException ex) {
                // expected error
            }

            throwInvalidRate(promoCode);

            return promoCodeRepository.save(promoCode);
        } catch (PersistenceException ex) {
            throw new CreateNewPromoCodeException(ex.getMessage());
        }

    }

    public PromoCode retrievePromoCodeByName(String name) throws PromoCodeNotFoundException {
        return promoCodeRepository.findByPromoCodeName(name).orElseThrow(
                () -> new PromoCodeNotFoundException("Promo code not found"));
    }

    public PromoCode updatePromoCode(PromoCode newPromoCode) throws PromoCodeNotFoundException, InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(newPromoCode);
        PromoCode promoCode = retrievePromoCodeById(newPromoCode.getPromoCodeId());

        List<PromoCode> allPromoCode = (List<PromoCode>) promoCodeRepository.findAll();
        for (PromoCode p : allPromoCode) {
            if ((p.getPromoCodeId() != newPromoCode.getPromoCodeId()) && p.getPromoCodeName().equals(newPromoCode.getPromoCodeName())) {
                Map<String, String> errorMap = new HashMap<>();
                errorMap.put("promoCodeName", ErrorMessages.PROMO_CODE_TAKEN);
                throw new InputDataValidationException(errorMap, ErrorMessages.PROMO_CODE_TAKEN);
            }
        }

        throwInvalidRate(promoCode);

        promoCode.setFlatDiscount(newPromoCode.getFlatDiscount());
        promoCode.setPercentageDiscount(newPromoCode.getPercentageDiscount());
        promoCode.setMinimumPurchase(newPromoCode.getMinimumPurchase());
        promoCode.setNumRemaining(newPromoCode.getNumRemaining());
        promoCode.setPromoCodeName(newPromoCode.getPromoCodeName());

        return promoCode;
    }

    private void throwInvalidRate(PromoCode promoCode) throws InputDataValidationException {
        if (promoCode.getPercentageDiscount() == null && promoCode.getFlatDiscount() == null) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("percentageDiscount", ErrorMessages.FLAT_PERCENTAGE_NOT_NULL);
            errorMap.put("flatDiscount", ErrorMessages.FLAT_PERCENTAGE_NOT_NULL);
            throw new InputDataValidationException(errorMap, ErrorMessages.FLAT_PERCENTAGE_NOT_NULL);
        }
    }


    public PromoCode deletePromoCode(Long promoCodeId) throws PromoCodeNotFoundException, PromoCodeLinkedToTransactionsException {
        PromoCode promoCodeToRemove = retrievePromoCodeById(promoCodeId);

        //checking for existing transactions linked with promo code
        if(promoCodeToRemove.getTransactions().isEmpty()){
            promoCodeRepository.delete(promoCodeToRemove);
        }else{
            promoCodeToRemove.setNumRemaining(0);
            throw new PromoCodeLinkedToTransactionsException("Promo code quantity set to 0");
        }
        return promoCodeToRemove;
    }

    public PromoCode retrievePromoCodeById(Long promoCodeId) throws PromoCodeNotFoundException {
        PromoCode promoCode = promoCodeRepository.findById(promoCodeId)
                .orElseThrow(() -> new PromoCodeNotFoundException("Promo code " + promoCodeId + " not found!"));
        promoCode.getTransactions().size();
        return promoCode;
    }

    public List<PromoCode> retrieveAllPromoCodes() {
        List<PromoCode> promoCodes = (List<PromoCode>) promoCodeRepository.findAll();
        return lazilyLoadPromoCode(promoCodes);
    }

    public PromoCode applyPromoCode(Long customerId, String inputPromoCode, BigDecimal finalTotalAmount) throws CustomerNotFoundException, PromoCodeNotFoundException, PromoCodeUsedException, InvalidPromoCodeException {

        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        PromoCode promoCode = retrievePromoCodeByName(inputPromoCode);

        if (customer.getUsedPromoCodes().contains(promoCode)) {
            throw new PromoCodeUsedException("Promo code has already been used");
        }
        if (promoCode.getNumRemaining().equals(0)) {
            throw new InvalidPromoCodeException("Invalid promo code");
        } else if (promoCode.getMinimumPurchase().compareTo(finalTotalAmount) > 0) {
            throw new InvalidPromoCodeException("Minimum purchase is $" + promoCode.getMinimumPurchase());
        } else if (promoCode.getFlatDiscount() != null && promoCode.getFlatDiscount().compareTo(finalTotalAmount) > 0) {
            throw new InvalidPromoCodeException("Flat discount cannot exceed amount to pay");
        }
        return promoCode;
    }

    private List<PromoCode> lazilyLoadPromoCode(List<PromoCode> promoCodes) {
        for (PromoCode promoCode : promoCodes) {
            promoCode.getTransactions().size();
        }
        return promoCodes;
    }
}
