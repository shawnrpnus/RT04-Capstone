package capstone.rt04.retailbackend.util.routeconstants;

public class ProductStockControllerRoutes {
    public static final String PRODUCT_STOCK_BASE_ROUTE = "/api/productStock";
    public static final String RETRIEVE_PRODUCT_STOCK_BY_ID = "/retrieveProductStockById/{productStockId}";
    public static final String RETRIEVE_PRODUCT_STOCKS_THROUGH_PRODUCT_BY_PARAMETER = "/retrieveProductStocksThroughProductByParameter";
    public static final String CREATE_PRODUCT_STOCK = "/createProductStock";
    public static final String UPDATE_PRODUCT_STOCK = "/updateProductStock";
    public static final String UPDATE_PRODUCT_STOCK_QTY = "/updateProductStockQty";
    public static final String DELETE_PRODUCT_STOCK = "/deleteProductStock/{productStockId}";
}
