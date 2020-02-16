package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Discount;
import capstone.rt04.retailbackend.repositories.DiscountRepository;
import capstone.rt04.retailbackend.util.exceptions.discount.DiscountNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DiscountService {

    private final DiscountRepository discountRepository;

    public DiscountService(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    public Discount retrieveDiscountById(Long discountId) throws DiscountNotFoundException {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new DiscountNotFoundException("Discount " + discountId + "not found!"));
        return discount;
    }

    public List<Discount> retrieveListOfDiscountsByIds(List<Long> discountIds) {
        List<Discount> discounts = (List<Discount>) discountRepository.findAllById(discountIds);
        return lazilyLoadDiscounts(discounts);
    }

    private List<Discount> lazilyLoadDiscounts(List<Discount> discounts) {
        for(Discount discount:discounts) {
            discount.getProducts().size();
        }
        return discounts;
    }
}
