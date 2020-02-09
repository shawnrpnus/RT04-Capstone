package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.repositories.PromoCodeRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.CreateNewPromoCodeException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PromoCodeService {

    private final ValidationService validationService;
    private final ProductService productService;

    @Autowired
    private final PromoCodeRepository promoCodeRepository;

    public PromoCodeService(@Lazy ProductService productService, ValidationService validationService, PromoCodeRepository promoCodeRepository) {
        this.productService = productService;
        this.validationService = validationService;
        this.promoCodeRepository = promoCodeRepository;
    }

    public PromoCode createNewPromoCode(PromoCode promoCode, List<Long> productIds) throws ProductNotFoundException, CreateNewPromoCodeException, InputDataValidationException {
        Map<String, String> errorMap = validationService.generateErrorMap(promoCode);

        if(errorMap == null) {
            try {
                List<Product> products = new LinkedList<>();
                promoCode = promoCodeRepository.save(promoCode);
                if(!productIds.isEmpty()) {
                    products = productService.retrieveProductListByProductId(productIds);
                    for(Product p : products) {
                        promoCode.addProduct(p);
                    }
                }
                return promoCode;
            }catch (Exception ex) {
                throw new CreateNewPromoCodeException("Error creating new category");
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Promo Code");
        }
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
        for(Product p : promoCodeToRemove.getProducts()) {
            p.getPromoCodes().remove(promoCodeToRemove);
        }
        promoCodeToRemove.getProducts().clear();

        promoCodeRepository.delete(promoCodeToRemove);

        return promoCodeToRemove;

    }

    public PromoCode retrievePromoCodeById(Long promoCodeId) throws PromoCodeNotFoundException {

        PromoCode promoCode = promoCodeRepository.findById(promoCodeId)
                .orElseThrow(() -> new PromoCodeNotFoundException("Promo code " + promoCodeId + " not found!"));

        return promoCode;
    }
}
