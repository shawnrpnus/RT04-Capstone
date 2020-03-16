package capstone.rt04.retailbackend.util.routeconstants;

public class AdvertisementControllerRoutes {
    public static final String ADVERTISEMENT_BASE_ROUTE = "/api/advertisement";
    public static final String CREATE_ADVERTISEMENT = "/createAdvertisement";
    public static final String RETRIEVE_ALL_ADVERTISEMENT = "/retrieveAllAdvertisement";
    public static final String RETRIEVE_ALL_ACTIVE_ADVERTISEMENT = "/retrieveAllActiveAdvertisement";
    public static final String RETRIEVE_ADVERTISEMENT_BY_ID = "/retrieveAdvertisementById/{advertisementId}";
    public static final String ACTIVATE_ADVERTISEMENT = "/activateAdvertisement/{advertisementId}";
    public static final String DISABLE_ADVERTISEMENT = "/disableAdvertisement/{advertisementId}";
    public static final String DELETE_ADVERTISEMENT = "/deleteAdvertisement/{advertisementId}";
}
