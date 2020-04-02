package capstone.rt04.retailbackend.util;

public class Constants {
    public static final String IN_STORE_SHOPPING_CART = "instore";
    public static final String ONLINE_SHOPPING_CART = "online";

    public static final String[] ALLOWED_ORIGINS = {"http://localhost:3000",
            "http://localhost:3001", "http://192.168.99.100:3000",
            "https://apricot-and-nut.herokuapp.com",
            "https://apricot-and-nut-staff.herokuapp.com"};

    public static final String SECRET_KEY = "THISISSECRET";

    public static final String DEV_MARKET_BASKET_ANALYIS_FILE_PATH = "src/main/java/capstone/rt04/retailbackend/util/apriori/transactionIds.txt";
}
