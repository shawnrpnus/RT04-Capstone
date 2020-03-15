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
@Profile({"dev", "prod"})
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
    private static Long casualShortsCategoryId;
    private static Long tShirtWCategoryId;
    private static Long jeansCategoryId;
    private static Long jeansWCategoryId;
    private static Long bermudasCategoryId;
    private static Long poloTeeCategoryId;
    private static Long miniSkirtCategoryId;
    private static Long maxiDressCategoryId;
    private static Long denimJeansWCategoryId;
    private static Long denimJeansCategoryId;
    private static Long casualShortsWCategoryId;
    private static Long denimShortsWCategoryId;
    private static Long midiSkirtCategoryId;
    private static Long workDressCategoryId;

    private Long customerId;
    private Long productVariantId26;
    private Long productVariantId27;
    private Long productVariantId28;
    private Long productVariantId29;
    private Long productVariantId30;

    private Long warehouseId;
    private Long store1Id;
    private Long store2Id;

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
           /* Category category = categoryService.createNewCategory(new Category("Shoes"), null);
            Category leafCategory = categoryService.createNewCategory(new Category("Sneakers"), category.getCategoryId());
            sneakerCategoryId = leafCategory.getCategoryId();*/

            Category men = categoryService.createNewCategory(new Category("Men"), null); //root
            Category topsM = categoryService.createNewCategory(new Category("Tops"), men.getCategoryId());//sub
            Category shorts = categoryService.createNewCategory(new Category("Shorts"), men.getCategoryId());//sub
            Category jeans = categoryService.createNewCategory(new Category("Jeans"), men.getCategoryId());
            jeansCategoryId = jeans.getCategoryId();
            Category shirts = categoryService.createNewCategory(new Category("Shirts"), topsM.getCategoryId()); //leaf
            shirtCategoryId = shirts.getCategoryId();
            Category tShirt = categoryService.createNewCategory(new Category("T-Shirts"), topsM.getCategoryId());//leaf
            tShirtCategoryId = tShirt.getCategoryId();
            Category poloTee = categoryService.createNewCategory(new Category("Polo Tees"), topsM.getCategoryId());//leaf
            poloTeeCategoryId = poloTee.getCategoryId();
            Category bermudas = categoryService.createNewCategory(new Category("Bermudas"), shorts.getCategoryId());//leaf
            bermudasCategoryId = bermudas.getCategoryId();
            Category casualShorts = categoryService.createNewCategory(new Category("Casual"), shorts.getCategoryId());//leaf
            casualShortsCategoryId = casualShorts.getCategoryId();
            Category denimJeans = categoryService.createNewCategory(new Category("Denim Jeans"), jeans.getCategoryId());
            denimJeansWCategoryId = denimJeans.getCategoryId();

            Category women = categoryService.createNewCategory(new Category("Women"), null);
            Category topsW = categoryService.createNewCategory(new Category("Tops"), women.getCategoryId());
            Category shortsW = categoryService.createNewCategory(new Category("Shorts"), women.getCategoryId());
            shortsWCategoryId = shortsW.getCategoryId();
            Category dresses = categoryService.createNewCategory(new Category("Dresses"), women.getCategoryId());//sub
            dressesCategoryId = dresses.getCategoryId();
            Category skirts = categoryService.createNewCategory(new Category("Skirts"), women.getCategoryId());//sub
            skirtsCategoryId = skirts.getCategoryId();
            Category jeansW = categoryService.createNewCategory(new Category("Jeans"), women.getCategoryId());//sub
            jeansWCategoryId = jeansW.getCategoryId();
            Category denimShortsW = categoryService.createNewCategory(new Category("Denim"), shortsW.getCategoryId());
            denimShortsWCategoryId = denimShortsW.getCategoryId();
            Category tShirtW = categoryService.createNewCategory(new Category("T-Shirts"), topsW.getCategoryId());
            tShirtWCategoryId = tShirtW.getCategoryId();
            Category maxiDress = categoryService.createNewCategory(new Category("Maxi Dresses"), dresses.getCategoryId());
            maxiDressCategoryId = maxiDress.getCategoryId();
            Category workDress = categoryService.createNewCategory(new Category("Work Dresses"), dresses.getCategoryId());
            workDressCategoryId = workDress.getCategoryId();
            Category miniSkirt = categoryService.createNewCategory(new Category("Mini Skirts"), skirts.getCategoryId());
            miniSkirtCategoryId = miniSkirt.getCategoryId();
            Category midiSkirt = categoryService.createNewCategory(new Category("Midi Skirts"), skirts.getCategoryId());
            midiSkirtCategoryId = midiSkirt.getCategoryId();
            Category denimJeansW = categoryService.createNewCategory(new Category("Denim Jeans"), jeansW.getCategoryId());
            denimJeansWCategoryId = denimJeansW.getCategoryId();
            Category casualWShorts = categoryService.createNewCategory(new Category("Casual"), shortsW.getCategoryId());
            casualShortsWCategoryId = casualWShorts.getCategoryId();

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
            colourToImageUrlsMaps6.add(new ColourToImageUrlsMap("#000000", navyProductImageUrls6));

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

            List<String> violetProductImageUrls16 = new ArrayList<>();
            violetProductImageUrls16.add("https://dynamic.zacdn.com/LbREkDnput7LGBtReXeeZk-13tA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-4702-7494221-1.jpg");
            violetProductImageUrls16.add("https://dynamic.zacdn.com/X2r2Tdn4NKilNZp3AGHnsyK0fEg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-4703-7494221-2.jpg");
            violetProductImageUrls16.add("https://dynamic.zacdn.com/5Kpx42xUODUKQbACJZFYeWyXcZE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-4703-7494221-3.jpg");
            violetProductImageUrls16.add("https://dynamic.zacdn.com/os3RSNsLIqZFSZFlFzxYfjtiuxg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-4703-7494221-4.jpg");
            List<String> blackProductImageUrls16 = new ArrayList<>();
            blackProductImageUrls16.add("https://dynamic.zacdn.com/hTWC4twRQz0PxE7lMifdWviA7NE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-4833-0874221-1.jpg");
            blackProductImageUrls16.add("https://dynamic.zacdn.com/db13SNNT1yCUaaawDwKQuMpllSY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-4834-0874221-2.jpg");
            blackProductImageUrls16.add("https://dynamic.zacdn.com/UibH5tm7OZDJ9KA4Eq-cwE5lEiY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-4834-0874221-3.jpg");
            blackProductImageUrls16.add("https://dynamic.zacdn.com/0i5aVoqQJejqwzlcorOHBagrFOs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-4834-0874221-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps16 = new ArrayList<>();
            colourToImageUrlsMaps16.add(new ColourToImageUrlsMap("#7366BD", violetProductImageUrls16));
            colourToImageUrlsMaps16.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls16));

            List<String> biegeProductImageUrls17 = new ArrayList<>();
            biegeProductImageUrls17.add("https://dynamic.zacdn.com/6MaYzUOtdkyBU1OS4JE_ChpicNs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5616-6862811-1.jpg");
            biegeProductImageUrls17.add("https://dynamic.zacdn.com/2k7IsQy_aSOrXzIDHZJ_ebZQo1Q=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5616-6862811-2.jpg");
            biegeProductImageUrls17.add("https://dynamic.zacdn.com/HuWf0n_MLrxNVB0irnV4vS3sIRQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5617-6862811-3.jpg");
            biegeProductImageUrls17.add("https://dynamic.zacdn.com/rl5uR-rGRtH0owOgZio2PwMvmr4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5617-6862811-4.jpg");
            List<String> blackProductImageUrls17 = new ArrayList<>();
            blackProductImageUrls11.add("https://dynamic.zacdn.com/O-9taEorxb3-5J5CWPKFBJfu2Ck=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5624-2172811-1.jpg");
            blackProductImageUrls11.add("https://dynamic.zacdn.com/bez0cBpel1k7AruavxxgS-DEVpI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5624-2172811-2.jpg");
            blackProductImageUrls11.add("https://dynamic.zacdn.com/Lfr5J-eQ0aqKIEWEkhqkSOoJt60=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5625-2172811-3.jpg");
            blackProductImageUrls11.add("https://dynamic.zacdn.com/PluowINt9W-kLGqB_sppxQ9UJuM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5625-2172811-4.jpg");
            List<String> pinkProductImageUrls17 = new ArrayList<>();
            pinkProductImageUrls17.add("https://dynamic.zacdn.com/pWK2vef9f2dXkJJO4RwRuQqNEqw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5628-4072811-1.jpg");
            pinkProductImageUrls17.add("https://dynamic.zacdn.com/seRUwlQC37UxqbYUchwJOd-Nm0s=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5629-4072811-2.jpg");
            pinkProductImageUrls17.add("https://dynamic.zacdn.com/ZdDLWsDmT9_fAnquBEZvBcbS_ME=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5629-4072811-3.jpg");
            pinkProductImageUrls17.add("https://dynamic.zacdn.com/pQxlLKkPsKXUnLM9nFqczD9p5h8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-5629-4072811-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps17 = new ArrayList<>();
            colourToImageUrlsMaps17.add(new ColourToImageUrlsMap("#F5F5DC", biegeProductImageUrls17));
            colourToImageUrlsMaps17.add(new ColourToImageUrlsMap("#FDDDE6", pinkProductImageUrls17));
            colourToImageUrlsMaps17.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls17));

            List<String> blueProductImageUrls18 = new ArrayList<>();
            blueProductImageUrls18.add("https://dynamic.zacdn.com/rztJ9Sqc0oQAgykIiitQWpWMFmU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-8996-1996621-1.jpg");
            blueProductImageUrls18.add("https://dynamic.zacdn.com/3U7bNi11mvDbd4zl1I6Dhx8UVr8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-8997-1996621-2.jpg");
            blueProductImageUrls18.add("https://dynamic.zacdn.com/N-khN2zSIoPF_mKXsmbK11VYVjk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-8997-1996621-3.jpg");
            blueProductImageUrls18.add("https://dynamic.zacdn.com/w0rgpKpbKKEUCTifh5vJ1v7XAlE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-8997-1996621-4.jpg");
            List<String> lightblueImageUrls18 = new ArrayList<>();
            lightblueImageUrls18.add("https://dynamic.zacdn.com/-3po4sLQWbxLQRoTXuZprm5sOQk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-5799-6996621-1.jpg");
            lightblueImageUrls18.add("https://dynamic.zacdn.com/s9oK1dqYdCBGxHdBEs1PslaxJUk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-5799-6996621-2.jpg");
            lightblueImageUrls18.add("https://dynamic.zacdn.com/jY40HGuBgOpJRRGLxnkzpUs0Mf4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-5800-6996621-3.jpg");
            lightblueImageUrls18.add("https://dynamic.zacdn.com/N0Actdh9hNDZs6o9YBo2NATIRnU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/something-borrowed-5801-6996621-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps18 = new ArrayList<>();
            colourToImageUrlsMaps18.add(new ColourToImageUrlsMap("#1F75FE", blueProductImageUrls18));
            colourToImageUrlsMaps18.add(new ColourToImageUrlsMap("#ACE5EE", lightblueImageUrls18));

            List<String> brownProductImageUrls19 = new ArrayList<>();
            brownProductImageUrls19.add("https://dynamic.zacdn.com/z0kU5Ko_PN396SVPxCuo0Lv1cMc=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-7153-1561521-1.jpg");
            brownProductImageUrls19.add("https://dynamic.zacdn.com/MlacmgAPybJmknKVPBDzmHSBVJI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-7153-1561521-2.jpg");
            brownProductImageUrls19.add("https://dynamic.zacdn.com/rABvJ3vqw0ZO_OjIQRUQjH7XkTM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-7154-1561521-3.jpg");
            brownProductImageUrls19.add("https://dynamic.zacdn.com/9QcJ_zlx_ZefkcDSB3T0cIpW7CM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-7154-1561521-4.jpg");
            List<String> lightblueImageUrls19 = new ArrayList<>();
            lightblueImageUrls19.add("https://dynamic.zacdn.com/FZCirlVxxYQj9ajVJ3QIEXpGaAk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-7152-9661521-1.jpg");
            lightblueImageUrls19.add("https://dynamic.zacdn.com/AYo6A0LO5fKfmtpp-Q3OX93FBD0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-7153-9661521-2.jpg");
            lightblueImageUrls19.add("https://dynamic.zacdn.com/i2V7ClyUm2sxr0Lb0_47pMX7yuE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-7153-9661521-3.jpg");
            lightblueImageUrls19.add("https://dynamic.zacdn.com/YphTvuRmb17xYKuS8tcibpNxZ28=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-7153-9661521-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps19 = new ArrayList<>();
            colourToImageUrlsMaps19.add(new ColourToImageUrlsMap("#D2B48C", brownProductImageUrls19));
            colourToImageUrlsMaps19.add(new ColourToImageUrlsMap("#6699CC", lightblueImageUrls19));

            List<String> orangeImageUrls20 = new ArrayList<>();
            orangeImageUrls20.add("https://dynamic.zacdn.com/hXjmbwWVGLJYDzU3crsuwT_NMLo=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/esprit-4662-2872901-1.jpg");
            orangeImageUrls20.add("https://dynamic.zacdn.com/GnzNoLH68iWsHXZkuPCd5hUo6vg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/esprit-4662-2872901-2.jpg");
            orangeImageUrls20.add("https://dynamic.zacdn.com/4zk1b2z1jpJ9iQF1bFVPtajOyCs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/esprit-4663-2872901-3.jpg");
            orangeImageUrls20.add("https://dynamic.zacdn.com/xlGfKgfvHXWQjxt46D5MFbwXGvA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/esprit-4663-2872901-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps20 = new ArrayList<>();
            colourToImageUrlsMaps20.add(new ColourToImageUrlsMap("#FFAE42", orangeImageUrls20));

            List<String> pinkProductImageUrls21 = new ArrayList<>();
            pinkProductImageUrls21.add("https://dynamic.zacdn.com/FQLYaNnbeJMMCB_IS-4Wy2Zs0gg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1914-6586131-1.jpg");
            pinkProductImageUrls21.add("https://dynamic.zacdn.com/nFQYifAtjwwjopo2SHRDmo_zhJQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1914-6586131-2.jpg");
            pinkProductImageUrls21.add("https://dynamic.zacdn.com/ojruGhtgBeiakOi26B8Yqr8HFGY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1914-6586131-3.jpg");
            pinkProductImageUrls21.add("https://dynamic.zacdn.com/QJvvFw4L3FDbvKw2_4PMLHuaivY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1914-6586131-4.jpg");
            List<String> lavenderProductImageUrls21 = new ArrayList<>();
            lavenderProductImageUrls21.add("https://dynamic.zacdn.com/qHUu-MixXvPk3GE8hao7002z8yc=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1915-7586131-1.jpg");
            lavenderProductImageUrls21.add("https://dynamic.zacdn.com/EZxhVERUfFd5zQ1Nc6RhzGhris8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1915-7586131-2.jpg");
            lavenderProductImageUrls21.add("https://dynamic.zacdn.com/z34SzqcmU7XOz0Umk0p8tpisEPI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1915-7586131-3.jpg");
            lavenderProductImageUrls21.add("https://dynamic.zacdn.com/HHzOxp_YlbvlATcZeM30BQpv3Eg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1916-7586131-5.jpg");
            List<String> grayProductImageUrls21 = new ArrayList<>();
            grayProductImageUrls21.add("https://dynamic.zacdn.com/TiUdGmlqNv90L1zN6cXm7Ejx0IQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1913-3586131-1.jpg");
            grayProductImageUrls21.add("https://dynamic.zacdn.com/c68t4L5uGqLIu0DKU_eBSbTmrq4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1913-3586131-2.jpg");
            grayProductImageUrls21.add("https://dynamic.zacdn.com/Sz1iUph5Og2VQquoD2JXYPonMlk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1913-3586131-3.jpg");
            grayProductImageUrls21.add("https://dynamic.zacdn.com/ADtIuNA9wy06jVx6RCWfoYy8E6c=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/pomelo-1914-3586131-5.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps21 = new ArrayList<>();
            colourToImageUrlsMaps21.add(new ColourToImageUrlsMap("#CDC5C2", grayProductImageUrls21));
            colourToImageUrlsMaps21.add(new ColourToImageUrlsMap("#A2A2D0", lavenderProductImageUrls21));
            colourToImageUrlsMaps21.add(new ColourToImageUrlsMap("#FDDDE6", pinkProductImageUrls21));

            List<String> orangeyellowImageUrls22 = new ArrayList<>();
            orangeyellowImageUrls22.add("https://dynamic.zacdn.com/VUTVIRn-vWcQmGVcrWKf7X8ewAo=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-6401-8219221-1.jpg");
            orangeyellowImageUrls22.add("https://dynamic.zacdn.com/Hs8D0eXR5TQ7LgAtY058ru-cnDI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-6402-8219221-2.jpg");
            orangeyellowImageUrls22.add("https://dynamic.zacdn.com/dLxOUyn0kWr8hl1TCEopIBqD3yE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-6402-8219221-3.jpg");
            orangeyellowImageUrls22.add("https://dynamic.zacdn.com/Mv9Vlmni1mgaZdBrvs4_uIoVrF4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-6402-8219221-4.jpg");
            List<String> lightblueProductImageUrls22 = new ArrayList<>();
            lightblueProductImageUrls22.add("https://dynamic.zacdn.com/0dqxDWCQ1gSYQSKgp2rlglKSAU0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-2228-7029221-1.jpg");
            lightblueProductImageUrls22.add("https://dynamic.zacdn.com/p2zIoBTIdF8p1uizfGO00DcTugw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-2228-7029221-2.jpg");
            lightblueProductImageUrls22.add("https://dynamic.zacdn.com/kGHPEHWIK655Nwbp-erVayX6pcA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-2229-7029221-3.jpg");
            lightblueProductImageUrls22.add("https://dynamic.zacdn.com/Oqj6HidonqD9rfltgKpbtU7nO0k=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-2229-7029221-4.jpg");
            List<String> grayProductImageUrls22 = new ArrayList<>();
            grayProductImageUrls22.add("https://dynamic.zacdn.com/1wHm5adV4yEXaeaqrl6h2nLXYQQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-4836-0319221-1.jpg");
            grayProductImageUrls22.add("https://dynamic.zacdn.com/UoSvqJFo6_RTjL3zlGk9-mTp3aM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-4837-0319221-2.jpg");
            grayProductImageUrls22.add("https://dynamic.zacdn.com/zib2MCd2QjaQorkCcZv5Fmr9LZc=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-4837-0319221-3.jpg");
            grayProductImageUrls22.add("https://dynamic.zacdn.com/8uYyZrwMWcIj14EzHPF_TAIJtpA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-4837-0319221-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps22 = new ArrayList<>();
            colourToImageUrlsMaps22.add(new ColourToImageUrlsMap("#F8D568", orangeyellowImageUrls22));
            colourToImageUrlsMaps22.add(new ColourToImageUrlsMap("#ACE5EE", lightblueProductImageUrls22));
            colourToImageUrlsMaps22.add(new ColourToImageUrlsMap("#95918C", grayProductImageUrls22));

            List<String> blueImageUrls23 = new ArrayList<>();
            blueImageUrls23.add("https://dynamic.zacdn.com/PD4lcLxw-nwv8IcRxnzaihRYyHQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-3073-9102921-1.jpg");
            blueImageUrls23.add("https://dynamic.zacdn.com/mi_Z9_3bDqf9gUYi5HaUexdO8gY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-3074-9102921-2.jpg");
            blueImageUrls23.add("https://dynamic.zacdn.com/NHDB9-fIXCvpz-Wye1Ss2UJGdLQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-3074-9102921-3.jpg");
            blueImageUrls23.add("https://dynamic.zacdn.com/mP_DE5YJOrHz6kLv7y67MMQJjJ0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-3074-9102921-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps23 = new ArrayList<>();
            colourToImageUrlsMaps23.add(new ColourToImageUrlsMap("#1F75FE", blueImageUrls23));

            List<String> lightblueImageUrls24 = new ArrayList<>();
            lightblueImageUrls24.add("https://dynamic.zacdn.com/Ta8tJ13CaD9hJO1Iani8xiu4rl0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-1610-8042431-1.jpg");
            lightblueImageUrls24.add("https://dynamic.zacdn.com/K4T20yayOAko8Td7m5B_48fn9Zg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-1610-8042431-2.jpg");
            lightblueImageUrls24.add("https://dynamic.zacdn.com/sMWSZAyFO3Q4ZwnH6G3S7aWQwoI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-1610-8042431-3.jpg");
            lightblueImageUrls24.add("https://dynamic.zacdn.com/3lQ0KlruEZZLpndK3eRrlZ77Vs8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/mango-1611-8042431-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps24 = new ArrayList<>();
            colourToImageUrlsMaps24.add(new ColourToImageUrlsMap("#ACE5EE", lightblueImageUrls24));

            List<String> pinkProductImageUrls25 = new ArrayList<>();
            pinkProductImageUrls25.add("https://dynamic.zacdn.com/fXnYiEpJdIBUDtXfAy-_RJ7kghM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-1552-2342921-1.jpg");
            pinkProductImageUrls25.add("https://dynamic.zacdn.com/KEipwdvz96VfDQ219ijhx49Xq24=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-1552-2342921-2.jpg");
            pinkProductImageUrls25.add("https://dynamic.zacdn.com/4O7KoacGIps27DXFcJAsI5dDsTc=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-1552-2342921-3.jpg");
            pinkProductImageUrls25.add("https://dynamic.zacdn.com/YroIgU1k2TKJpwEV2q-o1QvMyB4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-1552-2342921-4.jpg");
            List<String> blackProductImageUrls25 = new ArrayList<>();
            blackProductImageUrls25.add("https://dynamic.zacdn.com/BJjmQptcvAYGvB2z9H3ZSKKw_Lw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-1262-099099-1.jpg");
            blackProductImageUrls25.add("https://dynamic.zacdn.com/OFYOb6gmolilPXvl01Cu2QmcO7M=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-1262-099099-2.jpg");
            blackProductImageUrls25.add("https://dynamic.zacdn.com/kyNwPC75a0VeUlEVEZAvWYjfZvs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-1263-099099-4.jpg");
            blackProductImageUrls25.add("https://dynamic.zacdn.com/V_MbVMMG8y_iGHqPJtk0HuvoKqw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-1263-099099-3.jpg");
            List<String> brightpinkProductImageUrls25 = new ArrayList<>();
            brightpinkProductImageUrls25.add("https://dynamic.zacdn.com/NY9J10XEM3Dt9BX9oYLuRGywBdI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-2824-8486901-1.jpg");
            brightpinkProductImageUrls25.add("https://dynamic.zacdn.com/TKJyW0EnEheEVVHP0W5PxdJr2OA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-2825-8486901-2.jpg");
            brightpinkProductImageUrls25.add("https://dynamic.zacdn.com/1Br088bsVaeyiy5WlLrRm6bbre4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-2825-8486901-3.jpg");
            brightpinkProductImageUrls25.add("https://dynamic.zacdn.com/IqL7PpxYi8Xn4jGA3zXbQrAn9_I=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-2825-8486901-4.jpg");
            List<String> brightblueProductImageUrls25 = new ArrayList<>();
            brightblueProductImageUrls25.add("https://dynamic.zacdn.com/o-GuCTEV8VCuQ2PDyAmxtxE5KN4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-5221-5396901-1.jpg");
            brightblueProductImageUrls25.add("https://dynamic.zacdn.com/1TSNs1p98UN8cYUX2jo0EQZOiSU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-5221-5396901-2.jpg");
            brightblueProductImageUrls25.add("https://dynamic.zacdn.com/rxEwU1UVCNsG0UUEpgozS4ZNr6U=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-5221-5396901-3.jpg");
            brightblueProductImageUrls25.add("https://dynamic.zacdn.com/d-MkJEUY2KTmRLiSjNuALYMyPtQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/under-armour-5222-5396901-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps25 = new ArrayList<>();
            colourToImageUrlsMaps25.add(new ColourToImageUrlsMap("#FDDDE6", pinkProductImageUrls25));
            colourToImageUrlsMaps25.add(new ColourToImageUrlsMap("#F78FA7", brightpinkProductImageUrls25));
            colourToImageUrlsMaps25.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls25));
            colourToImageUrlsMaps25.add(new ColourToImageUrlsMap("#78DBE2", brightblueProductImageUrls25));

            List<String> pinkProductImageUrls26 = new ArrayList<>();
            pinkProductImageUrls26.add("https://dynamic.zacdn.com/_UWenRBaSB0qpf2QV0ExpMxekWE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-2595-9865331-1.jpg");
            pinkProductImageUrls26.add("https://dynamic.zacdn.com/xOKH75ueIq558mhszMC9oFp4ILY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-2595-9865331-2.jpg");
            pinkProductImageUrls26.add("https://dynamic.zacdn.com/s4Sii5LUrEEvEaCTLZ_QniOzcCs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-2595-9865331-3.jpg");
            pinkProductImageUrls26.add("https://dynamic.zacdn.com/3P466gp3jE8aD59RbE8vvqf8SfU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-2596-9865331-4.jpg");
            List<String> grayImageUrls26 = new ArrayList<>();
            grayImageUrls26.add("https://dynamic.zacdn.com/T7rFbZMWiM9j3Xdn9Zho50h1vTU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-3391-4495331-1.jpg");
            grayImageUrls26.add("https://dynamic.zacdn.com/RR_5j0QLMLJsTgauhs8Qe4LMLMc=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-3391-4495331-2.jpg");
            grayImageUrls26.add("https://dynamic.zacdn.com/ixL0rnntaSmFEI4b3Hxz09P4G80=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-3391-4495331-3.jpg");
            grayImageUrls26.add("https://dynamic.zacdn.com/kG5X4jfzvNO-g26z8Ue63nPCUFo=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-3391-4495331-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps26 = new ArrayList<>();
            colourToImageUrlsMaps26.add(new ColourToImageUrlsMap("#FDDDE6", pinkProductImageUrls26));
            colourToImageUrlsMaps26.add(new ColourToImageUrlsMap("#95918C",grayImageUrls26));

            List<String> khakiProductImageUrls27 = new ArrayList<>();
            khakiProductImageUrls27.add("https://dynamic.zacdn.com/yE30-dhZvB_ZxXOhfbsB47k8GWQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/superdry-0717-4370531-1.jpg");
            khakiProductImageUrls27.add("https://dynamic.zacdn.com/xZWiS8kDcCx89BO5ZrmeHGKUS4I=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/superdry-0718-4370531-2.jpg");
            khakiProductImageUrls27.add("https://dynamic.zacdn.com/_qhEjz2iEZN4RF1U_rVxT_89xfY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/superdry-0718-4370531-3.jpg");
            khakiProductImageUrls27.add("https://dynamic.zacdn.com/_kv--wChfRVeVhcbX2MmT_A-2to=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/superdry-0718-4370531-4.jpg");
            List<String> blackImageUrls27 = new ArrayList<>();
            blackImageUrls27.add("https://dynamic.zacdn.com/le9B2n7sbSC3Ug0uYlweJX5-Uhg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/superdry-4715-6470531-1.jpg");
            blackImageUrls27.add("https://dynamic.zacdn.com/oeFMpphVYQoGUTLofZtC7dLFwbg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/superdry-4715-6470531-2.jpg");
            blackImageUrls27.add("https://dynamic.zacdn.com/q73d2_XZAUImGq43vmDID7UC3sE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/superdry-4715-6470531-3.jpg");
            blackImageUrls27.add("https://dynamic.zacdn.com/qXqCS5vwjMf_GjTsUVzSLw_qHhM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/superdry-4716-6470531-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps27 = new ArrayList<>();
            colourToImageUrlsMaps27.add(new ColourToImageUrlsMap("#BDB76B", khakiProductImageUrls27));
            colourToImageUrlsMaps27.add(new ColourToImageUrlsMap("#000000",blackImageUrls27));

            List<String> blueProductImageUrls28 = new ArrayList<>();
            blueProductImageUrls28.add("https://dynamic.zacdn.com/QLx3RnUh05lfAjiSDIrtW3Bcniw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-4335-5107231-1.jpg");
            blueProductImageUrls28.add("https://dynamic.zacdn.com/sxl2f4MUwDrU_lVDK5SZOnqVlg0=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-4336-5107231-2.jpg");
            blueProductImageUrls28.add("https://dynamic.zacdn.com/jygkL0ODyvpUcceAaxOfz4APOOQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-4336-5107231-3.jpg");
            blueProductImageUrls28.add("https://dynamic.zacdn.com/nGhuQoySxjQXqmaFF17F_S3azSM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-4336-5107231-4.jpg");
            List<String> lightblueImageUrls28 = new ArrayList<>();
            lightblueImageUrls28.add("https://dynamic.zacdn.com/SDEgKKdBA-s42d6vAZKeGQyirVI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-9829-5596231-1.jpg");
            lightblueImageUrls28.add("https://dynamic.zacdn.com/xqR6fDmejErBrluN08nadqbHTsM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-9829-5596231-2.jpg");
            lightblueImageUrls28.add("https://dynamic.zacdn.com/mG1e2v1JQ0vlMv5rHD8JIeawhGI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-9829-5596231-3.jpg");
            lightblueImageUrls28.add("https://dynamic.zacdn.com/9d9z__0BpBplEfzY80pyB73waPk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/tommy-hilfiger-9829-5596231-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps28 = new ArrayList<>();
            colourToImageUrlsMaps28.add(new ColourToImageUrlsMap("#1F75FE", blueProductImageUrls28));
            colourToImageUrlsMaps28.add(new ColourToImageUrlsMap("#ACE5EE",lightblueImageUrls28));

            List<String> khakiImageUrls29 = new ArrayList<>();
            khakiImageUrls29.add("https://dynamic.zacdn.com/WacxPLeg6raCmIflMThkhFl6fPU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/burton-menswear-london-3061-2677631-1.jpg");
            khakiImageUrls29.add("https://dynamic.zacdn.com/Q5lGbBiFc1L2_67e93UQRgnkVa4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/burton-menswear-london-3061-2677631-2.jpg");
            khakiImageUrls29.add("https://dynamic.zacdn.com/63edCYmcGmavYhWvP81-LeNKVg4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/burton-menswear-london-3061-2677631-3.jpg");
            khakiImageUrls29.add("https://dynamic.zacdn.com/nh8c5sxeLutfVBBSa6vn7avV0zM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/burton-menswear-london-3062-2677631-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps29 = new ArrayList<>();
            colourToImageUrlsMaps29.add(new ColourToImageUrlsMap("#BDB76B", khakiImageUrls29));

            List<String> midnightblueProductImageUrls30 = new ArrayList<>();
            midnightblueProductImageUrls30.add("https://dynamic.zacdn.com/SDT6ZWEwMtc8QIqijz3ZGQM7jLo=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/threads-by-the-produce-4832-7830431-1.jpg");
            midnightblueProductImageUrls30.add("https://dynamic.zacdn.com/4W9cs7DaNcvsjSBF2uIXQZDKxIY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/threads-by-the-produce-4832-7830431-2.jpg");
            midnightblueProductImageUrls30.add("https://dynamic.zacdn.com/xdDLAgEtJbgyfoDggnkksn2WKOk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/threads-by-the-produce-4833-7830431-3.jpg");
            midnightblueProductImageUrls30.add("https://dynamic.zacdn.com/2SVTi_BV-cTr1tRMDukghOml_CM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/threads-by-the-produce-4833-7830431-4.jpg");
            List<String> lightblueImageUrls30 = new ArrayList<>();
            lightblueImageUrls30.add("https://dynamic.zacdn.com/0MlqVHRAxAyrO18zIheqlb7DyCA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/threads-by-the-produce-9001-1830431-1.jpg");
            lightblueImageUrls30.add("https://dynamic.zacdn.com/ZehJhvK54rqxOrMLWhBqrtv_5dg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/threads-by-the-produce-9002-1830431-2.jpg");
            lightblueImageUrls30.add("https://dynamic.zacdn.com/vss2Mwei0GZjl6o6wbY7i7wsuZs=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/threads-by-the-produce-9002-1830431-3.jpg");
            lightblueImageUrls30.add("https://dynamic.zacdn.com/XMvqpp7vf_z42y8fDMFHQNoAouI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/threads-by-the-produce-9002-1830431-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps30 = new ArrayList<>();
            colourToImageUrlsMaps30.add(new ColourToImageUrlsMap("#1A4876", midnightblueProductImageUrls30));
            colourToImageUrlsMaps30.add(new ColourToImageUrlsMap("#78DBE2",lightblueImageUrls30));

            List<String> blackImageUrls31 = new ArrayList<>();
            blackImageUrls31.add("https://dynamic.zacdn.com/usOBy89hnEbNeNrsGFCrvjHFPzw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-0307-747699-1.jpg");
            blackImageUrls31.add("https://dynamic.zacdn.com/s-4ZFnolxGJnx03JCbEm5evSzGA=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-0307-747699-2.jpg");
            blackImageUrls31.add("https://dynamic.zacdn.com/1tSm4AkW5PL9ANJkH4iwkW5-R_Q=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-0307-747699-3.jpg");
            blackImageUrls31.add("https://dynamic.zacdn.com/foiDca9tNc0Mpqaw8gmWURf2zoE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-0307-747699-4.jpg");
            List<String> midnightblueProductImageUrls31 = new ArrayList<>();
            midnightblueProductImageUrls31.add("https://dynamic.zacdn.com/YrLp6SxMuVzYdX1DSOm0Ub3kWaQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-9182-317699-1.jpg");
            midnightblueProductImageUrls31.add("https://dynamic.zacdn.com/gLrfj1dp0guelgmwAaenyH4gE7U=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-9182-317699-2.jpg");
            midnightblueProductImageUrls31.add("https://dynamic.zacdn.com/Q7ivXthH9BYRt6-s848ZXbZMAVk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-9183-317699-3.jpg");
            midnightblueProductImageUrls31.add("https://dynamic.zacdn.com/9j7XJYwT-m2hsewwpTz2voc4VCU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-9183-317699-4.jpg");
            List<String> redProductImageUrls31 = new ArrayList<>();
            redProductImageUrls31.add("https://dynamic.zacdn.com/_ikYnCdQamDC4huUrXMDfYsNY30=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-3653-717699-1.jpg");
            redProductImageUrls31.add("https://dynamic.zacdn.com/q2fjLWfwK8IlQ6LRc7CchN9KR8M=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-3653-717699-2.jpg");
            redProductImageUrls31.add("https://dynamic.zacdn.com/h6GDn3z_7t0paj0x9psbPMV5Pt8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-3653-717699-3.jpg");
            redProductImageUrls31.add("https://dynamic.zacdn.com/7b9R1ch4pFCjaZVNU2Zj9cw71Qk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-3653-717699-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps31 = new ArrayList<>();
            colourToImageUrlsMaps31.add(new ColourToImageUrlsMap("#000000", blackImageUrls31));
            colourToImageUrlsMaps31.add(new ColourToImageUrlsMap("#1A4876", midnightblueProductImageUrls31));
            colourToImageUrlsMaps31.add(new ColourToImageUrlsMap("#EE204D", redProductImageUrls31));

            List<String> grayImageUrls32 = new ArrayList<>();
            grayImageUrls32.add("https://dynamic.zacdn.com/8hbfZYdlUIPVlZa3NfYxVcdPtjY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/polo-ralph-lauren-5702-0306021-1.jpg");
            grayImageUrls32.add("https://dynamic.zacdn.com/WFnI7SJrz1zTL7PhDMTVnxDkYMc=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/polo-ralph-lauren-5702-0306021-2.jpg");
            grayImageUrls32.add("https://dynamic.zacdn.com/hmQR_7ZiamUG4JYAajo30gCzIlM=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/polo-ralph-lauren-5703-0306021-3.jpg");
            grayImageUrls32.add("https://dynamic.zacdn.com/e6t4eraNUJahw_HlaWr-DpCHtw4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/polo-ralph-lauren-5703-0306021-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps32 = new ArrayList<>();
            colourToImageUrlsMaps32.add(new ColourToImageUrlsMap("#95918C", grayImageUrls32));

            List<String> blackImageUrls33 = new ArrayList<>();
            blackImageUrls33.add("https://dynamic.zacdn.com/ECuWvTrhi4vBBtvoSEMrwtOCx_I=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-4472-3765331-1.jpg");
            blackImageUrls33.add("https://dynamic.zacdn.com/pusSzklmZgLW1dVHHwtzKFAgZYo=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-4472-3765331-2.jpg");
            blackImageUrls33.add("https://dynamic.zacdn.com/FGncKT_RPjp1ZTLE5Pr0yoHZ44g=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-4472-3765331-3.jpg");
            blackImageUrls33.add("https://dynamic.zacdn.com/ReUtOyXnB_Ndwy15EN5IQNNaj-U=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-4472-3765331-4.jpg");
            List<String> whiteProductImageUrls33 = new ArrayList<>();
            whiteProductImageUrls33.add("https://dynamic.zacdn.com/iYW8mQs_k1JCEihK2T00jV0sMtg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-9553-0375331-1.jpg");
            whiteProductImageUrls33.add("https://dynamic.zacdn.com/q0JHK6IywUSn_PX_F9HCdVHnWYE=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-9554-0375331-2.jpg");
            whiteProductImageUrls33.add("https://dynamic.zacdn.com/NpcsjCuCwPwj-aXif9Yz1D5pM8c=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-9554-0375331-3.jpg");
            whiteProductImageUrls33.add("https://dynamic.zacdn.com/U2_uWmfXQO6j6OrW6-BxppHlNIw=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/hollister-9554-0375331-4.jpg");
            List<String> maroonProductImageUrls33 = new ArrayList<>();
            maroonProductImageUrls33.add("https://dynamic.zacdn.com/_ikYnCdQamDC4huUrXMDfYsNY30=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-3653-717699-1.jpg");
            maroonProductImageUrls33.add("https://dynamic.zacdn.com/q2fjLWfwK8IlQ6LRc7CchN9KR8M=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-3653-717699-2.jpg");
            maroonProductImageUrls33.add("https://dynamic.zacdn.com/h6GDn3z_7t0paj0x9psbPMV5Pt8=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-3653-717699-3.jpg");
            maroonProductImageUrls33.add("https://dynamic.zacdn.com/7b9R1ch4pFCjaZVNU2Zj9cw71Qk=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/puma-3653-717699-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps33 = new ArrayList<>();
            colourToImageUrlsMaps33.add(new ColourToImageUrlsMap("#FFFFFF", whiteProductImageUrls33));
            colourToImageUrlsMaps33.add(new ColourToImageUrlsMap("#C8385A", maroonProductImageUrls33));
            colourToImageUrlsMaps33.add(new ColourToImageUrlsMap("#000000", blackImageUrls33));

            List<String> brownImageUrls34 = new ArrayList<>();
            brownImageUrls34.add("https://dynamic.zacdn.com/jiQIgCpBgqOAuhQ7Zc79AOOadPU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/topman-4501-6914821-1.jpg");
            brownImageUrls34.add("https://dynamic.zacdn.com/7XJOs0kl0RCMFbpH7N-2FPF9m5w=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/topman-4502-6914821-4.jpg");
            brownImageUrls34.add("https://dynamic.zacdn.com/Zqaq6fbZY2c6P7Fb9Y6o9WtgVQ4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/topman-4502-6914821-2.jpg");
            brownImageUrls34.add("https://dynamic.zacdn.com/rShlIuWpwSzwU7k7f0k2uiOrSjY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/topman-4502-6914821-3.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps34 = new ArrayList<>();
            colourToImageUrlsMaps34.add(new ColourToImageUrlsMap("#D2B48C", brownImageUrls34));

            List<String> blueProductImageUrls35 = new ArrayList<>();
            blueProductImageUrls35.add("https://dynamic.zacdn.com/KdZoiYO3I8-LB10QAT_ax_kk9XU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-5776-1617321-1.jpg");
            blueProductImageUrls35.add("https://dynamic.zacdn.com/uNLk6li2JJ9SDJclzUApX3igGtc=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-5777-1617321-4.jpg");
            blueProductImageUrls35.add("https://dynamic.zacdn.com/XHXpYT4BUUZoarmF5sqEt5KgCG4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-5776-1617321-2.jpg");
            blueProductImageUrls35.add("https://dynamic.zacdn.com/eKfLoVlaBg0y9YAZgHzmyxQv-h4=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-5776-1617321-3.jpg");
            List<String> lightblueImageUrls35 = new ArrayList<>();
            lightblueImageUrls35.add("https://dynamic.zacdn.com/OXh1Hv0fDEzzcilTsWS_zgYBVoQ=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-0736-2717321-1.jpg");
            lightblueImageUrls35.add("https://dynamic.zacdn.com/GboRl1oYbU0DMjW8EaD1vfcikYg=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-0736-2717321-2.jpg");
            lightblueImageUrls35.add("https://dynamic.zacdn.com/5jjl1t1cY0OglSZybx8PZBT6pQU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-0737-2717321-3.jpg");
            lightblueImageUrls35.add("https://dynamic.zacdn.com/x9WxZKaJXd7M2v5eOtf5gRlf_HY=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-basics-0737-2717321-4.jpg");
            List<ColourToImageUrlsMap> colourToImageUrlsMaps35 = new ArrayList<>();
            colourToImageUrlsMaps35.add(new ColourToImageUrlsMap("#F5F5DC", blueProductImageUrls35));
            colourToImageUrlsMaps35.add(new ColourToImageUrlsMap("#ACE5EE", lightblueImageUrls35));

            Style vintage = styleService.retrieveStyleByStyleName("Vintage");
            Style bohemian = styleService.retrieveStyleByStyleName("Bohemian");
            Style chic = styleService.retrieveStyleByStyleName("Chic");
            Style artsy = styleService.retrieveStyleByStyleName("Artsy");
            Style sophisticated = styleService.retrieveStyleByStyleName("Sophisticated");

            Product product = new Product("001000", "Oxford Shirt", "- Monochrome short sleeve oxford shirt\n" +
                    "- Collared neckline\n" +
                    "- Unlined\n" +
                    "- Skinny fit\n" +
                    "- Front button fastening", BigDecimal.valueOf(69.90), BigDecimal.valueOf(15.90));
            Category category2 = categoryService.retrieveCategoryByCategoryId(shirtCategoryId);
            Category category14 = categoryService.retrieveCategoryByCategoryId(tShirtCategoryId);
            product.getStyles().add(artsy);
            List<Long> productStyles = new ArrayList<>();
            productStyles.add(artsy.getStyleId());
            Product newProduct = productService.createNewProduct(product, category2.getCategoryId(), null, productStyles, sizes, colourToImageUrlsMaps1);

            Product product2 = new Product("001100", "Micro Dot Shirt", " All over dot printed shirt\n"  +
                   "- Collar neckline\\n\" +\n" +
                    "- Unlined\n" +
                    "- Regular fit\n" +
                    "- Button fastening\n" +
                    "- Cotton", BigDecimal.valueOf(59.90), BigDecimal.valueOf(20.90));
            product2.setCategory(category2);
            product2.getStyles().add(artsy);
            List<Long> product2Styles = new ArrayList<>();
            product2Styles.add(artsy.getStyleId());
            Product newProduct2 = productService.createNewProduct(product2, category2.getCategoryId(), null, product2Styles, sizes, colourToImageUrlsMaps2);

            Product product3 = new Product("001200", "Abercrombie & Fitch Polo Tee ","- Embroidered logo polo shirt\n" +
                    "- Sizing runs one size larger\n" +
                    "- Standard collared neckline\n" +
                    "- Unlined\n" +
                    "- Regular fit\n" +
                    "- Front button fastening\n" +
                    "- Cotton blend" , BigDecimal.valueOf(99.00), BigDecimal.valueOf(40.00));
            Category category3 = categoryService.retrieveCategoryByCategoryId(poloTeeCategoryId);
            product3.setCategory(category3);
            product3.getStyles().add(chic);
            List<Long> product3Styles = new ArrayList<>();
            product3Styles.add(chic.getStyleId());
            Product newProduct3 = productService.createNewProduct(product3, category3.getCategoryId(), null, product3Styles, sizes, colourToImageUrlsMaps3);

            Product product4 = new Product("001300", "Strap Detail Maxi Dress", "- Printed maxi dress with asymmetrical neckline\n" +
                    "- Partial lining\n" +
                    "- Cold shoulder neckline\n" +
                    "- Regular fit\n" +
                    "- Slip on style\n" +
                    "- Self tie waist closure\n" +
                    "- Cotton", BigDecimal.valueOf(55.00), BigDecimal.valueOf(15.00));
            Category category4 = categoryService.retrieveCategoryByCategoryId(maxiDressCategoryId);
            product4.setCategory(category4);
            product4.getStyles().add(artsy);
            List<Long> product4Styles = new ArrayList<>();
            product4Styles.add(artsy.getStyleId());
            Product newProduct4 = productService.createNewProduct(product4, category4.getCategoryId(), null, product4Styles, sizes, colourToImageUrlsMaps4);

            Product product5 = new Product("001400", "High Waist Denim Jeans", "- Solid tone high waisted skinny jeans\n" +
                    "- Sizing runs one size larger\n" +
                    "- High waist\n" +
                    "- Skinny fit\n" +
                    "- Fly zipper fastening\n" +
                    "- Waist button fastening\n" +
                    "- 2 side pockets\n" +
                    "- 2 back patch pockets\n" +
                    "- Cotton blend", BigDecimal.valueOf(80.00), BigDecimal.valueOf(30.00));
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

            Product product6 = new Product("001500", "Mini Open High Slit Skirt", "- Monochrome A-line mini skirt\n" +
                    "- Lined\n" +
                    "- Regular fit\n" +
                    "- Side zip fastening\n" +
                    "- Polyblend", BigDecimal.valueOf(25.00), BigDecimal.valueOf(3.99));
            Category category6 = categoryService.retrieveCategoryByCategoryId(miniSkirtCategoryId);
            product6.setCategory(category6);
            product6.getStyles().add(artsy);
            List<Long> product6Styles = new ArrayList<>();
            product6Styles.add(artsy.getStyleId());
            Product newProduct6 = productService.createNewProduct(product6, category6.getCategoryId(), null, product6Styles, sizes, colourToImageUrlsMaps6);

            Product product7 = new Product("001600", "Double Slit Embroidered Maxi Dress", "- Embroidered maxi dress with tassels\n" +
                    "- V neckline\n" +
                    "- Relaxed fit\n" +
                    "- Snap button fastening\n" +
                    "- Stretchable elastic waist with self tie\n" +
                    "- Adjustable straps\n" +
                    "- Sleeveless\n" +
                    "- Unlined\n" +
                    "- Front slits \n" +
                    "- Rayon", BigDecimal.valueOf(59.90), BigDecimal.valueOf(11.90));
            product7.getStyles().add(bohemian);
            List<Long> product7Styles = new ArrayList<>();
            product7Styles.add(bohemian.getStyleId());
            Product newProduct7 = productService.createNewProduct(product7, category4.getCategoryId(), null, product7Styles, sizes, colourToImageUrlsMaps7);

            Product product8 = new Product("001700", "Hollister Tech Core Tee", "- Embroidered brand logo graphic tee\n" +
                    "- Sizing runs one size larger\n" +
                    "- Round neckline\n" +
                    "- Regular fit\n" +
                    "- Cotton blend", BigDecimal.valueOf(49.90), BigDecimal.valueOf(9.59));
            product8.getStyles().add(chic);
            List<Long> product8Styles = new ArrayList<>();
            product8Styles.add(chic.getStyleId());
            Category category8 = categoryService.retrieveCategoryByCategoryId(tShirtWCategoryId);
            product8.setCategory(category8);
            Product newProduct8 = productService.createNewProduct(product8, category8.getCategoryId(), null, product8Styles, sizes, colourToImageUrlsMaps8);

            Product product9 = new Product("001800", "Adidas Bos Tee", "- adidas performance\n" +
                    "- Best for training\n" +
                    "- Brand logo graphic tee\n" +
                    "- Round neckline\n" +
                    "- Slim fit\n" +
                    "- Polyblend", BigDecimal.valueOf(39.90), BigDecimal.valueOf(14.99));
            product9.getStyles().add(artsy);
            List<Long> product9Styles = new ArrayList<>();
            product9Styles.add(artsy.getStyleId());
            Product newProduct9 = productService.createNewProduct(product9, category8.getCategoryId(), null, product9Styles, sizes, colourToImageUrlsMaps9);

            Product product10 = new Product("001900", "Paperbag Belted Denim Shorts", "- Solid tone denim paperbag shorts\n" +
                    "- High rise\n" +
                    "- Regular fit\n" +
                    "- Zip-fly and hook fastening\n" +
                    "- Self tie waist closure\n" +
                    "- 4 pockets\n" +
                    "- Cotton blend", BigDecimal.valueOf(45.00), BigDecimal.valueOf(25.00));
            product10.getStyles().add(artsy);
            List<Long> product10Styles = new ArrayList<>();
            product10Styles.add(artsy.getStyleId());
            Category category10 = categoryService.retrieveCategoryByCategoryId(denimShortsWCategoryId);
            product10.setCategory(category10);
            Product newProduct10 = productService.createNewProduct(product10, category10.getCategoryId(), null, product10Styles, sizes, colourToImageUrlsMaps10);

            Product product11 = new Product("002000", "Adidas Performance M20 Shorts", "- adidas performance\n" +
                    "- Best for running\n" +
                    "- Striped brand logo running shorts\n" +
                    "- Climacool keeps you cool and dry in warm weather\n" +
                    "- 360 degrees of reflectivity\n" +
                    "- Mid rise\n" +
                    "- Regular fit\n" +
                    "- Drawstring and elasticated waistband fastening\n" +
                    "- Recycled polyblend\n", BigDecimal.valueOf(44.00), BigDecimal.valueOf(8.00));

            Category category11 = categoryService.retrieveCategoryByCategoryId(casualShortsWCategoryId);
            product11.setCategory(category11);
            product11.getStyles().add(artsy);
            List<Long> product11Styles = new ArrayList<>();
            product11Styles.add(artsy.getStyleId());
            Product newProduct11 = productService.createNewProduct(product11, category11.getCategoryId(), null, product11Styles, sizes, colourToImageUrlsMaps11);

            Product product12 = new Product("002100", "UA Tech Graphic Shorts", "- Best for training\n" +
                    "- Solid-colored training shorts with brand logo\n" +
                    "- Natural, ultra-soft UA Tech fabric\n" +
                    "- Material wicks sweat & dries really fast\n" +
                    "- Medium rise", BigDecimal.valueOf(28.90), BigDecimal.valueOf(5.80));
            product12.getStyles().add(chic);
            List<Long> product12Styles = new ArrayList<>();
            product12Styles.add(chic.getStyleId());
            Category category12 = categoryService.retrieveCategoryByCategoryId(casualShortsCategoryId);
            product12.setCategory(category12);
            Product newProduct12 = productService.createNewProduct(product12, category12.getCategoryId(), null, product12Styles, sizes, colourToImageUrlsMaps12);

            Product product13 = new Product("002200", "Blue Skinny Bermudas", "- Washed effect ripped bermuda denim shorts\n" +
                    "- Mid rise\n" +
                    "- Skinny fit\n" +
                    "- Front zip and button fastening\n" +
                    "- Five pocket style\n" +
                    "- Cotton blend", BigDecimal.valueOf(49.90), BigDecimal.valueOf(15.90));
            product13.getStyles().add(bohemian);
            List<Long> product13Styles = new ArrayList<>();
            product13Styles.add(bohemian.getStyleId());
            Category category13 = categoryService.retrieveCategoryByCategoryId(bermudasCategoryId);
            product13.setCategory(category13);
            Product newProduct13 = productService.createNewProduct(product13, category13.getCategoryId(), null, product13Styles, sizes, colourToImageUrlsMaps13);

            Product product14 = new Product("002300", "Champion Logo T-Shirt", "- Casual tee with logo print\n" +
                    "- Round neckline\n" +
                    "- Regular fit\n" +
                    "- Slip-on style\n" +
                    "- Short sleeves\n" +
                    "- Cotton", BigDecimal.valueOf(102.00), BigDecimal.valueOf(35.00));
            product14.setCategory(category14);
            product14.getStyles().add(chic);
            List<Long> product14Styles = new ArrayList<>();
            product14Styles.add(chic.getStyleId());
            Product newProduct14 = productService.createNewProduct(product14, category14.getCategoryId(), null, product14Styles, sizes, colourToImageUrlsMaps14);

            Product product15 = new Product("002400", "Tjm Tommy Flag Tee", "- Short sleeved tee with brand graphic print\n" +
                    "- Crew neckline\n" +
                    "- Unlined\n" +
                    "- Regular fit\n" +
                    "- Cotton", BigDecimal.valueOf(89.00), BigDecimal.valueOf(15.00));
            product15.getStyles().add(chic);
            List<Long> product15Styles = new ArrayList<>();
            product15Styles.add(chic.getStyleId());
            Product newProduct15 = productService.createNewProduct(product15, category14.getCategoryId(), null, product15Styles, sizes, colourToImageUrlsMaps15);

            Product product16 = new Product("002500", "Tulip Hem Midi Skirt", "- Solid tone wrap detail side tie midi skirt\n" +
                    "- High rise\n" +
                    "- Unlined\n" +
                    "- Regular fit\n" +
                    "- Zip and waist tie fastening\n" +
                    "- Polyester", BigDecimal.valueOf(39.90), BigDecimal.valueOf(18.30));
            product16.getStyles().add(artsy);
            List<Long> product16Styles = new ArrayList<>();
            product16Styles.add(artsy.getStyleId());
            Category category16 = categoryService.retrieveCategoryByCategoryId(midiSkirtCategoryId);
            product16.setCategory(category16);
            Product newProduct16 = productService.createNewProduct(product16, category16.getCategoryId(), null, product16Styles, sizes, colourToImageUrlsMaps16);

            Product product17 = new Product("002600", "Square Neck Fit And Flare Dress", "- Solid tone tie front strappy dress for work\n" +
                    "- Unlined\n" +
                    "- Square neckline\n" +
                    "- Regular fit\n" +
                    "- Side zip closure\n" +
                    "- Self tie fastening\n" +
                    "- Cotton", BigDecimal.valueOf(55.00), BigDecimal.valueOf(15.00));
            product17.getStyles().add(chic);
            List<Long> product17Styles = new ArrayList<>();
            product17Styles.add(vintage.getStyleId());
            Category category17 = categoryService.retrieveCategoryByCategoryId(workDressCategoryId);
            product17.setCategory(category17);
            Product newProduct17 = productService.createNewProduct(product17, category17.getCategoryId(), null, product17Styles, sizes, colourToImageUrlsMaps17);

          Product product18 = new Product("002700", "Distressed Frayed Denim Mini Skirt", "- Frayed hem distressed denim mini skirt\n" +
                  "- Unlined\n" +
                  "- Mid rise\n" +
                  "- Regular fit\n" +
                  "- Button and zip fastening\n" +
                  "- Five pocket style\n" +
                  "- Cotton blend", BigDecimal.valueOf(29.00), BigDecimal.valueOf(4.00));
            product18.getStyles().add(chic);
            List<Long> product18Styles = new ArrayList<>();
            product18Styles.add(chic.getStyleId());
            Product newProduct18 = productService.createNewProduct(product18, category6.getCategoryId(), null, product18Styles, sizes, colourToImageUrlsMaps18);

            Product product19 = new Product("002800", "Waist Tie Midi Skirt", "- Polyester\n" +
                    "- A-line silhouette\n" +
                    "- Breathable, flowy fabric\n" +
                    "- Ties with a feminine bow\n" +
                    "- Ties at the waist\n" +
                    "- Hits at mid-calf for a midi length", BigDecimal.valueOf(34), BigDecimal.valueOf(12.00));
            product19.getStyles().add(chic);
            List<Long> product19Styles = new ArrayList<>();
            product19Styles.add(chic.getStyleId());
            Product newProduct19 = productService.createNewProduct(product19, category16.getCategoryId(), null, product19Styles, sizes, colourToImageUrlsMaps19);

            Product product20 = new Product("002900", "Woven Light Midi Skirt", "- Floral print flowy midi skirt\n" +
                    "- Sizing runs one size larger\n" +
                    "- Lined\n" +
                    "- Mid rise\n" +
                    "- Regular fit\n" +
                    "- Front button fastening\n" +
                    "- Polyester", BigDecimal.valueOf(60.00), BigDecimal.valueOf(19.00));
            product20.getStyles().add(chic);
            List<Long> product20Styles = new ArrayList<>();
            product20Styles.add(chic.getStyleId());
            Product newProduct20 = productService.createNewProduct(product20, category16.getCategoryId(), null, product20Styles, sizes, colourToImageUrlsMaps20);

            Product product21 = new Product("003000", "Mini A-Line Skirt", "- Polyester\n" +
                    "- Spandex\n" +
                    "- Rayon\n" +
                    "- A-line silhouette\n" +
                    "- Features a detachable belt detail", BigDecimal.valueOf(29.00), BigDecimal.valueOf(7.90));
            product21.getStyles().add(chic);
            List<Long> product21Styles = new ArrayList<>();
            product21Styles.add(chic.getStyleId());
            Product newProduct21 = productService.createNewProduct(product21, category6.getCategoryId(), null, product21Styles, sizes, colourToImageUrlsMaps21);

            Product product22 = new Product("003100", "V Neck Fluted Sleeveless Dress", "- Paneled dress with frilled hem\n" +
                    "- Unlined\n" +
                    "- V-neckline\n" +
                    "- Regular fit\n" +
                    "- Back zip fastening\n" +
                    "- Sleeveless\n" +
                    "- Ruffled hem\n" +
                    "- Polyester", BigDecimal.valueOf(25.00), BigDecimal.valueOf(5.99));
            product22.getStyles().add(vintage);
            List<Long> product22Styles = new ArrayList<>();
            product22Styles.add(vintage.getStyleId());
            Product newProduct22 = productService.createNewProduct(product22, category17.getCategoryId(), null, product22Styles, sizes, colourToImageUrlsMaps22);

            Product product23 = new Product("003200", "Mom Slim Jeans", "- Faded casual denim slim mom jeans\n" +
                    "- Sizing runs one size larger\n" +
                    "- High rise\n" +
                    "- Unlined\n" +
                    "- Slim fit\n" +
                    "- Button and zip fastening", BigDecimal.valueOf(46.90), BigDecimal.valueOf(14.00));
            product23.getStyles().add(vintage);
            List<Long> product23Styles = new ArrayList<>();
            product23Styles.add(vintage.getStyleId());
            Product newProduct23 = productService.createNewProduct(product23, category5.getCategoryId(), null, product23Styles, sizes, colourToImageUrlsMaps23);

            Product product24 = new Product("003300", "Mom-Fit Jeans", "- Light wash mom jeans\n" +
                    "- Sizing runs one size larger\n" +
                    "- High rise\n" +
                    "- Regular fit\n" +
                    "- Button and zip fastening\n" +
                    "- 5 pockets\n" +
                    "- Cotton", BigDecimal.valueOf(46.90), BigDecimal.valueOf(14.00));
            product24.getStyles().add(vintage);
            List<Long> product24Styles = new ArrayList<>();
            product24Styles.add(vintage.getStyleId());
            Product newProduct24 = productService.createNewProduct(product24, category5.getCategoryId(), null, product24Styles, sizes, colourToImageUrlsMaps24);

            Product product25 = new Product("003400", "Tech Mesh Shorts 3 Inch\n", "- Best for training\n" +
                    "- Lightweight mesh\n" +
                    "- HeatGear tech\n" +
                    "- Solid-colour shorts with contrasting trim\n" +
                    "- Mid rise\n" +
                    "- Relaxed fit\n" +
                    "- Elastic waistband\n" +
                    "- Polyester", BigDecimal.valueOf(29.90), BigDecimal.valueOf(6.99));
            product25.getStyles().add(chic);
            List<Long> product25Styles = new ArrayList<>();
            product25Styles.add(chic.getStyleId());
            Product newProduct25 = productService.createNewProduct(product25, category11.getCategoryId(), null, product25Styles, sizes, colourToImageUrlsMaps25);

            Product product26 = new Product("003500", "Cozy Rib Henley Asia Top", "- Henley top with rib detail\n" +
                    "- Sizing runs one size larger\n" +
                    "- Scoop neckline\n" +
                    "- Slim fit\n" +
                    "- Front button fastening\n" +
                    "- Long sleeves\n" +
                    "- Viscose blend", BigDecimal.valueOf(38.90), BigDecimal.valueOf(12.90));
            product26.getStyles().add(bohemian);
            List<Long> product26Styles = new ArrayList<>();
            product26Styles.add(bohemian.getStyleId());
            Product newProduct26 = productService.createNewProduct(product26, category8.getCategoryId(), null, product26Styles, sizes, colourToImageUrlsMaps26);
            productVariantId26 = newProduct26.getProductVariants().get(0).getProductVariantId();

            Product product27 = new Product("003600", "SuperDry Glitter Emboss Entry Tee", "- Casual tee with embossed logo\n" +
                    "- Round neckline\n" +
                    "- Regular fit\n" +
                    "- Slip-on style\n" +
                    "- Short sleeves\n" +
                    "- Cotton", BigDecimal.valueOf(59.90), BigDecimal.valueOf(10.90));
            product27.getStyles().add(sophisticated);
            List<Long> product27Styles = new ArrayList<>();
            product27Styles.add(sophisticated.getStyleId());
            Product newProduct27 = productService.createNewProduct(product27, category8.getCategoryId(), null, product27Styles, sizes, colourToImageUrlsMaps27);
            productVariantId27 = newProduct27.getProductVariants().get(0).getProductVariantId();

            Product product28 = new Product("003700", "Tommy Hilfiger Slim Garment Dyed Dobby Shirt", "- Solid tone long sleeve shirt with mini logo embroidery\n" +
                    "- Unlined\n" +
                    "- Collar neckline\n" +
                    "- Slim fit\n" +
                    "- Front button closure\n" +
                    "- Cotton", BigDecimal.valueOf(150.90), BigDecimal.valueOf(50.00));
            product28.getStyles().add(sophisticated);
            List<Long> product28Styles = new ArrayList<>();
            product28Styles.add(sophisticated.getStyleId());
            Product newProduct28 = productService.createNewProduct(product28, category2.getCategoryId(), null, product28Styles, sizes, colourToImageUrlsMaps28);
            productVariantId28 = newProduct28.getProductVariants().get(0).getProductVariantId();

            Product product29 = new Product("003800", "Burton Short Sleeve Khaki Arrow Oxford Shirt", "- Printed button-down shirt\n" +
                    "- Collar neckline\n" +
                    "- Regular fit\n" +
                    "- Front button fastening\n" +
                    "- 1 chest pocket\n" +
                    "- Short sleeves\n" +
                    "- Cotton", BigDecimal.valueOf(49.90), BigDecimal.valueOf(12.00));
            product29.getStyles().add(sophisticated);
            List<Long> product29Styles = new ArrayList<>();
            product29Styles.add(sophisticated.getStyleId());
            Product newProduct29 = productService.createNewProduct(product29, category2.getCategoryId(), null, product29Styles, sizes, colourToImageUrlsMaps29);
            productVariantId29 = newProduct29.getProductVariants().get(0).getProductVariantId();

            Product product30 = new Product("003900", "Threads by the produce", "- Denim western style long sleeves shirt\n" +
                    "- Collar neckline\n" +
                    "- Regular fit\n" +
                    "- Button fastening\n" +
                    "- 2 pocket design\n" +
                    "- Cotton", BigDecimal.valueOf(24.90), BigDecimal.valueOf(5.00));
            product30.getStyles().add(sophisticated);
            List<Long> product30Styles = new ArrayList<>();
            product30Styles.add(sophisticated.getStyleId());
            Product newProduct30 = productService.createNewProduct(product30, category2.getCategoryId(), null, product30Styles, sizes, colourToImageUrlsMaps30);
            productVariantId30 = newProduct30.getProductVariants().get(0).getProductVariantId();

            Product product31 = new Product("004000", "Puma Sportstyle Core ESS Pique Polo", "- Best for lifestyle\n" +
                    "- Brand embroidered chest detail polo shirt\n" +
                    "- Collared neckline\n" +
                    "- Unlined\n" +
                    "- Regular fit\n" +
                    "- Button fastening\n" +
                    "- Cotton blend", BigDecimal.valueOf(24.90), BigDecimal.valueOf(5.00));
            product31.getStyles().add(chic);
            List<Long> product31Styles = new ArrayList<>();
            product31Styles.add(chic.getStyleId());
            Product newProduct31 = productService.createNewProduct(product31, category3.getCategoryId(), null, product31Styles, sizes, colourToImageUrlsMaps31);

            Product product32 = new Product("004100", "Ralph Polo Basic Mesh Polo Shirt", "- Brand logo oversized embroidery polo shirt\n" +
                    "- Collar neckline\n" +
                    "- Regular fit\n" +
                    "- Button fastening\n" +
                    "- Cotton", BigDecimal.valueOf(199.90), BigDecimal.valueOf(65.00));
            product32.getStyles().add(artsy);
            List<Long> product32Styles = new ArrayList<>();
            product32Styles.add(artsy.getStyleId());
            Product newProduct32 = productService.createNewProduct(product32, category3.getCategoryId(), null, product32Styles, sizes, colourToImageUrlsMaps32);

            Product product33 = new Product("004200", "Hollister Slim Pop Icon Polo Shirt", "- Polo shirt with logo embroidery\n" +
                    "- Sizing runs one size larger\n" +
                    "- Collar neckline\n" +
                    "- Slim fit\n" +
                    "- Front button fastening\n" +
                    "- Short cuffed sleeves\n" +
                    "- Side hem splits\n" +
                    "- Cotton blend", BigDecimal.valueOf(48.90), BigDecimal.valueOf(15.00));
            product33.getStyles().add(sophisticated);
            List<Long> product33Styles = new ArrayList<>();
            product33Styles.add(sophisticated.getStyleId());
            Product newProduct33 = productService.createNewProduct(product33, category3.getCategoryId(), null, product33Styles, sizes, colourToImageUrlsMaps33);

            Product product34 = new Product("004300", "Topman Stone Stretch Skinny Chino Shorts", "- Skinny fit chino shorts\n" +
                    "- Mid waist\n" +
                    "- Skinny fit\n" +
                    "- Waist button fastening\n" +
                    "- Fly zipper fastening\n" +
                    "- 2 side pockets\n" +
                    "- 2 back welt pockets\n" +
                    "- Cotton blend", BigDecimal.valueOf(50.90), BigDecimal.valueOf(18.00));
            product34.getStyles().add(artsy);
            List<Long> product34Styles = new ArrayList<>();
            product34Styles.add(artsy.getStyleId());
            Product newProduct34 = productService.createNewProduct(product34, category13.getCategoryId(), null, product34Styles, sizes, colourToImageUrlsMaps34);

            Product product35 = new Product("004400", "Ripped Hem Denim Shorts", "- Denim shorts with rip detail\n" +
                    "- Medium rise\n" +
                    "- Regular fit\n" +
                    "- Button & zip fastening\n" +
                    "- 5-pocket style\n" +
                    "- Frayed hem\n" +
                    "- Belt loops\n" +
                    "- Cotton", BigDecimal.valueOf(25.70), BigDecimal.valueOf(8.99));
            product35.getStyles().add(chic);
            List<Long> product35Styles = new ArrayList<>();
            product35Styles.add(chic.getStyleId());
            Product newProduct35 = productService.createNewProduct(product35, category13.getCategoryId(), null, product35Styles, sizes, colourToImageUrlsMaps35);




        }
    }

    private void createWarehouseAndStoreIfNotFound() throws InputDataValidationException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException, ProductVariantNotFoundException {
        if (warehouseService.retrieveAllWarehouses().size() == 0) {

            Warehouse w = warehouseService.createWarehouse(new Warehouse(),
                    new Address("Pasir Ris Drive 1", "#01-01", 510144, "Pasir Ris Building"));
            warehouseId = w.getWarehouseId();
            List<Warehouse> warehouses = warehouseService.retrieveAllWarehouses();

            Store s1 = storeService.createNewStore(new Store("Store 1", 8, 4,
                    Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 2, 6,
                    new Address("310 Orchard Rd", "", 238864, "Apricot N' Nut - Tang Plaza")));
            store1Id = s1.getStoreId();

            Store s2 = storeService.createNewStore(new Store("Store 2", 5, 2,
                    Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 1, 3,
                    new Address("270 Orchard Rd", "", 238857, "Apricot N' Nut - Orchard")));
            store2Id = s2.getStoreId();

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
//        List<Long>staffToConfigure =new ArrayList<>();


        Staff staff = new Staff("Ware", "house", 2, "116C", "geogrelee@gmail.com", BigDecimal.valueOf(10000));
        Address a1 = new Address("2E Hong San Walk", "#03-08", 612140, "Palm Garden");
        Staff newStaff = staffService.createNewStaff(staff, a1, role1.getRoleId(), departmentWarehouse.getDepartmentId(), null);

//        Staff staff2 = new Staff("IT", "STAFF", 13, "213C", "annabeltwe@gmail.com", BigDecimal.valueOf(10000));
//        Address a2 = new Address("Block 235 Chua Chu Kang Ave 2", "#15-234", 689051, "-");
//        Staff newStaff2 = staffService.createNewStaff(staff2, a2, role2.getRoleId(), departmentIT.getDepartmentId());


        Staff staff3 = new Staff("HR", "STAFF", 1, "131Z", "Caiyl@gmail.com", BigDecimal.valueOf(10000));
        Address a3 = new Address("Block 234 Bishan South", "#30-08", 321140, "Palm Garden");
        Staff newStaff3 = staffService.createNewStaff(staff3, a3, role1.getRoleId(), departmentHR.getDepartmentId(), null);


        Staff staff4 = new Staff("Sales", "Marketing", 20, "971C", "rayquaza@gmail.com", BigDecimal.valueOf(10000));
        Address a4 = new Address("Block 130 Taman Jurong", "#15-02", 231334, "-");
        Staff newStaff4 = staffService.createNewStaff(staff4, a4, role1.getRoleId(), departmentSalesMarketing.getDepartmentId(),null);


        Staff staff5 = new Staff("Store1", "Staff", 14, "187E", "tonychan@hotmail.com" ,BigDecimal.valueOf(10000));
        staff5.setAddress(new Address ("Block 2 Ang Mo Kio Avenue 5","#11-05",321140,"-"));
        Staff newStaff5 = staffService.createNewStaff(staff5, staff5.getAddress(), role3.getRoleId(), departmentStore.getDepartmentId(), store1Id);


        Staff staff6 = new Staff("Store2", "Staff", 2, "312Z", "SergioEs@gmail.com",BigDecimal.valueOf(10000) );
        staff6.setAddress(new Address ("Block 567 Bishan South","#20-08",321567,"-"));
        Staff newStaff6 = staffService.createNewStaff(staff6, staff6.getAddress(), role1.getRoleId(), departmentStore.getDepartmentId(), store2Id);

//        staffToConfigure.add(newStaff.getStaffId());
//        staffToConfigure.add(newStaff2.getStaffId());
//        staffToConfigure.add(newStaff3.getStaffId());
//        staffToConfigure.add(newStaff4.getStaffId());
//        staffToConfigure.add(newStaff5.getStaffId());
//        staffToConfigure.add(newStaff6.getStaffId());
//        staffService.createNewStaffAccount(staffToConfigure);

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
            customer.setVerified(true);
            customerId = customer.getCustomerId();
            customerService.retrieveCustomerByCustomerId(customerId);
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
