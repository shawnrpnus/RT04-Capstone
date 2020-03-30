package capstone.rt04.retailbackend.util.routeconstants;

public class PromoCodeControllerRoutes {
    public static final String PROMO_CODE_BASE_ROUTE = "/api/promoCode";
    public static final String CREATE_NEW_PROMO_CODE = "/createNewPromoCode";
    public static final String REMOVE_PROMO_CODE = "/removePromoCode/{promoCodeId}";
    public static final String UPDATE_PROMO_CODE = "/updatePromoCode";
    public static final String RETRIEVE_PROMO_CODE_BY_ID = "/retrievePromoCodeById/{promoCodeId}";
    public static final String RETRIEVE_ALL_PROMO_CODE = "/retrieveAllPromoCode";
    public static final String APPLY_PROMO_CODE = "/applyPromoCode";
}