package capstone.rt04.retailbackend.util.routeconstants;

public class WarehouseControllerRoutes {
    public static final String WAREHOUSE_BASE_ROUTE = "/api/warehouse";
    public static final String CREATE_NEW_WAREHOUSE = "/createNewWarehouse";
    public static final String RETRIEVE_ALL_WAREHOUSES = "/retrieveAllWarehouses";
    public static final String RETRIEVE_WAREHOUSE_BY_ID = "/retrieveWarehouseById/{warehouseId}";
    public static final String UPDATE_WAREHOUSE = "/updateWarehouse";
    public static final String DELETE_WAREHOUSE = "/deleteWarehouse/{warehouseId}";
    public static final String RETRIEVE_ALL_WAREHOUSE_INVENTORIES = "/retrieveAllWarehouseInventories";
}
