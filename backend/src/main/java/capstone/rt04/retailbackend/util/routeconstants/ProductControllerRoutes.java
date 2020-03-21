package capstone.rt04.retailbackend.util.routeconstants;

public class ProductControllerRoutes {
    public static final String PRODUCT_BASE_ROUTE = "/api/product";
    public static final String RETRIEVE_PRODUCT_BY_ID = "/retrieveProductById/{productId}";
    public static final String RETRIEVE_PRODUCTS_BY_CRITERIA = "/retrieveProductsByCriteria";
    public static final String RETRIEVE_ALL_PRODUCTS = "/retrieveAllProducts";
    public static final String RETRIEVE_PRODUCTS_DETAILS = "/retrieveProductsDetails";
    public static final String RETRIEVE_PRODUCTS_DETAILS_BY_CRITERIA = "/retrieveProductsDetailsByCriteria";
    public static final String CREATE_PRODUCT = "/createNewProduct";
    public static final String UPDATE_PRODUCT = "/updateProduct";
    public static final String ADD_REMOVE_DISCOUNT_TO_A_PRODUCT = "/addOrRemovePromoCodeToAProduct";
    public static final String ADD_REMOVE_DISCOUNT_FOR_A_LIST_OF_PRODUCTS = "/addOrRemoveDiscountForAListOfProducts";
    public static final String ADD_REMOVE_TAG_TO_PRODUCT = "/addOrRemoveTagToAProduct";
    public static final String ADD_REMOVE_TAG_FOR_A_LIST_OF_PRODUCTS = "/addOrRemoveTagForAListOfProducts";
    public static final String DELETE_PRODUCT = "/deleteProduct/{productId}";
    public static final String UPDATE_ALGOLIA = "/updateAlgolia";

}
