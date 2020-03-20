package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.PromoCodeRepository;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.CreateNewPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PromoCodeService {

    private final ValidationService validationService;
    private final ProductService productService;
    private final PromoCodeRepository promoCodeRepository;

    public PromoCodeService(@Lazy ProductService productService, ValidationService validationService, PromoCodeRepository promoCodeRepository) {
        this.productService = productService;
        this.validationService = validationService;
        this.promoCodeRepository = promoCodeRepository;
    }

    public PromoCode createNewPromoCode(PromoCode promoCode) throws InputDataValidationException, CreateNewPromoCodeException {

        validationService.throwExceptionIfInvalidBean(promoCode);

        try {
            PromoCode existingPromoCode = null;

            try {
                existingPromoCode = retrievePromoCodeByName(promoCode.getPromoCodeName());
            } catch (PromoCodeNotFoundException ex) {
            }

            if (existingPromoCode != null) {
                Map<String, String> errorMap = new HashMap<>();
                errorMap.put("promoCodeName", ErrorMessages.PROMO_CODE_TAKEN);
                throw new InputDataValidationException(errorMap, ErrorMessages.PROMO_CODE_TAKEN);
            }

            PromoCode savedPC = promoCodeRepository.save(promoCode);
            return savedPC;
        } catch (PersistenceException ex) {
        throw new CreateNewPromoCodeException(ex.getMessage());
    }

    }

    public PromoCode retrievePromoCodeByName(String name) throws PromoCodeNotFoundException {
        return promoCodeRepository.findByPromoCodeName(name).orElse(null);
    }

    public PromoCode updatePromoCode(PromoCode newPromoCode) throws PromoCodeNotFoundException {
        PromoCode promoCode = retrievePromoCodeById(newPromoCode.getPromoCodeId());

        promoCode.setFlatDiscount(newPromoCode.getFlatDiscount());
        promoCode.setMinimumPurchase(newPromoCode.getMinimumPurchase());
        promoCode.setNumRemaining(newPromoCode.getNumRemaining());
        promoCode.setPercentageDiscount(newPromoCode.getPercentageDiscount());
        promoCode.setPromoCodeId(newPromoCode.getPromoCodeId());
        promoCode.setPromoCodeName(newPromoCode.getPromoCodeName());

        return promoCode;
    }

    public PromoCode deletePromoCode(Long promoCodeId) throws PromoCodeNotFoundException {
        PromoCode promoCodeToRemove = retrievePromoCodeById(promoCodeId);
        for (Transaction transaction : promoCodeToRemove.getTransactions()) {
            transaction.setPromoCode(null);
        }
        promoCodeToRemove.setTransactions(null);
        promoCodeRepository.delete(promoCodeToRemove);

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

    private List<PromoCode> lazilyLoadPromoCode(List<PromoCode> promoCodes) {
        for (PromoCode promoCode : promoCodes) {
            promoCode.getTransactions().size();
        }
        return promoCodes;
    }
}
