package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Review;
import capstone.rt04.retailbackend.request.review.ReviewCreateRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.ReviewService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.review.CreateNewReviewException;
import capstone.rt04.retailbackend.util.exceptions.review.ReviewNotDeletedException;
import capstone.rt04.retailbackend.util.exceptions.review.ReviewNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.ReviewControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ReviewControllerRoutes.REVIEW_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class ReviewController {

    private final ReviewService reviewService;
    private final ValidationService validationService;

    public ReviewController(ReviewService reviewService, ValidationService validationService) {
        this.reviewService = reviewService;
        this.validationService = validationService;
    }

    @PostMapping(ReviewControllerRoutes.CREATE_NEW_REVIEW)
    public ResponseEntity<?> createNewReview(@RequestBody ReviewCreateRequest reviewCreateRequest) throws InputDataValidationException, CreateNewReviewException, CreateNewReviewException {

        Review newReview = reviewService.createNewReview(reviewCreateRequest.getReview(), reviewCreateRequest.getProductId(),
                reviewCreateRequest.getCustomerId());
        return new ResponseEntity<>(newReview, HttpStatus.CREATED);
    }

    @GetMapping(ReviewControllerRoutes.RETRIEVE_REVIEW_BY_ID)
    public ResponseEntity<?> retrieveReviewById(@PathVariable Long reviewId) {
        try {
            Review review = reviewService.retrieveReviewById(reviewId);
            return new ResponseEntity<>(review, HttpStatus.OK);
        } catch (ReviewNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(ReviewControllerRoutes.RETRIEVE_ALL_REVIEW_BY_PRODUCT_ID)
    public ResponseEntity<?> retrieveAllReviewByProductId(@PathVariable Long productId) {
        try {
            List<Review> reviews = reviewService.retrieveAllReviewsByProductId(productId);
            return new ResponseEntity<>(reviews, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(ReviewControllerRoutes.UPDATE_REVIEW)
    public ResponseEntity<?> updateReview(@RequestBody Review newReview) {
        try {
            Review review = reviewService.updateReview(newReview);
            return new ResponseEntity<>(review, HttpStatus.OK);
        } catch (ReviewNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(ReviewControllerRoutes.DELETE_REVIEW)
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) throws ReviewNotDeletedException, ReviewNotFoundException, CustomerNotFoundException, ProductNotFoundException {
        Review deletedReview = reviewService.deleteReview(reviewId);
        return new ResponseEntity<>(deletedReview, HttpStatus.OK);
    }
}
