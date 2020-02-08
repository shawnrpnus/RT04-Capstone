package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Discount;
import capstone.rt04.retailbackend.repositories.DiscountRepository;
import capstone.rt04.retailbackend.util.exceptions.discount.DiscountNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
