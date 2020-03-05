package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.AddressRepository;
import capstone.rt04.retailbackend.repositories.SizeDetailsRepository;
import capstone.rt04.retailbackend.request.product.ColourToImageUrlsMap;
import capstone.rt04.retailbackend.util.enums.RoleNameEnum;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.customer.CreateNewCustomerException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductStockException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateDepartmentException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffAccountException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateRoleException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.CreateNewTagException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import com.stripe.exception.StripeException;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import static capstone.rt04.retailbackend.util.Constants.ONLINE_SHOPPING_CART;

@Component
@Profile("dev")
public class StartUpService {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final WarehouseService warehouseService;
    private final TagService tagService;
    private final StyleService styleService;
    private final StoreService storeService;
    private final StaffService staffService;
    private final SizeDetailsService sizeDetailsService;
    private final ShoppingCartService shoppingCartService;
    private final CustomerService customerService;

    private final AddressRepository addressRepository;
    private final SizeDetailsRepository sizeDetailsRepository;

    private static Long sneakerCategoryId;
    private static Long shirtCategoryId;
    private static Long socksCategoryId;
    private static Long skirtsCategoryId;
    private static Long dressesCategoryId;
    private static Long tShirtCategoryId;
    private static Long shortsCategoryId;
    private static Long shortsWCategoryId;
    private static Long sportsShortsCategoryId;
    private static Long tShirtWCategoryId;
    private static Long jeansCategoryId;
    private static Long jeansWCategoryId;
    private static Long bermudasCategoryId;
    private static Long poloTeeCategoryId;
    private static Long miniSkirtCategoryId;
    private static Long maxiDressCategoryId;
    private static Long denimJeansWCategoryId;
    private static Long denimJeansCategoryId;

    private Long customerId;
    private Long productVariantId26;
    private Long productVariantId27;
    private Long productVariantId28;
    private Long productVariantId29;
    private Long productVariantId30;


