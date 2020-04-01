package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Discount;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.repositories.DiscountRepository;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.discount.DiscountNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class DiscountService {

    private final DiscountRepository discountRepository;

    private final ValidationService validationService;
    private final ProductService productService;

    public DiscountService(DiscountRepository discountRepository, ValidationService validationService, @Lazy ProductService productService) {
        this.discountRepository = discountRepository;
        this.validationService = validationService;
        this.productService = productService;
    }

    public List<Discount> createDiscount(Discount discount) throws InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(discount);
        throwInvalidRate(discount);
        discountRepository.save(discount);
        return retrieveAllDiscount();
    }

    public Discount retrieveDiscountById(Long discountId) throws DiscountNotFoundException {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new DiscountNotFoundException("Discount " + discountId + "not found!"));
        return discount;
    }

    public List<Discount> retrieveAllDiscount() {
        List<Discount> discounts = (List<Discount>) discountRepository.findAll();
        lazilyLoadDiscounts(discounts);
        return discounts;
    }

    public List<Discount> updateDiscount(Discount newDiscount) throws DiscountNotFoundException, InputDataValidationException {
        throwInvalidRate(newDiscount);
        Discount discount = retrieveDiscountById(newDiscount.getDiscountId());
        discount.setDiscountName(newDiscount.getDiscountName());
        discount.setFlatDiscount(newDiscount.getFlatDiscount());
        discount.setPercentageDiscount(newDiscount.getPercentageDiscount());
        discount.setFromDateTime(newDiscount.getFromDateTime());
        discount.setToDateTime(newDiscount.getToDateTime());
        return retrieveAllDiscount();
    }

    private void throwInvalidRate(Discount discount) throws InputDataValidationException {
        if (discount.getPercentageDiscount().compareTo(BigDecimal.ONE) > 0) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("percentageDiscount", ErrorMessages.INVALID_PERCENTAGE_DISCOUNT);
            throw new InputDataValidationException(errorMap, ErrorMessages.INVALID_PERCENTAGE_DISCOUNT);
        }
    }

    public List<Discount> deleteDiscount(Long discountId) throws DiscountNotFoundException {
        Discount discount = retrieveDiscountById(discountId);
        discount.getProducts().forEach(product -> product.getDiscounts().remove(discount));
        discount.setProducts(null);
        discountRepository.delete(discount);
        return retrieveAllDiscount();
    }

    public List<Discount> addDiscountToProduct(Long discountId, List<Long> productIds) throws ProductNotFoundException, DiscountNotFoundException {
        // Adding discount for a list of products
        Discount dbDiscount = retrieveDiscountById(discountId);
        Product product;
        for(Long productId: productIds) {
            product = productService.retrieveProductById(productId);
            // 2 way add in product entity
            product.addDiscount(dbDiscount);
        }
        return retrieveAllDiscount();
    }

    public List<Discount> removeDiscountFromProduct(Long discountId, List<Long> productIds) throws ProductNotFoundException, DiscountNotFoundException {
        // Adding discount for a list of products
        Discount discount = retrieveDiscountById(discountId);
        Product product;
        for(Long productId: productIds) {
            product = productService.retrieveProductById(productId);
            // 2 way add in product entity
            product.getDiscounts().remove(discount);
            discount.getProducts().remove(product);
        }
        return retrieveAllDiscount();
    }

//    public List<Discount> retrieveListOfDiscountsByIds(List<Long> discountIds) {
//        List<Discount> discounts = (List<Discount>) discountRepository.findAllById(discountIds);
//        return lazilyLoadDiscounts(discounts);
//    }

    private List<Discount> lazilyLoadDiscounts(List<Discount> discounts) {
        for (Discount discount : discounts) {
            discount.getProducts().size();
        }
        return discounts;
    }
}
