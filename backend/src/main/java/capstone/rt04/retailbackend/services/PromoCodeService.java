package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.repositories.PromoCodeRepository;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.CreateNewPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.InvalidPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeUsedException;
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

            if (promoCode.getPercentageDiscount() == null) {
                promoCode.setPercentageDiscount(BigDecimal.valueOf(0));
            }

            if (promoCode.getFlatDiscount() == null) {
                promoCode.setFlatDiscount(BigDecimal.valueOf(0));
            }
            PromoCode savedPC = promoCodeRepository.save(promoCode);
            return savedPC;
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

        System.out.println(newPromoCode.getFlatDiscount());
        System.out.println(newPromoCode.getPercentageDiscount());

        promoCode.setFlatDiscount(newPromoCode.getFlatDiscount());
        promoCode.setPercentageDiscount(newPromoCode.getPercentageDiscount());
        promoCode.setMinimumPurchase(newPromoCode.getMinimumPurchase());
        promoCode.setNumRemaining(newPromoCode.getNumRemaining());
        promoCode.setPromoCodeName(newPromoCode.getPromoCodeName());

        PromoCode saved = promoCodeRepository.save(promoCode);
        return saved;
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
