package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.entities.Review;
import capstone.rt04.retailbackend.request.review.ReviewCreateRequest;
import capstone.rt04.retailbackend.request.review.ReviewResponseRequest;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.ReviewService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.review.CreateNewReviewException;
import capstone.rt04.retailbackend.util.exceptions.review.ReviewNotDeletedException;
import capstone.rt04.retailbackend.util.exceptions.review.ReviewNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.review.ReviewNotUpdatedException;
import capstone.rt04.retailbackend.util.routeconstants.ReviewControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(ReviewControllerRoutes.REVIEW_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ReviewController {

    private final ReviewService reviewService;
    private final ValidationService validationService;
    private final RelationshipService relationshipService;

    public ReviewController(ReviewService reviewService, ValidationService validationService, RelationshipService relationshipService) {
        this.reviewService = reviewService;
        this.validationService = validationService;
        this.relationshipService = relationshipService;
    }

    @PostMapping(ReviewControllerRoutes.CREATE_NEW_REVIEW)
    public ResponseEntity<?> createNewReview(@RequestBody ReviewCreateRequest reviewCreateRequest) throws InputDataValidationException, CreateNewReviewException {
        Review newReview = reviewService.createNewReview(reviewCreateRequest.getReview(), reviewCreateRequest.getProductId(),
                reviewCreateRequest.getCustomerId());
        clearReviewRelationships(newReview);
        return new ResponseEntity<>(newReview, HttpStatus.CREATED);
    }

    @GetMapping(ReviewControllerRoutes.RETRIEVE_REVIEW_BY_ID)
    public ResponseEntity<?> retrieveReviewById(@PathVariable Long reviewId) throws ReviewNotFoundException {
        Review review = reviewService.retrieveReviewById(reviewId);
        clearReviewRelationships(review);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    @GetMapping(ReviewControllerRoutes.RETRIEVE_REVIEWS_BY_CUSTOMER_ID)
    public ResponseEntity<?> retrieveReviewByCustomerId(@PathVariable Long customerId) {
        List<Review> reviews = reviewService.retrieveReviewsByCustomerId(customerId);

        for (Review r : reviews) {
            Customer c = r.getCustomer();
            relationshipService.clearCustomerRelationships(c);
            Product product = r.getProduct();
            product.setStyles(null);
            product.setReviews(null);
            product.setCategory(null);
            product.setTags(null);
            product.setDiscounts(null);
            for(ProductVariant pv: r.getProduct().getProductVariants()) {
                pv.setProductStocks(null);
                pv.setProduct(null);
            }
//            product.setProductVariants(null);
//            relationshipService.clearProductRelationships(r.getProduct());
            r.setStaff(null);
        }
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping(ReviewControllerRoutes.RETRIEVE_ALL_REVIEW_BY_PRODUCT_ID)
    public ResponseEntity<?> retrieveAllReviewByProductId(@PathVariable Long productId) throws ProductNotFoundException, ReviewNotFoundException {
        List<Review> reviews = reviewService.retrieveAllReviewsByProductId(productId);
        reviews.forEach(this::clearReviewRelationships);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping(ReviewControllerRoutes.RETRIEVE_ALL_REVIEWS)
    public ResponseEntity<?> retrieveAllReviews() {
        List<Review> reviews = reviewService.retrieveAllReviews();
        reviews.forEach(this::clearReviewRelationships);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping(ReviewControllerRoutes.UPDATE_REVIEW)
    public ResponseEntity<?> updateReview(@RequestBody ReviewCreateRequest reviewCreateRequest) throws ProductNotFoundException, ReviewNotUpdatedException, CustomerNotFoundException {
        Review review = reviewService.updateReview(reviewCreateRequest.getReview(), reviewCreateRequest.getCustomerId(), reviewCreateRequest.getProductId());
        clearReviewRelationships(review);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    @DeleteMapping(ReviewControllerRoutes.DELETE_REVIEW)
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) throws ReviewNotDeletedException, ReviewNotFoundException, CustomerNotFoundException, ProductNotFoundException {
        Review deletedReview = reviewService.deleteReview(reviewId);
        clearReviewRelationships(deletedReview);
        return new ResponseEntity<>(deletedReview, HttpStatus.OK);
    }

    @GetMapping(ReviewControllerRoutes.CHECK_IF_CAN_WRITE_REVIEW)
    public ResponseEntity<?> checkIfCanWriteReview(@PathVariable Long productId, @PathVariable Long customerId) throws CustomerNotFoundException {
        Boolean canWrite = reviewService.checkIfAllowedToWriteReview(productId, customerId);
        return new ResponseEntity<>(canWrite, HttpStatus.OK);
    }

    @PostMapping(ReviewControllerRoutes.RESPOND_TO_REVIEW)
    public ResponseEntity<?> respondToReview(@RequestBody ReviewResponseRequest request) throws ReviewNotFoundException {
        List<Review> reviews = reviewService.respondToReview(request.getReviewId(), request.getResponse());
        reviews.forEach(this::clearReviewRelationships);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @DeleteMapping(ReviewControllerRoutes.DELETE_REVIEW_RESPONSE)
    public ResponseEntity<?> deleteReviewResponse(@PathVariable Long reviewId) throws ReviewNotFoundException {
        List<Review> reviews = reviewService.deleteReviewResponse(reviewId);
        reviews.forEach(this::clearReviewRelationships);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    private void clearReviewRelationships(Review review) {
        if (review.getStaff() != null) {
            review.getStaff().setRepliedReviews(null);
        }
        relationshipService.clearProductRelationships(review.getProduct());
        relationshipService.clearCustomerRelationships(review.getCustomer());
    }

}
