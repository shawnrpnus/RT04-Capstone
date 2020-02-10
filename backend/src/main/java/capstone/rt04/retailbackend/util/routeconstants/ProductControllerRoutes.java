package capstone.rt04.retailbackend.util.routeconstants;

public class ProductControllerRoutes {
    public static final String PRODUCT_BASE_ROUTE = "/api/product";
    public static final String RETRIEVE_PRODUCT_BY_ID = "/retrieveProductById/{productId}";
    public static final String RETRIEVE_ALL_PRODUCTS = "/retrieveAllProduct";
    public static final String CREATE_NEW_PRODUCT = "/createNewProduct";
    public static final String UPDATE_PRODUCT = "/updateProduct";
    public static final String ADD_REMOVE_PROMOCODE_TO_A_PRODUCT = "/addOrRemovePromoCodeToAProduct";
    public static final String ADD_REMOVE_PROMOCODE_FOR_A_LIST_OF_PRODUCTS = "/addOrRemovePromoCodeForAListOfProducts";
    public static final String ADD_REMOVE_TAG_TO_PRODUCT = "/addOrRemoveTagToAProduct";
    public static final String ADD_REMOVE_TAG_FOR_A_LIST_OF_PRODUCTS = "/addOrRemoveTagForAListOfProducts";
    public static final String DELETE_PRODUCT = "/deleteProduct/{productId}";

}
