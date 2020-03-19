package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.repositories.PromoCodeRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PromoCodeService {

    private final ValidationService validationService;
    private final ProductService productService;
    private final PromoCodeRepository promoCodeRepository;

    public PromoCodeService(@Lazy ProductService productService, ValidationService validationService, @Lazy PromoCodeRepository promoCodeRepository) {
        this.productService = productService;
        this.validationService = validationService;
        this.promoCodeRepository = promoCodeRepository;
    }

    public PromoCode createNewPromoCode(PromoCode promoCode) throws InputDataValidationException, ProductNotFoundException {

        Map<String, String> errorMap = validationService.generateErrorMap(promoCode);

        if (errorMap == null) {
            try {
                List<Product> products = new ArrayList<>(promoCode.getProducts());
                Product product = null;
                promoCode.getProducts().clear();

                for (Product prod : products) {
                    product = productService.retrieveProductById(prod.getProductId());
                    promoCode.addProduct(product);
                }
                promoCodeRepository.save(promoCode);

                return promoCode;
            } catch (ProductNotFoundException ex) {
                throw new ProductNotFoundException("Unable to find certain products to link to the promo code " + ex.getMessage());
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
        for (Product product : promoCodeToRemove.getProducts()) {
            product.getPromoCodes().remove(promoCodeToRemove);
        }
        promoCodeToRemove.setProducts(null);
        promoCodeRepository.delete(promoCodeToRemove);

        return promoCodeToRemove;
    }

    public PromoCode retrievePromoCodeById(Long promoCodeId) throws PromoCodeNotFoundException {
        PromoCode promoCode = promoCodeRepository.findById(promoCodeId)
                .orElseThrow(() -> new PromoCodeNotFoundException("Promo code " + promoCodeId + " not found!"));
        promoCode.getProducts().size();
        return promoCode;
    }

    public List<PromoCode> retrieveListOfPromoCodesByIds(List<Long> promoCodeIds) {
        List<PromoCode> promoCodes = (List<PromoCode>) promoCodeRepository.findAllById(promoCodeIds);
        return lazilyLoadPromoCode(promoCodes);
    }

    private List<PromoCode> lazilyLoadPromoCode(List<PromoCode> promoCodes) {
        for (PromoCode promoCode : promoCodes) {
            promoCode.getProducts().size();
        }
        return promoCodes;
    }
}
