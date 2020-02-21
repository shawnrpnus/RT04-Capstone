package capstone.rt04.retailbackend.util.routeconstants;

public class ProductVariantControllerRoutes {
    public static final String PRODUCT_VARIANT_BASE_ROUTE = "/api/productVariant";
    public static final String RETRIEVE_PRODUCT_VARIANT_BY_ID = "/retrieveProductVariantById/{productVariantId}";
    public static final String RETRIEVE_PRODUCT_VARIANT_BY_PRODUCT = "/retrieveProductVariantByProduct/{productId}";
    public static final String RETRIEVE_ALL_PRODUCT_VARIANTS = "/retrieveAllProductVariant";
    public static final String CREATE_MULTIPLE_PRODUCT_VARIANTS = "/createMultipleProductVariants";
    public static final String UPDATE_PRODUCT_VARIANT = "/updateProductVariant";
    public static final String DELETE_PRODUCT_VARIANT = "/deleteProductVariant/{productVariantId}";

}
