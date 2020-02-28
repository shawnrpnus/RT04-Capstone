package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.AddressRepository;
import capstone.rt04.retailbackend.request.product.ColourToImageUrlsMap;
import capstone.rt04.retailbackend.util.enums.RoleNameEnum;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductStockException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateDepartmentException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateRoleException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.tag.CreateNewTagException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

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

    private final AddressRepository addressRepository;

    private static Long sneakerCategoryId;
    private static Long shirtCategoryId;
    private static Long socksCategoryId;
    private static Long skirtsCategoryId;
    private static Long dressesCategoryId;
    private static Long tShirtCategoryId;
    private static Long jeansCategoryId;
    private static Long bermudasCategoryId;


    public StartUpService(ProductService productService, CategoryService categoryService, WarehouseService warehouseService, TagService tagService, StyleService styleService, StoreService storeService, StaffService staffService, AddressRepository addressRepository) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.warehouseService = warehouseService;
        this.tagService = tagService;
        this.styleService = styleService;
        this.storeService = storeService;
        this.staffService = staffService;
        this.addressRepository = addressRepository;
    }

    @PostConstruct
    public void init() throws InputDataValidationException, CreateNewCategoryException, CategoryNotFoundException, CreateNewProductException, ProductVariantNotFoundException, CreateNewProductStockException, WarehouseNotFoundException, StoreNotFoundException, CreateNewTagException, CreateNewStyleException, CreateNewStaffException, CreateRoleException, CreateDepartmentException {
        createCategoryIfNotFound();
        createProductIfNotFound();
        createWarehouseAndStoreIfNotFound();
        createTagIfNotFound();
        createStyleIfNotFound();
        createStaffIfNotFound();
    }

    private void createCategoryIfNotFound() throws CategoryNotFoundException, CreateNewCategoryException, InputDataValidationException {
        List<Category> categories = categoryService.retrieveAllRootCategories();
        if (categories.size() == 0) {
            Category category = categoryService.createNewCategory(new Category("Shoes"), null);
            Category leafCategory = categoryService.createNewCategory(new Category("Sneakers"), category.getCategoryId());
            sneakerCategoryId = leafCategory.getCategoryId();
            Category men = categoryService.createNewCategory(new Category("Men"), null);
            Category clothingmen = categoryService.createNewCategory(new Category("Clothing"), men.getCategoryId());
            Category shirts = categoryService.createNewCategory(new Category("Shirts"), clothingmen.getCategoryId());
            shirtCategoryId = shirts.getCategoryId();
            Category shorts = categoryService.createNewCategory(new Category("Shorts"), clothingmen.getCategoryId());
            Category socks = categoryService.createNewCategory(new Category("Socks"), clothingmen.getCategoryId());
            socksCategoryId = socks.getCategoryId();


            Category women = categoryService.createNewCategory(new Category("Women"), null);
            Category clothingwomen = categoryService.createNewCategory(new Category("Clothing"), women.getCategoryId());
            Category shorts2 = categoryService.createNewCategory(new Category("Shorts"), clothingwomen.getCategoryId());
            Category dresses = categoryService.createNewCategory(new Category("Dresses"), clothingwomen.getCategoryId());
            dressesCategoryId = dresses.getCategoryId();
            Category skirts = categoryService.createNewCategory(new Category("Skirts"), clothingwomen.getCategoryId());
            skirtsCategoryId = skirts.getCategoryId();
            Category tShirt = categoryService.createNewCategory(new Category("T-Shirt"), clothingwomen.getCategoryId());
            tShirtCategoryId = tShirt.getCategoryId();
            Category jeans = categoryService.createNewCategory(new Category("Jeans"), clothingwomen.getCategoryId());
            jeansCategoryId = jeans.getCategoryId();
            Category bermudas = categoryService.createNewCategory(new Category("Bermudas"), clothingmen.getCategoryId());
            bermudasCategoryId = bermudas.getCategoryId();


        }
    }

    private void createProductIfNotFound() throws CategoryNotFoundException, InputDataValidationException, CreateNewProductException, ProductVariantNotFoundException {
        List<Product> products = productService.retrieveAllProducts();
        if (products.size() == 0) {

            // Product images
            List<String> blackProductImageUrls = new ArrayList<>();
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_a?qlt=92&w=750&h=531&v=1&fmt=webp");
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_b?qlt=92&w=750&h=531&v=1&fmt=webp");
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_c?qlt=92&w=750&h=531&v=1&fmt=webp");
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_d?qlt=92&w=750&h=531&v=1&fmt=webp");
            blackProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_347293_e?qlt=92&w=750&h=531&v=1&fmt=webp");
            List<String> greenProductImageUrls = new ArrayList<>();
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_a?qlt=92&w=750&h=531&v=1&fmt=webp");
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_b?qlt=92&w=750&h=531&v=1&fmt=webp");
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_c?qlt=92&w=750&h=531&v=1&fmt=webp");
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_d?qlt=92&w=750&h=531&v=1&fmt=webp");
            greenProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_M20324_e?qlt=92&w=750&h=531&v=1&fmt=webp");
            List<String> redProductImageUrls = new ArrayList<>();
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_a?qlt=92&w=750&h=531&v=1&fmt=webp");
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_b?qlt=92&w=750&h=531&v=1&fmt=webp");
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_c?qlt=92&w=750&h=531&v=1&fmt=webp");
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_d?qlt=92&w=750&h=531&v=1&fmt=webp");
            redProductImageUrls.add("https://i8.amplience.net/i/jpl/jd_EE5801_e?qlt=92&w=750&h=531&v=1&fmt=webp");

            List<SizeEnum> sizes = new ArrayList<>();
            sizes.add(SizeEnum.S);
            sizes.add(SizeEnum.M);
            sizes.add(SizeEnum.L);
            List<ColourToImageUrlsMap> colourToImageUrlsMaps = new ArrayList<>();
            colourToImageUrlsMaps.add(new ColourToImageUrlsMap("#000000", blackProductImageUrls));
            colourToImageUrlsMaps.add(new ColourToImageUrlsMap("#1CD3A2", greenProductImageUrls));
            colourToImageUrlsMaps.add(new ColourToImageUrlsMap("#CB4154", redProductImageUrls));

            Category category = categoryService.retrieveCategoryByCategoryId(sneakerCategoryId); //sneakers

            Product product = new Product("0010", "Stan Smith", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            product.setCategory(category);
            Product newProduct = productService.createNewProduct(product, category.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product2 = new Product("0011", "Fila Disruptor II", "Fila", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category2 = categoryService.retrieveCategoryByCategoryId(shirtCategoryId); //shirt
            product2.setCategory(category2);
            Product newProduct2 = productService.createNewProduct(product2, category2.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product3 = new Product("0012", "Nike Air Max", "Nike", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category3 = categoryService.retrieveCategoryByCategoryId(socksCategoryId); // socks
            product3.setCategory(category);
            Product newProduct3 = productService.createNewProduct(product3, category3.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product4 = new Product("0013", "Polo Tee", "Official Fred Perry Merchandise", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
            Category category4 = categoryService.retrieveCategoryByCategoryId(shirtCategoryId); //shirt
            product4.setCategory(category4);
            Product newProduct4 = productService.createNewProduct(product4, category4.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product5 = new Product("0014", "Burberry Skirt", "Burberry Skirt", BigDecimal.valueOf(60.00), BigDecimal.valueOf(10.00));
            Category category5 = categoryService.retrieveCategoryByCategoryId(skirtsCategoryId);
            product5.setCategory(category5);
            Product newProduct5 = productService.createNewProduct(product5, category5.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product6 = new Product("0015", "Mickey Mouse T-Shirt", "Official Disneyland Merchandise", BigDecimal.valueOf(25.00), BigDecimal.valueOf(3.99));
            Category category6 = categoryService.retrieveCategoryByCategoryId(tShirtCategoryId);
            product6.setCategory(category6);
            Product newProduct6 = productService.createNewProduct(product6, category6.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product7 = new Product("0016", "Maxi Skirt", "Beautiful Skirt 100% Cotton ", BigDecimal.valueOf(59.90), BigDecimal.valueOf(8.90));
            Product newProduct7 = productService.createNewProduct(product7, category5.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product8 = new Product("0017", "Mini Skirt", "Mini Skirt", BigDecimal.valueOf(29.90), BigDecimal.valueOf(4.59));
            Product newProduct8 = productService.createNewProduct(product8, category5.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product9 = new Product("0018", "Fila T-Shirt", "Fila", BigDecimal.valueOf(60.00), BigDecimal.valueOf(14.99));
            Product newProduct9 = productService.createNewProduct(product9, category6.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product10 = new Product("0019", "Liverpool T-Shirt", "Liverpool FC", BigDecimal.valueOf(99.00), BigDecimal.valueOf(25.00));
            Product newProduct10 = productService.createNewProduct(product10, category6.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product11 = new Product("0020", "Manchester United T-Shirt", "Manchester United", BigDecimal.valueOf(99.00), BigDecimal.valueOf(25.00));
            Product newProduct11 = productService.createNewProduct(product11, category6.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product12 = new Product("0021", "Plain Crew T-shirt", "100% Cotton", BigDecimal.valueOf(9.99), BigDecimal.valueOf(1.50));
            Product newProduct12 = productService.createNewProduct(product12, category6.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product13 = new Product("0022", "Long Skirt", "Long Skirt", BigDecimal.valueOf(65.90), BigDecimal.valueOf(19.90));
            Product newProduct13 = productService.createNewProduct(product13, category5.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product14 = new Product("0023", "Nudie Jeans", "Nudie", BigDecimal.valueOf(259.00), BigDecimal.valueOf(56.00));
            Category category7 = categoryService.retrieveCategoryByCategoryId(jeansCategoryId); //jeans
            product4.setCategory(category7);
            Product newProduct14 = productService.createNewProduct(product14, category7.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product15 = new Product("0024", "Cheap Monday Jeans", "Beautiful Skirt", BigDecimal.valueOf(89.00), BigDecimal.valueOf(15.00));
            Product newProduct15 = productService.createNewProduct(product15, category7.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product16 = new Product("0025", "Avengers Socks", "Avengers", BigDecimal.valueOf(2.50), BigDecimal.valueOf(0.30));
            Product newProduct16 = productService.createNewProduct(product16, category3.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product17 = new Product("0026", "Striped Shirt", "Blue Stripes Shirt ", BigDecimal.valueOf(50.00), BigDecimal.valueOf(15.00));
            Product newProduct17 = productService.createNewProduct(product17, category2.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product18 = new Product("0027", "Abercrombie & Fitch Shirt", "A&F", BigDecimal.valueOf(99.00), BigDecimal.valueOf(12.00));
            Product newProduct18 = productService.createNewProduct(product18, category2.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product19 = new Product("0028", "Abercrombie & Fitch T Shirt", "A&F", BigDecimal.valueOf(45), BigDecimal.valueOf(5.00));
            Product newProduct19 = productService.createNewProduct(product19, category6.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product20 = new Product("0029", "Abercrombie & Fitch Jeans", "Beautiful Skirt", BigDecimal.valueOf(120.00), BigDecimal.valueOf(29.00));
            Product newProduct20 = productService.createNewProduct(product20, category7.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product21 = new Product("0030", "Ankle Socks", "Ankle Socks", BigDecimal.valueOf(5.00), BigDecimal.valueOf(0.50));
            Product newProduct21 = productService.createNewProduct(product21, category3.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product22 = new Product("0031", "Docker Bermudas", "Bermudas", BigDecimal.valueOf(45.00), BigDecimal.valueOf(8.99));
            Category category8 = categoryService.retrieveCategoryByCategoryId(bermudasCategoryId);
            product22.setCategory(category8);
            Product newProduct22 = productService.createNewProduct(product22, category8.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product23 = new Product("0032", "Slim Fit Bermudas", "Slim Fit Skirt", BigDecimal.valueOf(29.90), BigDecimal.valueOf(10.00));
            Product newProduct23 = productService.createNewProduct(product23, category8.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product24 = new Product("0033", "Regular Cut Bermudas", "Regular Cut", BigDecimal.valueOf(29.90), BigDecimal.valueOf(10.00));
            Product newProduct24 = productService.createNewProduct(product24, category8.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product25 = new Product("0034", "Skinny Jeans", "Tight Fit", BigDecimal.valueOf(79.90), BigDecimal.valueOf(14.99));
            Product newProduct25 = productService.createNewProduct(product25, category7.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product26 = new Product("0035", "Parachute Dress", "Weew", BigDecimal.valueOf(59.90), BigDecimal.valueOf(14.90));
            Category category9 = categoryService.retrieveCategoryByCategoryId(dressesCategoryId);
            product22.setCategory(category9);
            Product newProduct26 = productService.createNewProduct(product26, category9.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product27 = new Product("0036", "Long Sleeve Dress", "Long Sleeve Dress", BigDecimal.valueOf(49.90), BigDecimal.valueOf(10.90));
            Product newProduct27 = productService.createNewProduct(product27, category9.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product28 = new Product("0037", "Short Sleeve Dress", "Short Sleeve Skirt", BigDecimal.valueOf(35.90), BigDecimal.valueOf(8.00));
            Product newProduct28 = productService.createNewProduct(product28, category9.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product29 = new Product("0038", "Sleeveless Dress", "Sleeveless Dress", BigDecimal.valueOf(49.90), BigDecimal.valueOf(12.00));
            Product newProduct29 = productService.createNewProduct(product29, category9.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

            Product product30 = new Product("0039", "Long Sleeve Shirt", "Long sleeve ", BigDecimal.valueOf(89.90), BigDecimal.valueOf(23.00));
            Product newProduct30 = productService.createNewProduct(product30, category2.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);
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

    private void createStyleIfNotFound() throws CreateNewStyleException, InputDataValidationException {
        if (styleService.retrieveAllStyles().size() != 0) return;
        styleService.createNewStyle(new Style("Vintage"));
        styleService.createNewStyle(new Style("Bohemian"));
        styleService.createNewStyle(new Style("Chic"));
        styleService.createNewStyle(new Style("Artsy"));
        styleService.createNewStyle(new Style("Sophisticated"));
    }

    private void createStaffIfNotFound() throws CreateNewStaffException, InputDataValidationException, CreateRoleException, CreateDepartmentException {
        if (staffService.retrieveAllStaff().size() != 0) return;
        Product product = new Product("0010", "Stan Smith", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
        Department departmentHR = staffService.createNewDepartment("HR");
        Department departmentIT = staffService.createNewDepartment("IT");
        Department departmentFinance = staffService.createNewDepartment("Finance");
        Department departmentRetail = staffService.createNewDepartment("Retail");
        Department departmentCustomerService = staffService.createNewDepartment("Customer Service");

        Role role1 = staffService.createNewRole(RoleNameEnum.ASSISTANT);
        Role role2 = staffService.createNewRole(RoleNameEnum.ASSISTANT_MANAGER);
        Role role3 = staffService.createNewRole(RoleNameEnum.MANAGER);
        Role role4 = staffService.createNewRole(RoleNameEnum.DIRECTOR);


        Staff staff = new Staff("Geogre", "Lee", 2, "116c", "geogrelee@gmail.com", BigDecimal.valueOf(10000));
        Address a1 = new Address("2E Hong San Walk", "#03-08", 612140, "Palm Garden");
        Staff newStaff = staffService.createNewStaff(staff, a1, role1.getRoleId(), departmentHR.getDepartmentId());

        Staff staff2 = new Staff("Annabel", "Tan", 13, "213C", "annabeltwe@gmail.com", BigDecimal.valueOf(10000));
        Address a2 = new Address("Block 235 Chua Chu Kang Ave 2", "#15-234", 689051, "-");
        Staff newStaff2 = staffService.createNewStaff(staff2, a2, role2.getRoleId(), departmentIT.getDepartmentId());

        Staff staff3 = new Staff("Yi Lin", "Cai", 1, "131Z", "Caiyl@gmail.com", BigDecimal.valueOf(10000));
        Address a3 = new Address("Block 234 Bishan South", "#30-08", 321140, "Palm Garden");
        Staff newStaff3 = staffService.createNewStaff(staff3, a3, role1.getRoleId(), departmentHR.getDepartmentId());


        Staff staff4 = new Staff("Gerard", "Ng", 20, "971C", "rayquaza@gmail.com", BigDecimal.valueOf(10000));
        Address a4 = new Address("Block 130 Taman Jurong", "#15-02", 231334, "-");
        Staff newStaff4 = staffService.createNewStaff(staff4, a4, role1.getRoleId(), departmentIT.getDepartmentId());


//        Staff staff5 = new Staff("Tony", "Chan", 14, "187E", "tonychan@hotmail.com" ,BigDecimal.valueOf(10000));
//        staff5.setAddress(new Address ("Block 2 Ang Mo Kio Avenue 5","#11-05",321140,"-"));
//        Staff newStaff5 = staffService.createNewStaff(staff5, staff5.getAddress(), role4, departmentFinance);
//
//
//        Staff staff6 = new Staff("Sergio", "Tan", 2, "312Z", "SergioEs@gmail.com",BigDecimal.valueOf(10000) );
//        staff6.setAddress(new Address ("Block 567 Bishan South","#20-08",321567,"-"));
//        Staff newStaff6 = staffService.createNewStaff(staff6, staff6.getAddress(), role1, departmentRetail);
//
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
}
