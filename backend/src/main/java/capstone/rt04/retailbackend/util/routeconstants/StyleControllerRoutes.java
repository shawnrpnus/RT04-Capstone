package capstone.rt04.retailbackend.util.routeconstants;

public class StyleControllerRoutes {
    public static final String STYLE_BASE_ROUTE = "/api/style";
    public static final String CREATE_NEW_STYLE = "/createNewStyle";
    public static final String RETRIEVE_ALL_STYLES = "/retrieveAllStyles";
    public static final String RETRIEVE_STYLE_BY_ID = "/retrieveStyleById/{styleId}";
    public static final String UPDATE_STYLE = "/updateStyle";
    public static final String DELETE_STYLE = "/deleteStyle/{styleId}";
    public static final String ADD_STYLE_TO_PRODUCTS = "/addStyleToProducts";
    public static final String DELETE_STYLE_FROM_PRODUCTS = "/deleteStyleFromProducts";
    public static final String CREATE_STYLE_QUIZ_QNS = "/createStyleQuizQns";
    public static final String DELETE_STYLE_QUIZ_QNS = "/deleteStyleQuizQns/{qnsNum}";
    public static final String UPDATE_STYLE_QUIZ_QNS = "/updateStyleQuizQns";
    public static final String CREATE_NEW_STYLE_WITH_ANS = "/createNewStyleWithAns";
}
