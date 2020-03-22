package capstone.rt04.retailbackend.util.routeconstants;

public class DiscountControllerRoutes {
    public static final String DISCOUNT_BASE_ROUTE = "/api/discount";
    public static final String CREATE_DISCOUNT = "/createDiscount";
    public static final String UPDATE_DISCOUNT = "/updateDiscount";
    public static final String RETRIEVE_DISCOUNT_BY_ID = "/retrieveDiscountById/{discountId}";
    public static final String RETRIEVE_ALL_DISCOUNT = "/retrieveAllDiscount";
    public static final String ADD_DISCOUNT_TO_PRODUCTS = "/addDiscountToProducts";
    public static final String REMOVE_DISCOUNT_FROM_PRODUCTS = "/removeDiscountFromProducts";
    public static final String DELETE_DISCOUNT = "/deleteDiscount/{discountId}";
}
