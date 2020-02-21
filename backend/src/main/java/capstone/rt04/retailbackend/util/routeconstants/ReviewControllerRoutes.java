package capstone.rt04.retailbackend.util.routeconstants;

public class ReviewControllerRoutes {
    public static final String REVIEW_BASE_ROUTE = "/api/review";
    public static final String CREATE_NEW_REVIEW = "/createNewReview";
    public static final String RETRIEVE_ALL_REVIEW_BY_PRODUCT_ID = "/retrieveAllReviewByProductId/{productId}";
    public static final String RETRIEVE_REVIEW_BY_ID = "/retrieveReviewById/{reviewId}";
    public static final String UPDATE_REVIEW = "/updateReview/{reviewId}";
    public static final String DELETE_REVIEW = "/deleteReview/{reviewId}";
}
