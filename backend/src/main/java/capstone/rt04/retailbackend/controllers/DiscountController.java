package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Discount;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.request.discount.DiscountAssociateRequest;
import capstone.rt04.retailbackend.services.DiscountService;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.discount.DiscountNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.DiscountControllerRoutes.*;

@RestController
@RequestMapping(DISCOUNT_BASE_ROUTE)
public class DiscountController {

    private final DiscountService discountService;
    private final RelationshipService relationshipService;


    public DiscountController(DiscountService discountService, RelationshipService relationshipService) {
        this.discountService = discountService;
        this.relationshipService = relationshipService;
    }

    @PostMapping(CREATE_DISCOUNT)
    public ResponseEntity<?> createDiscount(@RequestBody Discount discount) throws InputDataValidationException {
        List<Discount> discounts = discountService.createDiscount(discount);
        clearDiscountRelationships(discounts);
        return new ResponseEntity<>(discounts, HttpStatus.CREATED);
    }

    @GetMapping(RETRIEVE_ALL_DISCOUNT)
    public ResponseEntity<?> retrieveAllDiscount() {
        List<Discount> discounts = discountService.retrieveAllDiscount();
        clearDiscountRelationships(discounts);
        return new ResponseEntity<>(discounts, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_DISCOUNT_BY_ID)
    public ResponseEntity<?> retrieveDiscountById(@PathVariable Long discountId) throws DiscountNotFoundException {
        Discount discount = discountService.retrieveDiscountById(discountId);
        discount.getProducts().forEach(product -> relationshipService.clearProductRelationships(product));
        return new ResponseEntity<>(discount, HttpStatus.OK);
    }

    @PutMapping(UPDATE_DISCOUNT)
    public ResponseEntity<?> updateDiscount(@RequestBody Discount discount) throws DiscountNotFoundException {
        List<Discount> discounts = discountService.updateDiscount(discount);
        clearDiscountRelationships(discounts);
        return new ResponseEntity<>(discounts, HttpStatus.OK);
    }

    @PostMapping(ADD_DISCOUNT_TO_PRODUCTS)
    public ResponseEntity<?> addDiscountToProducts(@RequestBody DiscountAssociateRequest request) throws ProductNotFoundException, DiscountNotFoundException {
        List<Discount> discounts = discountService.addDiscountToProduct(request.getDiscountId(), request.getProductIds());
        clearDiscountRelationships(discounts);
        return new ResponseEntity<>(discounts, HttpStatus.OK);
    }

    @PostMapping(REMOVE_DISCOUNT_FROM_PRODUCTS)
    public ResponseEntity<?> removeDiscountFromProducts(@RequestBody DiscountAssociateRequest request) throws ProductNotFoundException, DiscountNotFoundException {
        List<Discount> discounts = discountService.removeDiscountFromProduct(request.getDiscountId(), request.getProductIds());
        clearDiscountRelationships(discounts);
        return new ResponseEntity<>(discounts, HttpStatus.OK);
    }

    @DeleteMapping(DELETE_DISCOUNT)
    public ResponseEntity<?> deleteDiscount(@PathVariable Long discountId) throws DiscountNotFoundException {
        List<Discount> discounts = discountService.deleteDiscount(discountId);
        clearDiscountRelationships(discounts);
        return new ResponseEntity<>(discounts, HttpStatus.OK);
    }

    private void clearDiscountRelationships(List<Discount> discounts) {
        for (Discount discount : discounts) {
            for (Product product : discount.getProducts()) {
                relationshipService.clearProductRelationships(product);
            }
        }
    }
}
