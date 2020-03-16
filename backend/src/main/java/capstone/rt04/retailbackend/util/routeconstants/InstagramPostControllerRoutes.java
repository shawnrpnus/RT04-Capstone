package capstone.rt04.retailbackend.util.routeconstants;

public class InstagramPostControllerRoutes {
    public static final String INSTAGRAM_POST_BASE_ROUTE = "/api/instagramPost";
    public static final String CREATE_INSTAGRAM_POST = "/createInstagramPost";
    public static final String RETRIEVE_ALL_INSTAGRAM_POST = "/retrieveAllInstagramPost";
    public static final String RETRIEVE_ALL_ACTIVE_INSTAGRAM_POST = "/retrieveAllActiveInstagramPost";
    public static final String RETRIEVE_INSTAGRAM_POST_BY_ID = "/retrieveInstagramPostById/{instagramPostId}";
    public static final String ACTIVATE_INSTAGRAM_POST = "/activateInstagramPost/{instagramPostId}";
    public static final String DISABLE_INSTAGRAM_POST = "/disableInstagramPost/{instagramPostId}";
    public static final String UPDATE_PRODUCTS_TO_INSTAGRAM_POST_ASSOCIATION = "/updateProductsToInstagramPostAssociation";
    public static final String DELETE_INSTAGRAM_POST = "/deleteInstagramPost/{instagramPostId}";
}