    public StartUpService(ProductService productService, CategoryService categoryService, WarehouseService warehouseService, TagService tagService, StyleService styleService, StoreService storeService, StaffService staffService, SizeDetailsService sizeDetailsService, ShoppingCartService shoppingCartService, CustomerService customerService, AddressRepository addressRepository, SizeDetailsRepository sizeDetailsRepository) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.warehouseService = warehouseService;
        this.tagService = tagService;
        this.styleService = styleService;
        this.storeService = storeService;
        this.staffService = staffService;
        this.sizeDetailsService = sizeDetailsService;
        this.shoppingCartService = shoppingCartService;
        this.customerService = customerService;
        this.addressRepository = addressRepository;
        this.sizeDetailsRepository = sizeDetailsRepository;
    }

    @PostConstruct
    public void init() throws InputDataValidationException, CreateNewCategoryException, CategoryNotFoundException, CreateNewProductException, ProductVariantNotFoundException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException, CreateNewTagException, CreateNewStyleException, CreateNewStaffException, CreateRoleException, CreateDepartmentException, CreateNewCustomerException, CustomerNotFoundException, InvalidCartTypeException, StripeException, CreateNewStaffAccountException, StyleNotFoundException {
        createWarehouseAndStoreIfNotFound();
        createCategoryIfNotFound();
        createStaffIfNotFound();
        createSizeDetailsIfNotFound();
        createStyleIfNotFound();
        createProductIfNotFound();
        createTagIfNotFound();
        createCustomerIfNotFound();
        // initializeShoppingCartIfNotFound();
    }

    private void createCategoryIfNotFound() throws CategoryNotFoundException, CreateNewCategoryException, InputDataValidationException {
        List<Category> categories = categoryService.retrieveAllRootCategories();
        if (categories.size() == 0) {
            Category category = categoryService.createNewCategory(new Category("Shoes"), null);
            Category leafCategory = categoryService.createNewCategory(new Category("Sneakers"), category.getCategoryId());
            sneakerCategoryId = leafCategory.getCategoryId();

            Category men = categoryService.createNewCategory(new Category("Men"), null); //root
            Category topsM = categoryService.createNewCategory(new Category("Tops"), men.getCategoryId());//sub
            Category shorts = categoryService.createNewCategory(new Category("Shorts"), men.getCategoryId());//sub
            Category jeans = categoryService.createNewCategory(new Category("Jeans"), men.getCategoryId());
            jeansCategoryId = jeans.getCategoryId();
            Category shirts = categoryService.createNewCategory(new Category("Shirts"), topsM.getCategoryId()); //leaf
            shirtCategoryId = shirts.getCategoryId();
            Category tShirt = categoryService.createNewCategory(new Category("T-Shirt"), topsM.getCategoryId());//leaf
            tShirtCategoryId = tShirt.getCategoryId();
            Category poloTee = categoryService.createNewCategory(new Category("Polo Tee"), topsM.getCategoryId());//leaf
            poloTeeCategoryId = poloTee.getCategoryId();
            Category bermudas = categoryService.createNewCategory(new Category("Bermudas"), shorts.getCategoryId());//leaf
            bermudasCategoryId = bermudas.getCategoryId();
            Category sportsShorts = categoryService.createNewCategory(new Category("Sports"), shorts.getCategoryId());//leaf
            sportsShortsCategoryId= sportsShorts.getCategoryId();
            Category denimJeans = categoryService.createNewCategory(new Category("Denim Jeans"), jeans.getCategoryId());
            denimJeansWCategoryId = denimJeans.getCategoryId();

            Category women = categoryService.createNewCategory(new Category("Women"), null);
            Category topsW = categoryService.createNewCategory(new Category("Tops"), women.getCategoryId());
            Category shortsW = categoryService.createNewCategory(new Category("Shorts"), women.getCategoryId());
            shortsWCategoryId = shortsW.getCategoryId();

            Category dresses = categoryService.createNewCategory(new Category("Dresses"), women.getCategoryId());
            dressesCategoryId = dresses.getCategoryId();
            Category skirts = categoryService.createNewCategory(new Category("Skirts"), women.getCategoryId());
            skirtsCategoryId = skirts.getCategoryId();
            Category jeansW = categoryService.createNewCategory(new Category("Jeans"), women.getCategoryId());
            jeansWCategoryId = jeansW.getCategoryId();
            Category tShirtW = categoryService.createNewCategory(new Category("T-Shirt"), topsW.getCategoryId());
            tShirtWCategoryId = tShirtW.getCategoryId();
            Category maxiDress = categoryService.createNewCategory(new Category("Maxi Dress"), dresses.getCategoryId());
            maxiDressCategoryId = maxiDress.getCategoryId();
            Category miniSkirt = categoryService.createNewCategory(new Category("Mini Skirt"), skirts.getCategoryId());
            miniSkirtCategoryId = miniSkirt.getCategoryId();
            Category denimJeansW = categoryService.createNewCategory(new Category("Denim Jeans"), jeansW.getCategoryId());
            denimJeansWCategoryId = denimJeansW.getCategoryId();

        }
    }

    private void createStyleIfNotFound() throws CreateNewStyleException, InputDataValidationException {
        if (styleService.retrieveAllStyles().size() != 0) return;
        styleService.createNewStyle(new Style("Vintage"));
        styleService.createNewStyle(new Style("Bohemian"));
        styleService.createNewStyle(new Style("Chic"));
        styleService.createNewStyle(new Style("Artsy"));
        styleService.createNewStyle(new Style("Sophisticated"));
    }

    private void createProductIfNotFound() throws StyleNotFoundException, CategoryNotFoundException, InputDataValidationException, CreateNewProductException, ProductVariantNotFoundException {
        List<Product> products = productService.retrieveAllProducts();
        if (products.size() == 0) {

            // Product images
            List<String> blackProductImageUrls = new ArrayList<>();
            blackProductImageUrls.add("https://pomelofashion.imgix.net/img/p/1/9/1/1/9/7/191197.jpg?auto=compress,format&fm=webp,jpg,png&w=700&q=75");
            blackProductImageUrls.add("https://pomelofashion.imgix.net/img/p/1/9/1/1/9/8/191198.jpg?auto=compress,format&fm=webp,jpg,png&w=700&q=75");
            blackProductImageUrls.add("https://pomelofashion.imgix.net/img/p/1/9/1/1/9/9/191199.jpg?auto=compress,format&fm=webp,jpg,png&w=700&q=75");
            blackProductImageUrls.add("https://pomelofashion.imgix.net/img/p/1/9/1/2/0/0/191200.jpg?auto=compress,format&fm=webp,jpg,png&w=700&q=75");
            blackProductImageUrls.add("https://pomelofashion.imgix.net/img/p/1/9/1/2/0/2/191202.jpg?auto=compress,format&fm=webp,jpg,png&w=700&q=75");
            List<String> greenProductImageUrls = new ArrayList<>();
            greenProductImageUrls.add("https://dynamic.zacdn.com/u6MpVzFyd-4OxjGzbjVILD_d5T0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-1031-4285121-1.jpg");
            greenProductImageUrls.add("https://dynamic.zacdn.com/hpRn190IaUIwXyrcPDPfx1n0t4s=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-1031-4285121-2.jpg");
            greenProductImageUrls.add("https://dynamic.zacdn.com/1q4vDr8_Y52JMQYAXNzGgMPNiac=/fit-in/692x1000/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-1032-4285121-3.jpg");
            greenProductImageUrls.add("https://dynamic.zacdn.com/lOfHo7SbZtfcFdYuOfzfweyU9DQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-1032-4285121-4.jpg");
            List<String> redProductImageUrls = new ArrayList<>();
            redProductImageUrls.add("https://images.asos-media.com/products/columbia-klamath-range-ii-half-zip-fleece-in-black/13080944-1-black?$XXL$&wid=513&fit=constrain");
            redProductImageUrls.add("https://images.asos-media.com/products/columbia-klamath-range-ii-half-zip-fleece-in-black/13080944-2?$XXL$&wid=513&fit=constrain");
            redProductImageUrls.add("https://images.asos-media.com/products/columbia-klamath-range-ii-half-zip-fleece-in-black/13080944-3?$XXL$&wid=513&fit=constrain");
            redProductImageUrls.add("https://images.asos-media.com/products/columbia-klamath-range-ii-half-zip-fleece-in-black/13080944-4?$XXL$&wid=513&fit=constrain");

            List<SizeEnum> sizes = new ArrayList<>();
            sizes.add(SizeEnum.S);
            sizes.add(SizeEnum.M);
            sizes.add(SizeEnum.L);
            List<ColourToImageUrlsMap> colourToImageUrlsMaps = new ArrayList<>();
            colourToImageUrlsMaps.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls));
            colourToImageUrlsMaps.add(new ColourToImageUrlsMap("#1CD3A2", greenProductImageUrls));
            colourToImageUrlsMaps.add(new ColourToImageUrlsMap("#CB4154", redProductImageUrls));

            Category category = categoryService.retrieveCategoryByCategoryId(sneakerCategoryId); //sneakers

            List<String> blackProductImageUrls1 = new ArrayList<>();
            blackProductImageUrls1.add("https://dynamic.zacdn.com/5DeJBIeeOl5Hy9GK7NKB3SkpGGg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-6214-7275331-1.jpg");
            blackProductImageUrls1.add("https://dynamic.zacdn.com/OPKcmIs2U-nHiBX_FU3OeiLdY-k=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-6214-7275331-2.jpg");
            blackProductImageUrls1.add("https://dynamic.zacdn.com/sfnXU06xF0GG93gFrfaxXXbtwqY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-6214-7275331-3.jpg");
            blackProductImageUrls1.add("https://dynamic.zacdn.com/1szDUHzpCwM-neEmnBSJGvzc8Zw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-6214-7275331-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps1 = new ArrayList<>();
            colourToImageUrlsMaps1.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls1));
            List<String> whiteProductImageUrls2 = new ArrayList<>();
            whiteProductImageUrls2.add("https://dynamic.zacdn.com/gZwyL71wZqmjbTomK5lxMzn3LGI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/banana-republic-4851-1300231-1.jpg");
            whiteProductImageUrls2.add("https://dynamic.zacdn.com/hq0FSkBrRuZNQaO0SMsFPYOtdsM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/banana-republic-4851-1300231-2.jpg");
            whiteProductImageUrls2.add("https://dynamic.zacdn.com/YeViqCyXfktwu9OfNlK9Utv_tr0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/banana-republic-4851-1300231-3.jpg");
            whiteProductImageUrls2.add("https://dynamic.zacdn.com/9xB_wn6jklgaP9tHd1wjKZQ3_BU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/banana-republic-4852-1300231-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps2 = new ArrayList<>();
            colourToImageUrlsMaps2.add(new ColourToImageUrlsMap("#FFFFFF", whiteProductImageUrls2));

            List<String> navyProductImageUrls3 = new ArrayList<>();
            navyProductImageUrls3.add("https://dynamic.zacdn.com/lgt8VrdClXyWUEJjTlCHAlhMTCA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-2403-7388231-1.jpg");
            navyProductImageUrls3.add("https://dynamic.zacdn.com/giMzEl_VDWCMf-In3TXYE9yfvcQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-2403-7388231-2.jpg");
            navyProductImageUrls3.add("https://dynamic.zacdn.com/oR_ROtDLdB86d59agqONJa1ym90=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-2404-7388231-3.jpg");
            navyProductImageUrls3.add("https://dynamic.zacdn.com/TjSHHNNEB1Ka2p9opSrRQJ5XjUc=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-2404-7388231-4.jpg");
            List<String> maroonProductImageUrls3 = new ArrayList<>();
            maroonProductImageUrls3.add("https://dynamic.zacdn.com/qHqSMS_QKiQB1sol2_mmPWa6XaI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-0448-8078231-1.jpg");
            maroonProductImageUrls3.add("https://dynamic.zacdn.com/SgURl-bKo-Lt_WERRPNZnWHXr7c=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-0448-8078231-2.jpg");
            maroonProductImageUrls3.add("https://dynamic.zacdn.com/D9BzwINdF1LlbUdadlkJTqI7M-I=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-0449-8078231-3.jpg");
            maroonProductImageUrls3.add("https://dynamic.zacdn.com/qVS4zDkrxuDdqsPR5IF2VSsHaaA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-0449-8078231-4.jpg");
            List<String> whiteProductImageUrls3 = new ArrayList<>();
            whiteProductImageUrls3.add("https://dynamic.zacdn.com/a7p3LGpCr-x5HXp7QV3pcor2GOY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-2391-1678231-1.jpg");
            whiteProductImageUrls3.add("https://dynamic.zacdn.com/RK_vXbw9ecT7DQlAd0KQ9HSbCek=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-2392-1678231-2.jpg");
            whiteProductImageUrls3.add("https://dynamic.zacdn.com/itPQxOUcSmUe-vzXrhFTcn7paLE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-2392-1678231-3.jpg");
            whiteProductImageUrls3.add("https://dynamic.zacdn.com/uPpnFGppbt3AmKwiRz3xbv-foo0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/abercrombie-fitch-2392-1678231-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps3 = new ArrayList<>();
            colourToImageUrlsMaps3.add(new ColourToImageUrlsMap("#1974D2", navyProductImageUrls3));
            colourToImageUrlsMaps3.add(new ColourToImageUrlsMap("#C8385A", maroonProductImageUrls3));
            colourToImageUrlsMaps3.add(new ColourToImageUrlsMap("#FFFFFF", whiteProductImageUrls3));

            List<String> navyProductImageUrls4 = new ArrayList<>();
            navyProductImageUrls4.add("https://dynamic.zacdn.com/2-sdCZ17rsEKrX5bMq781FbVj0s=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-5213-9809221-1.jpg");
            navyProductImageUrls4.add("https://dynamic.zacdn.com/dukXcueQeFTsfxd-Uv_hFzfqnUw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-5213-9809221-2.jpg");
            navyProductImageUrls4.add("https://dynamic.zacdn.com/gsF1YSmTBkxl1IIDJV8eNRFKU4E=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-5213-9809221-3.jpg");
            navyProductImageUrls4.add("https://dynamic.zacdn.com/gK7E88xIM60UEX53WJ3I5VcSsxY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-5214-9809221-4.jpg");
            List<String> oliveProductImageUrls4 = new ArrayList<>();
            oliveProductImageUrls4.add("https://dynamic.zacdn.com/5_ZkhrqGBNx6carp4J-C7QtSYJE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-0494-6719221-1.jpg");
            oliveProductImageUrls4.add("https://dynamic.zacdn.com/ABm4ks2cmgcL_KIqrPGG9c40oRs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-0495-6719221-2.jpg");
            oliveProductImageUrls4.add("https://dynamic.zacdn.com/Hx_rily11Ip2WfR2STUgrDAOsz0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-0495-6719221-3.jpg");
            oliveProductImageUrls4.add("https://dynamic.zacdn.com/KTXX9O7F7rtIP5LGWT8LejUgcr8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-0495-6719221-4.jpg");
            List<String> pinkProductImageUrls4 = new ArrayList<>();
            pinkProductImageUrls4.add("https://dynamic.zacdn.com/75yBCtxCe8eOctNvNMhlUIyEZJ0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-2808-7229221-1.jpg");
            pinkProductImageUrls4.add("https://dynamic.zacdn.com/twUA33oRQ3LSRIdF_oBRCpmkFh0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-2809-7229221-2.jpg");
            pinkProductImageUrls4.add("https://dynamic.zacdn.com/9SL8v5P_3mgNmA_XkmY5te5otuQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-2809-7229221-3.jpg");
            pinkProductImageUrls4.add("https://dynamic.zacdn.com/RE8pvrBkbm9nR-JQFi7CImcsP08=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-2809-7229221-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps4 = new ArrayList<>();
            colourToImageUrlsMaps4.add(new ColourToImageUrlsMap("#BAB86C", oliveProductImageUrls4));
            colourToImageUrlsMaps4.add(new ColourToImageUrlsMap("#1974D2", navyProductImageUrls4));
            colourToImageUrlsMaps4.add(new ColourToImageUrlsMap("#FDDDE6", pinkProductImageUrls4));

            List<String> blackProductImageUrls5 = new ArrayList<>();
            blackProductImageUrls5.add("https://dynamic.zacdn.com/MuQ0CkgaCJANiX_-IxhjyhgwhC4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-0224-3602921-4.jpg");
            blackProductImageUrls5.add("https://dynamic.zacdn.com/aoxQHgJgaZ6hox_a5KrdjEo8uSQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-0222-3602921-1.jpg");
            blackProductImageUrls5.add("https://dynamic.zacdn.com/i65Tdry2pE67Zdyq341t4BfXRyg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-0223-3602921-3.jpg");
            blackProductImageUrls5.add("https://dynamic.zacdn.com/EV2jSxmU4WI99EloH_X9d-GACOM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-0222-3602921-2.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps5 = new ArrayList<>();
            colourToImageUrlsMaps5.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls5));

            List<String> navyProductImageUrls6 = new ArrayList<>();
            navyProductImageUrls6.add("https://dynamic.zacdn.com/-kC0Ffg4l8KZpgI1-UNXxztzQng=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-9179-0082731-1.jpg");
            navyProductImageUrls6.add("https://dynamic.zacdn.com/pZ3Esh5YeKemGiDNqcQVHwWcZ6M=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-9179-0082731-2.jpg");
            navyProductImageUrls6.add("https://dynamic.zacdn.com/_LikHzLLNDJFkbypK2QJHDxIMjA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-9179-0082731-3.jpg");
            navyProductImageUrls6.add("https://dynamic.zacdn.com/wKE48QGcJbzzkPFFCJQWUuepySw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-9180-0082731-5.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps6 = new ArrayList<>();
            colourToImageUrlsMaps6.add(new ColourToImageUrlsMap("#1974D2", navyProductImageUrls6));

            List<String> orangeProductImageUrls7 = new ArrayList<>();
            orangeProductImageUrls7.add("https://dynamic.zacdn.com/HVuC2GnPmrdZuUoBxUanFpzFI3M=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-2152-6477221-1.jpg");
            orangeProductImageUrls7.add("https://dynamic.zacdn.com/_f-EzQb1eKNsEzi2zhvI35viYc4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-2152-6477221-2.jpg");
            orangeProductImageUrls7.add("https://dynamic.zacdn.com/djvCBbP6hj3Q-sDU_7NDiQsSJC0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-2152-6477221-3.jpg");
            orangeProductImageUrls7.add("https://dynamic.zacdn.com/JGTCejXZoB1eLRrHqoRZaYhF1n0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-2153-6477221-4.jpg");
            List<String> oliveProductImageUrls7 = new ArrayList<>();
            oliveProductImageUrls7.add("https://dynamic.zacdn.com/cXUpfyhdcQCgCe8HYvvOwqakHUQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-6729-0877221-1.jpg");
            oliveProductImageUrls7.add("https://dynamic.zacdn.com/uvV57m-dVAZzuGNI9V3sXCij_cw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-6729-0877221-2.jpg");
            oliveProductImageUrls7.add("https://dynamic.zacdn.com/JSI3A88JCUsFQBbT2d1s8XL5MFc=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-6729-0877221-3.jpg");
            oliveProductImageUrls7.add("https://dynamic.zacdn.com/4RA49n1TBuCXryHbwz6EBjgneHk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-6730-0877221-4.jpg");
            List<String> redProductImageUrls7 = new ArrayList<>();
            redProductImageUrls7.add("https://dynamic.zacdn.com/2dVofp60WLo0Qy-ELBAehU6P0mw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-1661-6877221-1.jpg");
            redProductImageUrls7.add("https://dynamic.zacdn.com/11UIM9ohTblGgzsQpeC8auJK6t0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-1661-6877221-2.jpg");
            redProductImageUrls7.add("https://dynamic.zacdn.com/MYKStylLkCnvXGtZxgg-wGHZlCM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-1662-6877221-3.jpg");
            redProductImageUrls7.add("https://dynamic.zacdn.com/fzLUor6_lSieH8BZQQpoGOMYO3U=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-1662-6877221-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps7 = new ArrayList<>();
            colourToImageUrlsMaps7.add(new ColourToImageUrlsMap("#FF7538", orangeProductImageUrls7));
            colourToImageUrlsMaps7.add(new ColourToImageUrlsMap("#BAB86C", oliveProductImageUrls7));
            colourToImageUrlsMaps7.add(new ColourToImageUrlsMap("#FC2847", redProductImageUrls7));

            List<String> greyProductImageUrls8 = new ArrayList<>();
            greyProductImageUrls8.add("https://dynamic.zacdn.com/WbOFYy9alOVcrY90HvQaKLTDVpA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-4270-7531331-1.jpg");
            greyProductImageUrls8.add("https://dynamic.zacdn.com/UC67vOX8pJnavnNbyHW-9tlo-a8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-4270-7531331-2.jpg");
            greyProductImageUrls8.add("https://dynamic.zacdn.com/muYssvgpLNzMsZujISaei9dWUB4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-4271-7531331-3.jpg");
            greyProductImageUrls8.add("https://dynamic.zacdn.com/AKCqZfDolZJ2gjFfTo7lvEJfy7g=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-4271-7531331-4.jpg");
            List<String> pinkProductImageUrls8 = new ArrayList<>();
            pinkProductImageUrls8.add("https://dynamic.zacdn.com/5ogiCB9T8GMGT83UO6WKhrKJA8c=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-5047-1531331-1.jpg");
            pinkProductImageUrls8.add("https://dynamic.zacdn.com/W5BZuHdsH8BG6_ua6VdTYu-OwGA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-5047-1531331-2.jpg");
            pinkProductImageUrls8.add("https://dynamic.zacdn.com/GLI-gyWjWRM7zQ0dQ1uEiHIBZNY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-5047-1531331-3.jpg");
            pinkProductImageUrls8.add("https://dynamic.zacdn.com/OW7J2qRjjjs2LQQrmIVDSdda_bk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-5047-1531331-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps8 = new ArrayList<>();
            colourToImageUrlsMaps8.add(new ColourToImageUrlsMap("#95918C", greyProductImageUrls8));
            colourToImageUrlsMaps8.add(new ColourToImageUrlsMap("#FDDDE6", pinkProductImageUrls8));

            List<String> blackProductImageUrls9 = new ArrayList<>();
            blackProductImageUrls9.add("https://dynamic.zacdn.com/yR8IjumixkfdQ4V7AGt3E2zDSf4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-7133-363879-4.jpg");
            blackProductImageUrls9.add("https://dynamic.zacdn.com/GNkllhs4AuQNVVVZbDhm3gPISgg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-7132-363879-1.jpg");
            blackProductImageUrls9.add("https://dynamic.zacdn.com/GbRd1AYK15a9MjdjDubk4MLeCO4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-7133-363879-2.jpg");
            blackProductImageUrls9.add("https://dynamic.zacdn.com/qXOxgBmgOK_aDa6kytnoNF_N_JE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-7133-363879-3.jpg");
            List<String> pinkProductImageUrls9 = new ArrayList<>();
            pinkProductImageUrls9.add("https://dynamic.zacdn.com/sVnmedrg25-5iBtKYl0jq6yxr9U=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-0555-2549111-1.jpg");
            pinkProductImageUrls9.add("https://dynamic.zacdn.com/TEyembjbFd3DUDo3TYv-7tp5c7Y=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-0556-2549111-4.jpg");
            pinkProductImageUrls9.add("https://dynamic.zacdn.com/39sRT_Bw3NX4DXlS0rUCox9Bu78=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-0555-2549111-2.jpg");
            pinkProductImageUrls9.add("https://dynamic.zacdn.com/OrAgJ-b2UOkpX_RUeyXvGugdTCU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-0556-2549111-3.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps9 = new ArrayList<>();
            colourToImageUrlsMaps9.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls9));
            colourToImageUrlsMaps9.add(new ColourToImageUrlsMap("#FDDDE6", pinkProductImageUrls9));

            List<String> lightblueProductImageUrls10 = new ArrayList<>();
            lightblueProductImageUrls10.add("https://dynamic.zacdn.com/ENwE7FQM_wfKd2BwNO1OlOHNp0E=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/forever-21-1254-8830321-1.jpg");
            lightblueProductImageUrls10.add("https://dynamic.zacdn.com/bFEeBQ4g5Vcxy2uNEIei8fLgIGw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/forever-21-1254-8830321-2.jpg");
            lightblueProductImageUrls10.add("https://dynamic.zacdn.com/bglOzMeh1payqp8MvYW8TeIj5EM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/forever-21-1254-8830321-3.jpg");
            lightblueProductImageUrls10.add("https://dynamic.zacdn.com/_ncWSZbfRziJk4qFrvlJNeizm-8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/forever-21-1255-8830321-4.jpg");
            List<String> blueProductImageUrls10 = new ArrayList<>();
            blueProductImageUrls10.add("https://dynamic.zacdn.com/hBunWymrV4FGQDtHD49Fv8B0mz8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/forever-21-4000-5440321-1.jpg");
            blueProductImageUrls10.add("https://dynamic.zacdn.com/Bf0BfHJ-cFvPX88itJ99qTufDdo=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/forever-21-4001-5440321-2.jpg");
            blueProductImageUrls10.add("https://dynamic.zacdn.com/hCwZIciA_4DBeA4ZzZdg4IAd2Wk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/forever-21-4001-5440321-3.jpg");
            blueProductImageUrls10.add("https://dynamic.zacdn.com/pMDgSXFySByZWJuEjRpx5NKw8L8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/forever-21-4001-5440321-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps10 = new ArrayList<>();
            colourToImageUrlsMaps10.add(new ColourToImageUrlsMap("#ACE5EE", lightblueProductImageUrls10));
            colourToImageUrlsMaps10.add(new ColourToImageUrlsMap("#1F75FE", blueProductImageUrls10));

            List<String> solarorangeProductImageUrls11 = new ArrayList<>();
            solarorangeProductImageUrls11.add("https://dynamic.zacdn.com/GIzxushU1EsMKHq4eoLIu5k7zno=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-3304-9496331-1.jpg");
            solarorangeProductImageUrls11.add("https://dynamic.zacdn.com/hlxaTk7ZwRWY-HFYfEa8Mm6r6AY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-3304-9496331-2.jpg");
            solarorangeProductImageUrls11.add("https://dynamic.zacdn.com/X9mpDq5Ms9UM-cCbLWYEhjJwTes=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-3304-9496331-3.jpg");
            solarorangeProductImageUrls11.add("https://dynamic.zacdn.com/eGZLwUC9UYWY2WFFettyHxXfJ7M=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-3304-9496331-4.jpg");
            List<String> blackProductImageUrls11 = new ArrayList<>();
            blackProductImageUrls11.add("https://dynamic.zacdn.com/4E541Yc2fOXEi7tD62CtNZ3zzVA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-2655-0086331-1.jpg");
            blackProductImageUrls11.add("https://dynamic.zacdn.com/IrcWGIMfzwWHEhJZI2JhfwVxnUY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-2655-0086331-2.jpg");
            blackProductImageUrls11.add("https://dynamic.zacdn.com/YjzAC_popynzzMI1lS6FAr_COPk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-2656-0086331-3.jpg");
            blackProductImageUrls11.add("https://dynamic.zacdn.com/FJEUNJuZSafsLUMM7X__oWBYaOY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-2656-0086331-4.jpg");
            List<String> pacificblueProductImageUrls11 = new ArrayList<>();
            pacificblueProductImageUrls11.add("https://dynamic.zacdn.com/v8b1K00KAaJhcMLotRlfKyToXH8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-0551-1196331-1.jpg");
            pacificblueProductImageUrls11.add("https://dynamic.zacdn.com/EWcHrXvoq6izvyAXTExnnRx--pA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-0552-1196331-2.jpg");
            pacificblueProductImageUrls11.add("https://dynamic.zacdn.com/Vkr9I32bAD0gUGO7fWDTF6MM5tI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-0552-1196331-3.jpg");
            pacificblueProductImageUrls11.add("https://dynamic.zacdn.com/rFEjyfhL8phJl1uuVzlGC6dSyV4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/adidas-0552-1196331-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps11 = new ArrayList<>();
            colourToImageUrlsMaps11.add(new ColourToImageUrlsMap("#FF2B2B", solarorangeProductImageUrls11));
            colourToImageUrlsMaps11.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls11));
            colourToImageUrlsMaps11.add(new ColourToImageUrlsMap("#1CA9C9", pacificblueProductImageUrls11));

            List<String> blackProductImageUrls12 = new ArrayList<>();
            blackProductImageUrls12.add("https://dynamic.zacdn.com/qQs5IoO_mScU50xd8iYKNIWQa4o=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-7357-0446901-1.jpg");
            blackProductImageUrls12.add("https://dynamic.zacdn.com/9tXp4t8w7Lo5ob955rcoFNfuKi4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-7357-0446901-2.jpg");
            blackProductImageUrls12.add("https://dynamic.zacdn.com/RlHRe8gEXQSYEVXNOe-Q1ZWLCRs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-7358-0446901-3.jpg");
            blackProductImageUrls12.add("https://dynamic.zacdn.com/pQMQDCjYf7i569j3IDzvxzvzHMQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-7358-0446901-4.jpg");
            List<String> grayProductImageUrls12 = new ArrayList<>();
            grayProductImageUrls12.add("https://dynamic.zacdn.com/Zg_vt4-my70YrBO4RpIKYzqFzKs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-3267-3752921-1.jpg");
            grayProductImageUrls12.add("https://dynamic.zacdn.com/2h8tdwWuLv3IgEC1EdYbLeV05rU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-3268-3752921-2.jpg");
            grayProductImageUrls12.add("https://dynamic.zacdn.com/l5qCVBOcMK5_XFY9Z3NVtbFR38c=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-3268-3752921-3.jpg");
            grayProductImageUrls12.add("https://dynamic.zacdn.com/vrPigI174vSUl0ZiRoaMZfWdpKw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-3268-3752921-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps12 = new ArrayList<>();
            colourToImageUrlsMaps12.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls12));
            colourToImageUrlsMaps12.add(new ColourToImageUrlsMap("#95918C", grayProductImageUrls12));

            List<String> blueProductImageUrls13 = new ArrayList<>();
            blueProductImageUrls13.add("https://dynamic.zacdn.com/LRjVU_ALYmGywivZiMoszvj_74s=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/topman-5655-9547221-1.jpg");
            blueProductImageUrls13.add("https://dynamic.zacdn.com/zI-pWTANMbynWLDxkxWo26Iuzt0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/topman-5655-9547221-2.jpg");
            blueProductImageUrls13.add("https://dynamic.zacdn.com/9qLL2jopfGfQYeXTN5xwQKCg2Ls=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/topman-5656-9547221-3.jpg");
            blueProductImageUrls13.add("https://dynamic.zacdn.com/9F4qYluu2XprN3npY_1DYugc0U4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/topman-5656-9547221-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps13 = new ArrayList<>();
            colourToImageUrlsMaps13.add(new ColourToImageUrlsMap("#1F75FE", blueProductImageUrls13));

            List<String> grayProductImageUrls14 = new ArrayList<>();
            grayProductImageUrls14.add("https://dynamic.zacdn.com/K_nBd8dHItSeOyafsngtiK3LYFs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-2931-0846711-1.jpg");
            grayProductImageUrls14.add("https://dynamic.zacdn.com/Sy1H44qJEh1Ci-3XJa1JhfkXIGU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-2932-0846711-2.jpg");
            grayProductImageUrls14.add("https://dynamic.zacdn.com/ddiCVrQrlPJV7-K87EtnO5VE6L4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-2933-0846711-3.jpg");
            grayProductImageUrls14.add("https://dynamic.zacdn.com/qTjHB4MbeIyTs5rJrp30HeuWO7w=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-2934-0846711-4.jpg");
            List<String> blackProductImageUrls14 = new ArrayList<>();
            blackProductImageUrls14.add("https://dynamic.zacdn.com/fOd_4E37KXCBgaO2ynAZ9Rx8dy0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-6698-3046711-4.jpg");
            blackProductImageUrls14.add("https://dynamic.zacdn.com/kcmERagMwuX18ZU1U-LCfN0DTsE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-6697-3046711-2.jpg");
            blackProductImageUrls14.add("https://dynamic.zacdn.com/uHDeWD4XiOdGNNr3AYZqV9z5_ds=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-6697-3046711-3.jpg");

            List<String> redProductImageUrls14 = new ArrayList<>();
            redProductImageUrls14.add("https://dynamic.zacdn.com/2lCVRuYQpw3OiACAQ-aUYuFa7TQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-1035-1783001-1.jpg");
            redProductImageUrls14.add("https://dynamic.zacdn.com/zChWQ4zl72WwOxXIZq8BXLPR8ck=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-1035-1783001-2.jpg");
            redProductImageUrls14.add("https://dynamic.zacdn.com/lAaDFl6OGvWfaOB-L6xrf0TPX60=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-1036-1783001-3.jpg");
            redProductImageUrls14.add("https://dynamic.zacdn.com/Ac1qs4xZ67-auPrf7wfrutwPaD8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/champion-1037-1783001-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps14 = new ArrayList<>();
            colourToImageUrlsMaps14.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls14));
            colourToImageUrlsMaps14.add(new ColourToImageUrlsMap("#95918C", grayProductImageUrls14));
            colourToImageUrlsMaps14.add(new ColourToImageUrlsMap("#EE204D", redProductImageUrls14));

            List<String> redProductImageUrls15 = new ArrayList<>();
            redProductImageUrls15.add("https://dynamic.zacdn.com/ZAHYQgKCJsCCi-Za7y07N_oStxw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-1790-4136231-1.jpg");
            redProductImageUrls15.add("https://dynamic.zacdn.com/IrUJkWT5wDlMKuDNhuwkMg5cDRk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-1790-4136231-2.jpg");
            redProductImageUrls15.add("https://dynamic.zacdn.com/r1mgSadeZsRqaQ9_LYNz8fkqUC8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-1790-4136231-3.jpg");
            redProductImageUrls15.add("https://dynamic.zacdn.com/j3jjN5L-0_YgpYfeh1nJo5RRmCs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-1790-4136231-4.jpg");
            List<String> blackProductImageUrls15 = new ArrayList<>();
            blackProductImageUrls15.add("https://dynamic.zacdn.com/O-vw17rBbqKEqE0IXbvdESMv-mg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-5043-1336231-1.jpg");
            blackProductImageUrls15.add("https://dynamic.zacdn.com/GXwQRqQ77VBBQ96a20sYJQoQ7Ow=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-5043-1336231-2.jpg");
            blackProductImageUrls15.add("https://dynamic.zacdn.com/9MRKedERMIqYiPTd1HiH6_BOzKo=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-5044-1336231-3.jpg");
            blackProductImageUrls15.add("https://dynamic.zacdn.com/b-cTgGw7xl_uYTyWvDgBrr9wV1U=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-5044-1336231-4.jpg");
            List<String> grayProductImageUrls15 = new ArrayList<>();
            grayProductImageUrls15.add("https://dynamic.zacdn.com/b1HNZqT11sbAUDP0-KSYrWSduTA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-5091-7236231-1.jpg");
            grayProductImageUrls15.add("https://dynamic.zacdn.com/rjhjeq4nCSn88RK_c8GWT3ZT01k=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-5091-7236231-3.jpg");
            grayProductImageUrls15.add("https://dynamic.zacdn.com/k81gkn9ZxBsouK3U5t6QDymblYQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-5091-7236231-2.jpg");
            grayProductImageUrls15.add("https://dynamic.zacdn.com/XI5uFDRzggux9gQn32OEh9zefk0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-5091-7236231-4.jpg");
            List<String> midnightblueProductImageUrls15 = new ArrayList<>();
            midnightblueProductImageUrls15.add("https://dynamic.zacdn.com/v7dh-aErzXYe9Ii9c_pXtRR_MgI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-3657-1236231-1.jpg");
            midnightblueProductImageUrls15.add("https://dynamic.zacdn.com/xkvf4HAVgeAINXsDaCFtfLlH2Ow=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-3658-1236231-2.jpg");
            midnightblueProductImageUrls15.add("https://dynamic.zacdn.com/3S4-2_eXFCTVJs9iDs1mgZePnsk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-3658-1236231-3.jpg");
            midnightblueProductImageUrls15.add("https://dynamic.zacdn.com/oKXe7gTYsPSGjzKtVxArC7tNx8c=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-3658-1236231-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps15 = new ArrayList<>();
            colourToImageUrlsMaps15.add(new ColourToImageUrlsMap("#EE204D", redProductImageUrls15));
            colourToImageUrlsMaps15.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls15));
            colourToImageUrlsMaps15.add(new ColourToImageUrlsMap("#95918C", grayProductImageUrls15));
            colourToImageUrlsMaps15.add(new ColourToImageUrlsMap("#1A4876", midnightblueProductImageUrls15));

            Style vintage = styleService.retrieveStyleByStyleName("Vintage");
            Style bohemian = styleService.retrieveStyleByStyleName("Bohemian");
            Style chic = styleService.retrieveStyleByStyleName("Chic");
            Style artsy = styleService.retrieveStyleByStyleName("Artsy");
            Style sophisticated = styleService.retrieveStyleByStyleName("Sophisticated");

            Product product = new Product("001000", "Oxford Shirt", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            product.setCategory(category);
            product.getStyles().add(artsy);
            List<Long> productStyles = new ArrayList<>();
            productStyles.add(artsy.getStyleId());
            Product newProduct = productService.createNewProduct(product, category.getCategoryId(), null, productStyles, sizes, colourToImageUrlsMaps1);

            Product product2 = new Product("001100", "Micro Dot Shirt", " All over dot printed shirt\\n\" +\n" +
                    "                    \"- Collar neckline\\n\" +\n" +
                    "                    \"- Unlined\\n\" +\n" +
                    "                    \"- Regular fit\\n\" +\n" +
                    "                    \"- Button fastening\\n\" +\n" +
                    "                    \"- Cotton", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category2 = categoryService.retrieveCategoryByCategoryId(shirtCategoryId); //shirt
            product2.setCategory(category2);
            product2.getStyles().add(artsy);
            List<Long> product2Styles = new ArrayList<>();
            product2Styles.add(artsy.getStyleId());
            Product newProduct2 = productService.createNewProduct(product2, category2.getCategoryId(), null, product2Styles, sizes, colourToImageUrlsMaps2);

            Product product3 = new Product("001200", "Abercrombie & Fitch Polo Tee  ", "- Solid hue embroidered logo polo shirt\\n\" +\n" +
                    "                    \"- Sizing runs one size larger\\n\" +\n" +
                    "                    \"- Standard collared neckline\\n\" +\n" +
                    "                    \"- Unlined\\n\" +\n" +
                    "                    \"- Regular fit\\n\" +\n" +
                    "                    \"- Front button fastening", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category3 = categoryService.retrieveCategoryByCategoryId(poloTeeCategoryId);
            product3.setCategory(category3);
            product3.getStyles().add(chic);
            List<Long> product3Styles = new ArrayList<>();
            product3Styles.add(chic.getStyleId());
            Product newProduct3 = productService.createNewProduct(product3, category3.getCategoryId(), null, product3Styles, sizes, colourToImageUrlsMaps3);

            Product product4 = new Product("001300", "Strap Detail Maxi Dress", "- Pinafore dress with button detail\\n\" +\n" +
                    "                    \"- Unlined\\n\" +\n" +
                    "                    \"- Square neckline\\n\" +\n" +
                    "                    \"- Regular fit\\n\" +\n" +
                    "                    \"- Slip-on style\\n\" +\n" +
                    "                    \"- Sleeveless", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category4 = categoryService.retrieveCategoryByCategoryId(maxiDressCategoryId);
            product4.setCategory(category4);
            product4.getStyles().add(artsy);
            List<Long> product4Styles = new ArrayList<>();
            product4Styles.add(artsy.getStyleId());
            Product newProduct4 = productService.createNewProduct(product4, category4.getCategoryId(), null, product4Styles, sizes, colourToImageUrlsMaps4);

            Product product5 = new Product("001400", "High Waist Denim Jeans", "- Solid tone high waisted skinny jeans\\n\" +\n" +
                    "                   \"- Sizing runs one size larger\\n\" +\n" +
                    "                   \"- High waist\\n\" +\n" +
                    "                   \"- Skinny fit\\n\" +\n" +
                    "                   \"- Fly zipper fastening\\n\" +\n" +
                    "                   \"- Waist button fastening\\n\" +\n" +
                    "                   \"- 2 side pockets\\n\" +\n" +
                    "                   \"- 2 back patch pockets\\n\" +\n" +
                    "                   \"- Cotton blend", BigDecimal.valueOf(60.00), BigDecimal.valueOf(10.00));
            Category category5 = categoryService.retrieveCategoryByCategoryId(denimJeansWCategoryId);
            product5.setCategory(category5);
            product5.getStyles().add(sophisticated);
            product5.getStyles().add(chic);
            product5.getStyles().add(vintage);
            List<Long> product5Styles = new ArrayList<>();
            product5Styles.add(sophisticated.getStyleId());
            product5Styles.add(chic.getStyleId());
            product5Styles.add(vintage.getStyleId());
            Product newProduct5 = productService.createNewProduct(product5, category5.getCategoryId(), null, product5Styles, sizes, colourToImageUrlsMaps5);

            Product product6 = new Product("001500", "Mini Open High Slit Skirt", "- Polyester\\n\" +\n" +
                    "                    \"- Hits the upper thigh for a mini length\\n\" +\n" +
                    "                    \"- Consists of a single side slit\\n\" +\n" +
                    "                    \"- Classic, regular fit\\n\" +\n" +
                    "                    \"The Model has height: 175 cm\\n\" +\n" +
                    "                    \"Bust / Waist / Hips: 32-25-36\\n", BigDecimal.valueOf(25.00), BigDecimal.valueOf(3.99));
            Category category6 = categoryService.retrieveCategoryByCategoryId(miniSkirtCategoryId);
            product6.setCategory(category6);
            product6.getStyles().add(artsy);
            List<Long> product6Styles = new ArrayList<>();
            product6Styles.add(artsy.getStyleId());
            Product newProduct6 = productService.createNewProduct(product6, category6.getCategoryId(), null, product6Styles, sizes, colourToImageUrlsMaps6);

            Product product7 = new Product("001600", "Double Slit Embroidered Maxi Dress", "- Embroidered maxi dress with tassels\\n\" +\n" +
                    "                    \"- V neckline\\n\" +\n" +
                    "                    \"- Relaxed fit\\n\" +\n" +
                    "                    \"- Snap button fastening\\n\" +\n" +
                    "                    \"- Stretchable elastic waist with self tie\\n\" +\n" +
                    "                    \"- Adjustable straps\\n\" +\n" +
                    "                    \"- Sleeveless\\n\" +\n" +
                    "                    \"- Unlined\\n\" +\n" +
                    "                    \"- Front slits \\n\" +\n" +
                    "                    \"- Rayon", BigDecimal.valueOf(59.90), BigDecimal.valueOf(8.90));
            product7.getStyles().add(bohemian);
            List<Long> product7Styles = new ArrayList<>();
            product7Styles.add(bohemian.getStyleId());
            Product newProduct7 = productService.createNewProduct(product7, category4.getCategoryId(), null, product7Styles, sizes, colourToImageUrlsMaps7);

            Product product8 = new Product("001700", "Hollister Tech Core Tee", "- Logo graphic embroidery tee\\n\" +\n" +
                    "                    \"- Sizing runs one size larger\\n\" +\n" +
                    "                    \"- Crew neckline\\n\" +\n" +
                    "                    \"- Unlined\\n\" +\n" +
                    "                    \"- Regular fit\\n\" +\n" +
                    "                    \"- Cotton blend", BigDecimal.valueOf(29.90), BigDecimal.valueOf(4.59));
            product8.getStyles().add(chic);
            List<Long> product8Styles = new ArrayList<>();
            product8Styles.add(chic.getStyleId());
            Category category8 = categoryService.retrieveCategoryByCategoryId(tShirtWCategoryId);
            product8.setCategory(category8);
            Product newProduct8 = productService.createNewProduct(product8, category8.getCategoryId(), null, product8Styles, sizes, colourToImageUrlsMaps8);

            Product product9 = new Product("001800", "Adidas Bos Tee", "- adidas performance\\n\" +\n" +
                    "                    \"- Best for performance\\n\" +\n" +
                    "                    \"- Brand logo sports tee\\n\" +\n" +
                    "                    \"- Round neckline\\n\" +\n" +
                    "                    \"- Slim fit\\n\" +\n" +
                    "                    \"- Recycled polyblend", BigDecimal.valueOf(60.00), BigDecimal.valueOf(14.99));
            product9.getStyles().add(artsy);
            List<Long> product9Styles = new ArrayList<>();
            product9Styles.add(artsy.getStyleId());
            Product newProduct9 = productService.createNewProduct(product9, category8.getCategoryId(), null, product9Styles, sizes, colourToImageUrlsMaps9);

            Product product10 = new Product("001900", "Paperbag Belted Denim Shorts", "Liverpool FC", BigDecimal.valueOf(99.00), BigDecimal.valueOf(25.00));
            product10.getStyles().add(artsy);
            List<Long> product10Styles = new ArrayList<>();
            product10Styles.add(artsy.getStyleId());
            Category category10 = categoryService.retrieveCategoryByCategoryId(shortsWCategoryId);
            product10.setCategory(category10);
            Product newProduct10 = productService.createNewProduct(product10, category10.getCategoryId(), null, product10Styles, sizes, colourToImageUrlsMaps10);

            Product product11 = new Product("002000", "Adidas Performance M20 Shorts", "- adidas performance\\n\" +\n" +
                    "                    \"- Best for running\\n\" +\n" +
                    "                    \"- Striped brand logo running shorts\\n\" +\n" +
                    "                    \"- Climacool keeps you cool and dry in warm weather\\n\" +\n" +
                    "                    \"- 360 degrees of reflectivity\\n\" +\n" +
                    "                    \"- Mid rise\\n\" +\n" +
                    "                    \"- Regular fit\\n\" +\n" +
                    "                    \"- Drawstring and elasticated waistband fastening\\n\" +\n" +
                    "                    \"- Recycled polyblend", BigDecimal.valueOf(99.00), BigDecimal.valueOf(25.00));
            product11.getStyles().add(artsy);
            List<Long> product11Styles = new ArrayList<>();
            product11Styles.add(artsy.getStyleId());
            Product newProduct11 = productService.createNewProduct(product11, category10.getCategoryId(), null, product11Styles, sizes, colourToImageUrlsMaps11);

            Product product12 = new Product("002100", "UA Tech Graphic Shorts", "- Best for training\\n\" +\n" +
                    "                    \"- Solid-colored training shorts with brand logo\\n\" +\n" +
                    "                    \"- Natural, ultra-soft UA Tech fabric\\n\" +\n" +
                    "                    \"- Material wicks sweat & dries really fast\\n\" +\n" +
                    "                    \"- Medium ris", BigDecimal.valueOf(9.99), BigDecimal.valueOf(1.50));
            product12.getStyles().add(chic);
            List<Long> product12Styles = new ArrayList<>();
            product12Styles.add(chic.getStyleId());
            Category category12 = categoryService.retrieveCategoryByCategoryId(sportsShortsCategoryId);
            product12.setCategory(category12);
            Product newProduct12 = productService.createNewProduct(product12, category12.getCategoryId(), null, product12Styles, sizes, colourToImageUrlsMaps12);

            Product product13 = new Product("002200", "Blue Skinny Bermudas", "- Solid tone skinny denim shorts\\n\" +\n" +
                    "                    \"- Mid rise\\n\" +\n" +
                    "                    \"- Skinny fit\\n\" +\n" +
                    "                    \"- Button fastening\\n\" +\n" +
                    "                    \"- 5 pocket design\\n\" +\n" +
                    "                    \"- Cotton blend", BigDecimal.valueOf(65.90), BigDecimal.valueOf(19.90));
            product13.getStyles().add(bohemian);
            List<Long> product13Styles = new ArrayList<>();
            product13Styles.add(bohemian.getStyleId());
            Category category13 = categoryService.retrieveCategoryByCategoryId(bermudasCategoryId);
            product13.setCategory(category13);
            Product newProduct13 = productService.createNewProduct(product13, category5.getCategoryId(), null, product13Styles, sizes, colourToImageUrlsMaps13);

            Product product14 = new Product("002300", "Champion Logo T-Shirt", "- Brand logo graphic tee\\n\" +\n" +
                    "                    \"- Round neckline\\n\" +\n" +
                    "                    \"- Regular fit\\n\" +\n" +
                    "                    \"- Cotton", BigDecimal.valueOf(259.00), BigDecimal.valueOf(56.00));
            Category category14 = categoryService.retrieveCategoryByCategoryId(tShirtCategoryId); //jeans
            product4.setCategory(category14);
            product14.getStyles().add(chic);
            List<Long> product14Styles = new ArrayList<>();
            product14Styles.add(chic.getStyleId());
            Product newProduct14 = productService.createNewProduct(product14, category14.getCategoryId(), null, product14Styles, sizes, colourToImageUrlsMaps14);

            Product product15 = new Product("002400", "Tjm Tommy Flag Tee", "- Short sleeved tee with brand graphic print\\n\" +\n" +
                    "                    \"- Crew neckline\\n\" +\n" +
                    "                    \"- Unlined\\n\" +\n" +
                    "                    \"- Regular fit\\n\" +\n" +
                    "                    \"- Cotton", BigDecimal.valueOf(89.00), BigDecimal.valueOf(15.00));
            product15.getStyles().add(chic);
            List<Long> product15Styles = new ArrayList<>();
            product15Styles.add(chic.getStyleId());
            Product newProduct15 = productService.createNewProduct(product15, category14.getCategoryId(), null, product15Styles, sizes, colourToImageUrlsMaps15);
            /*
            Product product16 = new Product("002500", "Avengers Socks", "Avengers", BigDecimal.valueOf(2.50), BigDecimal.valueOf(0.30));
            product16.getStyles().add(artsy);
            List<Long> product16Styles = new ArrayList<>();
            product16Styles.add(artsy.getStyleId());
            Product newProduct16 = productService.createNewProduct(product16, category3.getCategoryId(), null, product16Styles, sizes, colourToImageUrlsMaps);

            Product product17 = new Product("002600", "Striped Shirt", "Blue Stripes Shirt ", BigDecimal.valueOf(50.00), BigDecimal.valueOf(15.00));
            product17.getStyles().add(vintage);
            List<Long> product17Styles = new ArrayList<>();
            product17Styles.add(vintage.getStyleId());
            Product newProduct17 = productService.createNewProduct(product17, category2.getCategoryId(), null, product17Styles, sizes, colourToImageUrlsMaps);

            Product product18 = new Product("002700", "Abercrombie & Fitch Shirt", "A&F", BigDecimal.valueOf(99.00), BigDecimal.valueOf(12.00));
            product18.getStyles().add(chic);
            List<Long> product18Styles = new ArrayList<>();
            product18Styles.add(chic.getStyleId());
            Product newProduct18 = productService.createNewProduct(product18, category2.getCategoryId(), null, product18Styles, sizes, colourToImageUrlsMaps);

            Product product19 = new Product("002800", "Abercrombie & Fitch T Shirt", "A&F", BigDecimal.valueOf(45), BigDecimal.valueOf(5.00));
            product19.getStyles().add(chic);
            List<Long> product19Styles = new ArrayList<>();
            product19Styles.add(chic.getStyleId());
            Product newProduct19 = productService.createNewProduct(product19, category6.getCategoryId(), null, product19Styles, sizes, colourToImageUrlsMaps);

            Product product20 = new Product("002900", "Abercrombie & Fitch Jeans", "Beautiful Skirt", BigDecimal.valueOf(120.00), BigDecimal.valueOf(29.00));
            product20.getStyles().add(chic);
            List<Long> product20Styles = new ArrayList<>();
            product20Styles.add(chic.getStyleId());
            Product newProduct20 = productService.createNewProduct(product20, category7.getCategoryId(), null, product20Styles, sizes, colourToImageUrlsMaps);

            Product product21 = new Product("003000", "Ankle Socks", "Ankle Socks", BigDecimal.valueOf(5.00), BigDecimal.valueOf(0.50));
            product21.getStyles().add(chic);
            List<Long> product21Styles = new ArrayList<>();
            product21Styles.add(chic.getStyleId());
            Product newProduct21 = productService.createNewProduct(product21, category3.getCategoryId(), null, product21Styles, sizes, colourToImageUrlsMaps);

            Product product22 = new Product("003100", "Docker Bermudas", "Bermudas", BigDecimal.valueOf(45.00), BigDecimal.valueOf(8.99));
            Category category8 = categoryService.retrieveCategoryByCategoryId(bermudasCategoryId);
            product22.setCategory(category8);
            product22.getStyles().add(vintage);
            List<Long> product22Styles = new ArrayList<>();
            product22Styles.add(vintage.getStyleId());
            Product newProduct22 = productService.createNewProduct(product22, category8.getCategoryId(), null, product22Styles, sizes, colourToImageUrlsMaps);

            Product product23 = new Product("003200", "Slim Fit Bermudas", "Slim Fit Skirt", BigDecimal.valueOf(29.90), BigDecimal.valueOf(10.00));
            product23.getStyles().add(vintage);
            List<Long> product23Styles = new ArrayList<>();
            product23Styles.add(vintage.getStyleId());
            Product newProduct23 = productService.createNewProduct(product23, category8.getCategoryId(), null, product23Styles, sizes, colourToImageUrlsMaps);

            Product product24 = new Product("003300", "Regular Cut Bermudas", "Regular Cut", BigDecimal.valueOf(29.90), BigDecimal.valueOf(10.00));
            product24.getStyles().add(vintage);
            List<Long> product24Styles = new ArrayList<>();
            product24Styles.add(vintage.getStyleId());
            Product newProduct24 = productService.createNewProduct(product24, category8.getCategoryId(), null, product24Styles, sizes, colourToImageUrlsMaps);

            Product product25 = new Product("003400", "Skinny Jeans", "Tight Fit", BigDecimal.valueOf(79.90), BigDecimal.valueOf(14.99));
            product25.getStyles().add(chic);
            List<Long> product25Styles = new ArrayList<>();
            product25Styles.add(chic.getStyleId());
            Product newProduct25 = productService.createNewProduct(product25, category7.getCategoryId(), null, product25Styles, sizes, colourToImageUrlsMaps);

            Product product26 = new Product("003500", "Parachute Dress", "Weew", BigDecimal.valueOf(59.90), BigDecimal.valueOf(14.90));
            Category category9 = categoryService.retrieveCategoryByCategoryId(dressesCategoryId);
            product26.setCategory(category9);
            product26.getStyles().add(bohemian);
            List<Long> product26Styles = new ArrayList<>();
            product26Styles.add(bohemian.getStyleId());
            Product newProduct26 = productService.createNewProduct(product26, category9.getCategoryId(), null, product26Styles, sizes, colourToImageUrlsMaps);
            productVariantId26 = newProduct26.getProductVariants().get(0).getProductVariantId();

            Product product27 = new Product("003600", "Long Sleeve Dress", "Long Sleeve Dress", BigDecimal.valueOf(49.90), BigDecimal.valueOf(10.90));
            product27.getStyles().add(sophisticated);
            List<Long> product27Styles = new ArrayList<>();
            product27Styles.add(sophisticated.getStyleId());
            Product newProduct27 = productService.createNewProduct(product27, category9.getCategoryId(), null, product27Styles, sizes, colourToImageUrlsMaps);
            productVariantId27 = newProduct27.getProductVariants().get(0).getProductVariantId();

            Product product28 = new Product("003700", "Short Sleeve Dress", "Short Sleeve Skirt", BigDecimal.valueOf(35.90), BigDecimal.valueOf(8.00));
            product28.getStyles().add(sophisticated);
            List<Long> product28Styles = new ArrayList<>();
            product28Styles.add(sophisticated.getStyleId());
            Product newProduct28 = productService.createNewProduct(product28, category9.getCategoryId(), null, product28Styles, sizes, colourToImageUrlsMaps);
            productVariantId28 = newProduct28.getProductVariants().get(0).getProductVariantId();

            Product product29 = new Product("003800", "Sleeveless Dress", "Sleeveless Dress", BigDecimal.valueOf(49.90), BigDecimal.valueOf(12.00));
            product29.getStyles().add(sophisticated);
            List<Long> product29Styles = new ArrayList<>();
            product29Styles.add(sophisticated.getStyleId());
            Product newProduct29 = productService.createNewProduct(product29, category9.getCategoryId(), null, product29Styles, sizes, colourToImageUrlsMaps);
            productVariantId29 = newProduct29.getProductVariants().get(0).getProductVariantId();

            Product product30 = new Product("003900", "Long Sleeve Shirt", "Long sleeve ", BigDecimal.valueOf(89.90), BigDecimal.valueOf(23.00));
            product30.getStyles().add(sophisticated);
            List<Long> product30Styles = new ArrayList<>();
            product30Styles.add(sophisticated.getStyleId());
            Product newProduct30 = productService.createNewProduct(product30, category2.getCategoryId(), null, product30Styles, sizes, colourToImageUrlsMaps);
            productVariantId30 = newProduct30.getProductVariants().get(0).getProductVariantId(); */
        }
    }

    private void createWarehouseAndStoreIfNotFound() throws InputDataValidationException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException, ProductVariantNotFoundException {
        if (warehouseService.retrieveAllWarehouses().size() == 0) {

            warehouseService.createWarehouse(new Warehouse(),
                    new Address("Pasir Ris Drive 1", "#01-01", 510144, "Pasir Ris Building"));
            List<Warehouse> warehouses = warehouseService.retrieveAllWarehouses();

            storeService.createNewStore(new Store("Store 1", 8, 4,
                    Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 2, 6,
                    new Address("310 Orchard Rd", "", 238864, "Apricot N' Nut - Tang Plaza")));

            storeService.createNewStore(new Store("Store 2", 5, 2,
                    Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 1, 3,
                    new Address("270 Orchard Rd", "", 238857, "Apricot N' Nut - Orchard")));
            List<Store> stores = storeService.retrieveAllStores();

            productService.assignProductStock(warehouses, stores, null);
        }
    }

    private void createTagIfNotFound() throws CreateNewTagException, InputDataValidationException {
        if (tagService.retrieveAllTags().size() != 0) return;
        tagService.createNewTag(new Tag("Promotion"));
        tagService.createNewTag(new Tag("Popular"));
        tagService.createNewTag(new Tag("Sales"));
        tagService.createNewTag(new Tag("New Arrival"));
    }

    private void createStaffIfNotFound() throws CreateNewStaffException, InputDataValidationException, CreateRoleException, CreateDepartmentException, CreateNewStaffAccountException {
        if (staffService.retrieveAllStaff().size() != 0) return;
        Product product = new Product("0010", "Stan Smith", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
        Department departmentHR = staffService.createNewDepartment("HR");
        Department departmentIT = staffService.createNewDepartment("IT");
        Department departmentStore = staffService.createNewDepartment("Store");
        Department departmentWarehouse = staffService.createNewDepartment("Warehouse");
        Department departmentSalesMarketing = staffService.createNewDepartment("Sales and Marketing");
        Department departmentCustomerService = staffService.createNewDepartment("Customer Service");

        Role role1 = staffService.createNewRole(RoleNameEnum.ASSISTANT);
        Role role2 = staffService.createNewRole(RoleNameEnum.ASSISTANT_MANAGER);
        Role role3 = staffService.createNewRole(RoleNameEnum.MANAGER);
        Role role4 = staffService.createNewRole(RoleNameEnum.DIRECTOR);
        List<Long>staffToConfigure =new ArrayList<>();


        Staff staff = new Staff("Ware", "house", 2, "116c", "geogrelee@gmail.com", BigDecimal.valueOf(10000));
        Address a1 = new Address("2E Hong San Walk", "#03-08", 612140, "Palm Garden");
        Staff newStaff = staffService.createNewStaff(staff, a1, role1.getRoleId(), departmentWarehouse.getDepartmentId());

        Staff staff2 = new Staff("IT", "STAFF", 13, "213C", "annabeltwe@gmail.com", BigDecimal.valueOf(10000));
        Address a2 = new Address("Block 235 Chua Chu Kang Ave 2", "#15-234", 689051, "-");
        Staff newStaff2 = staffService.createNewStaff(staff2, a2, role2.getRoleId(), departmentIT.getDepartmentId());


        Staff staff3 = new Staff("HR", "STAFF", 1, "131Z", "Caiyl@gmail.com", BigDecimal.valueOf(10000));
        Address a3 = new Address("Block 234 Bishan South", "#30-08", 321140, "Palm Garden");
        Staff newStaff3 = staffService.createNewStaff(staff3, a3, role1.getRoleId(), departmentHR.getDepartmentId());


        Staff staff4 = new Staff("Sales", "Marketing", 20, "971C", "rayquaza@gmail.com", BigDecimal.valueOf(10000));
        Address a4 = new Address("Block 130 Taman Jurong", "#15-02", 231334, "-");
        Staff newStaff4 = staffService.createNewStaff(staff4, a4, role1.getRoleId(), departmentSalesMarketing.getDepartmentId());


        Staff staff5 = new Staff("St", "ore", 14, "187E", "tonychan@hotmail.com" ,BigDecimal.valueOf(10000));
        staff5.setAddress(new Address ("Block 2 Ang Mo Kio Avenue 5","#11-05",321140,"-"));
        Staff newStaff5 = staffService.createNewStaff(staff5, staff5.getAddress(), role3.getRoleId(), departmentStore.getDepartmentId());


        Staff staff6 = new Staff("St", "ore", 2, "312Z", "SergioEs@gmail.com",BigDecimal.valueOf(10000) );
        staff6.setAddress(new Address ("Block 567 Bishan South","#20-08",321567,"-"));
        Staff newStaff6 = staffService.createNewStaff(staff6, staff6.getAddress(), role1.getRoleId(), departmentStore.getDepartmentId());

        staffToConfigure.add(newStaff.getStaffId());
        staffToConfigure.add(newStaff2.getStaffId());
        staffToConfigure.add(newStaff3.getStaffId());
        staffToConfigure.add(newStaff4.getStaffId());
        staffToConfigure.add(newStaff5.getStaffId());
        staffToConfigure.add(newStaff6.getStaffId());
        staffService.createNewStaffAccount(staffToConfigure);

//
//        Staff staff7 = new Staff("Jay", "Wang", 10, "560D", "WangDaXia@gmail.com",BigDecimal.valueOf(10000) );
//        staff7.setAddress(new Address ("Block 23 Lakeside Street 4","#13-18",312540,"Lake Vista"));
//        Staff newStaff7 = staffService.createNewStaff(staff7, staff7.getAddress(), role3, departmentRetail);
//
//
//        Staff staff8 = new Staff("Gabriel", "Ng", 06, "678H", "Gabz2133@gmail.com" ,BigDecimal.valueOf(10000));
//        staff8.setAddress(new Address ("Block 234 Bishan South","#30-08",321140,"-"));
//        Staff newStaff8 = staffService.createNewStaff(staff8, staff8.getAddress(), role2, departmentRetail);
//
//        Staff staff9 = new Staff("Joseph", "Cai", 5, "764Z", "Jx29131@gmail.com" ,BigDecimal.valueOf(10000));
//        staff9.setAddress(new Address ("Lorong 24 Toa Payoh","#03-278",651234,"-"));
//        Staff newStaff9 = staffService.createNewStaff(staff9, staff9.getAddress(), role1, departmentCustomerService);
//
//        Staff staff10 = new Staff("Eugene", "Lee", 8, "862F", "pokemonmaster213@gmail.com" ,BigDecimal.valueOf(10000));
//        staff10.setAddress(new Address ("Block 21 Lorong Chuan","#30-08",687121,"-"));
//        Staff newStaff10 = staffService.createNewStaff(staff10, staff10.getAddress(), role3, departmentCustomerService);
//
//        Staff staff11 = new Staff("Nicole", "Choo", 2, "141C", "Nic213@gmail.com", BigDecimal.valueOf(10000));
//        staff11.setAddress(new Address ("Block 234 Bukit Panjang","#14-08",654131,"Maysprings"));
//        Staff newStaff11 = staffService.createNewStaff(staff11, staff11.getAddress(), role3, departmentHR);
//
//        Staff staff12 = new Staff("Jolin", "Chai", 0, "999H", "Jolin@gmail.com",BigDecimal.valueOf(10000) );
//        staff12.setAddress(new Address ("Block 14 Serangoon North","#30-08",533140,"-"));
//        Staff newStaff12 = staffService.createNewStaff(staff12, staff12.getAddress(), role3, departmentRetail);
//
//        Staff staff13 = new Staff("Cat", "Lee", 7, "561Z", "Catlee@gmail.com" ,BigDecimal.valueOf(10000));
//        staff13.setAddress(new Address ("Block 234 Bukit Batok Street 52","#15-108",321140,"-"));
//        Staff newStaff13 = staffService.createNewStaff(staff13, staff13.getAddress(), role3, departmentRetail);
//
//        Staff staff14 = new Staff("James", "Caramel", 0, "097F", "jamesey13@gmail.com" ,BigDecimal.valueOf(10000));
//        staff14.setAddress(new Address ("Block 1 Teck Whye Gardens","#14-08",131561,"-"));
//        Staff newStaff14 = staffService.createNewStaff(staff14, staff14.getAddress(), role3, departmentRetail);
//
//        Staff staff15 = new Staff("Natalie", "Ong", 1, "662Z", "Nat123@gmail.com" ,BigDecimal.valueOf(10000));
//        staff15.setAddress(new Address ("Block 234 Bishan North","#30-08",321140,"-"));
//        Staff newStaff15 = staffService.createNewStaff(staff15, staff15.getAddress(), role1, departmentRetail);
//
//        Staff staff16 = new Staff("Xiao Ming", "Wai", 6, "123C", "waiwaiwai@gmail.com",BigDecimal.valueOf(10000) );
//        staff16.setAddress(new Address ("2B Hong San Walk","#23-08",689051,"Palm Garden"));
//        Staff newStaff16 = staffService.createNewStaff(staff16, staff16.getAddress(), role1, departmentRetail);
//
//        Staff staff17 = new Staff("Timothy", "Ngoh", 12, "835U", "TimNgoh@gmail.com",BigDecimal.valueOf(10000) );
//        staff17.setAddress(new Address ("Block 13 Sengkang Drive","#30-08",321340,"-"));
//        Staff newStaff17 = staffService.createNewStaff(staff17, staff17.getAddress(), role1, departmentRetail);
//
//        Staff staff18 = new Staff("Scarlet", "Ng", 1, "613C", "RedScarlet@gmail.com" ,BigDecimal.valueOf(10000));
//        staff18.setAddress(new Address ("Block 114 Punggol South","#14-154",413140,"-"));
//        Staff newStaff18 = staffService.createNewStaff(staff18, staff18.getAddress(), role1, departmentRetail);
//
//        Staff staff19 = new Staff("June", "April", 6, "188Z", "Months@gmail.com" ,BigDecimal.valueOf(10000));
//        staff19.setAddress(new Address ("Block 234 Bishan South","#30-08",613213,"-"));
//        Staff newStaff19 = staffService.createNewStaff(staff19, staff19.getAddress(), role1, departmentRetail);
//
//        Staff staff20 = new Staff("Lucas", "Chan", 0, "456Z", "lucas134@gmail.com",BigDecimal.valueOf(10000) );
//        staff20.setAddress(new Address ("Block 9 Marine Parade Drive","#15-08",313510,"-"));
//        Staff newStaff20 = staffService.createNewStaff(staff20, staff20.getAddress(), role2, departmentRetail);
//
//        Staff staff21 = new Staff("Marshall", "Ong", 5, "874Z", "Marshall12312315@gmail.com" ,BigDecimal.valueOf(10000));
//        staff21.setAddress(new Address ("Block 234 Simei Street 23","#31-413",572131,"-"));
//        Staff newStaff21 = staffService.createNewStaff(staff21, staff21.getAddress(), role2, departmentRetail);
//
//        Staff staff22 = new Staff("Robin", "Poh", 21, "190B", "Robinhood@gmail.com" ,BigDecimal.valueOf(10000));
//        staff22.setAddress(new Address ("Block 7 Yishun Avenue 2","#29-145",765140,"-"));
//        Staff newStaff22 = staffService.createNewStaff(staff22, staff22.getAddress(), role3, departmentRetail);
//
//        Staff staff23 = new Staff("Kevin", "Ng", 0, "400F", "KevJumba@gmail.com" ,BigDecimal.valueOf(10000));
//        staff23.setAddress(new Address ("Block 234 Yio Chu Kang Road","#30-108",642531,"-"));
//        Staff newStaff23 = staffService.createNewStaff(staff23, staff23.getAddress(), role2, departmentRetail);
//
//        Staff staff24 = new Staff("Tom", "Tan", 3, "987A", "TT2314@gmail.com",BigDecimal.valueOf(10000) );
//        staff24.setAddress(new Address ("Block 4 Clementi Avenue 2","#12-08",641312,"-"));
//        Staff newStaff24 = staffService.createNewStaff(staff24, staff24.getAddress(), role1, departmentFinance);
//
//        Staff staff25 = new Staff("Ernest", "Loy", 7, "562Z", "EarnestLty@gmail.com" ,BigDecimal.valueOf(10000));
//        staff25.setAddress(new Address ("Block 22 Clementi Avenue 3","#01-03",561314,"-"));
//        Staff newStaff25 = staffService.createNewStaff(staff25, staff25.getAddress(), role1, departmentRetail);
//
//        Staff staff26 = new Staff("Hafiz", "Mohammad", 0, "231Z", "coolboy@gmail.com",BigDecimal.valueOf(10000) );
//        staff26.setAddress(new Address ("Block 167 Serangoon Drive","#10-08",512314,"-"));
//        Staff newStaff26 = staffService.createNewStaff(staff26, staff26.getAddress(), role2, departmentRetail);
//
//        Staff staff27 = new Staff("Luqman", "Mohammad", 0, "446Z", "lepakonecorner@gmail.com",BigDecimal.valueOf(10000));
//        staff27.setAddress(new Address ("Block 851 Khatib Street 54","#07-112",741313,"-"));
//        Staff newStaff27 = staffService.createNewStaff(staff27, staff27.getAddress(), role1, departmentRetail);
//
//        Staff staff28 = new Staff("Nash", "Mohammad", 7, "871Z", "nashpotatol@gmail.com",BigDecimal.valueOf(10000) );
//        staff28.setAddress(new Address ("Block 902 Yishun Street 21","#04-148",579013,"-"));
//        Staff newStaff28 = staffService.createNewStaff(staff28, staff28.getAddress(), role1, departmentRetail);
//
//        Staff staff29 = new Staff("Jack", "Lee", 10, "311Z", "jacklee13@gmail.com" ,BigDecimal.valueOf(10000));
//        staff29.setAddress(new Address ("Block 234 Bedok North","#05-156",156145,"-"));
//        Staff newStaff29 = staffService.createNewStaff(staff29, staff29.getAddress(), role1, departmentRetail);
//
//        Staff staff30 = new Staff("Mark", "Tan", 2, "341O", "MarkTanty@gmail.com",BigDecimal.valueOf(10000) );
//        staff30.setAddress(new Address ("Block 1 Bukit Gombak Road","#23-18",313150,"-"));
//        Staff newStaff30 = staffService.createNewStaff(staff30, staff30.getAddress(), role2, departmentRetail);

    }

    private void createSizeDetailsIfNotFound() {
        if (sizeDetailsService.retrieveAllSizeDetails().size() == 0) {
            SizeDetails xs = new SizeDetails(SizeEnum.XS);
            sizeDetailsRepository.save(xs);

            System.out.println(sizeDetailsService.retrieveSizeDetailsByEnum("XS"));
            sizeDetailsRepository.save(new SizeDetails(SizeEnum.S));
            sizeDetailsRepository.save(new SizeDetails(SizeEnum.M));
            sizeDetailsRepository.save(new SizeDetails(SizeEnum.L));
            sizeDetailsRepository.save(new SizeDetails(SizeEnum.XL));
        }
    }

    private void createCustomerIfNotFound() throws InputDataValidationException, CreateNewCustomerException, CustomerNotFoundException, StripeException {
        if (customerService.retrieveAllCustomers().size() == 0) {
            Customer customer = customerService.createNewCustomer(new Customer("Lila", "Facchini",
                    "lila@gmail.com", "password"));
            customerId = customer.getCustomerId();
            customerService.retrieveCustomerByCustomerId(customerId);
            customer.setVerified(true);
        }
    }

    private void initializeShoppingCartIfNotFound() throws ProductVariantNotFoundException, CustomerNotFoundException, InvalidCartTypeException {
        if (shoppingCartService.initRetrieveAllShoppingCartItem().size() == 0) {
            shoppingCartService.updateQuantityOfProductVariant(2, productVariantId26, customerId, ONLINE_SHOPPING_CART);
            shoppingCartService.updateQuantityOfProductVariant(3, productVariantId27, customerId, ONLINE_SHOPPING_CART);
            shoppingCartService.updateQuantityOfProductVariant(3, productVariantId28, customerId, ONLINE_SHOPPING_CART);
            shoppingCartService.updateQuantityOfProductVariant(3, productVariantId29, customerId, ONLINE_SHOPPING_CART);
            shoppingCartService.updateQuantityOfProductVariant(3, productVariantId30, customerId, ONLINE_SHOPPING_CART);
        }
    }
}
