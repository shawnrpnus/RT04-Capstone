package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.request.product.ColourToImageUrlsMap;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.DeleteCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.UpdateCategoryException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CategoryServiceTest extends ServiceTestSetup {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ProductService productService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    protected static Long createdCategoryId;

    @Before
    public void beforeEachTest() throws Exception {
        Category expectedValidCategory = new Category("MEN");
        Category testValidCategory = categoryService.createNewCategory(expectedValidCategory, null);
        assertThat(testValidCategory.getCategoryId()).isNotNull();
        assertThat(testValidCategory).isEqualTo(expectedValidCategory);
        createdCategoryId = testValidCategory.getCategoryId();
    }

    @After
    public void afterEachTest() throws Exception {
        Category validCategory = categoryService.retrieveCategoryByCategoryId(createdCategoryId);
        Category removedCategory = categoryService.deleteCategory(validCategory.getCategoryId());
        assertThat(removedCategory.getCategoryId()).isEqualTo(validCategory.getCategoryId());
    }

    @Test(expected = CreateNewCategoryException.class)
    public void createDuplicateCategory() throws Exception {
        Category invalidCategory = new Category("MEN");
        categoryService.createNewCategory(invalidCategory, null);
    }

    @Test
    public void updateMostParentCategoryName() throws Exception {
        Category updateCategory = categoryService.retrieveCategoryByCategoryId(createdCategoryId);
        String change = "WOMEN";
        updateCategory.setCategoryName(change);
        categoryService.updateCategory(updateCategory, null);
        Category existingCategory = categoryService.retrieveCategoryByCategoryId(createdCategoryId);
        assertThat(existingCategory.getCategoryName().compareTo(change)).isEqualTo(0);

        existingCategory.setCategoryName("MEN");
        categoryService.updateCategory(existingCategory, null);
        Category finalCategory = categoryService.retrieveCategoryByCategoryId(createdCategoryId);
        assertThat(finalCategory.getCategoryName().compareTo("MEN")).isEqualTo(0);
    }

    @Test
    public void updateChildCategoryName() throws Exception {
        //Create
        Category category = new Category("CLOTHING");
        Category parentCategory = categoryService.retrieveCategoryByCategoryId(createdCategoryId);
        Category subCategory = categoryService.createNewCategory(category, parentCategory.getCategoryId());

        assertThat(subCategory.getParentCategory().getCategoryId().compareTo(parentCategory.getCategoryId())).isEqualTo(0);

        //Update
        Category categoryToUpdate = categoryService.retrieveCategoryByCategoryId(subCategory.getCategoryId());
        categoryToUpdate.setCategoryName("NOT_CLOTHING");
        categoryService.updateCategory(categoryToUpdate, parentCategory.getCategoryId());

        //Delete
        categoryService.deleteCategory(subCategory.getCategoryId());
    }

    @Test
    public void checkChildrenHaveProducts() throws Exception {
        Category subCategory = new Category("CLOTHING");
        Category parentCategory = categoryService.retrieveCategoryByCategoryId(createdCategoryId);
        parentCategory.getChildCategories().add(subCategory);

        boolean haveProducts = categoryService.checkChildrenHaveProducts(parentCategory.getChildCategories());
        assertThat(haveProducts).isFalse();

        subCategory.getProducts().add(new Product());
        haveProducts = categoryService.checkChildrenHaveProducts(parentCategory.getChildCategories());
        assertThat(haveProducts).isTrue();

        subCategory.getProducts().clear();
        Category subSubCategory = new Category("Jackets");
        subCategory.getChildCategories().add(subSubCategory);
        haveProducts = categoryService.checkChildrenHaveProducts(parentCategory.getChildCategories());
        assertThat(haveProducts).isFalse();

        subSubCategory.getProducts().add(new Product());
        haveProducts = categoryService.checkChildrenHaveProducts(parentCategory.getChildCategories());
        assertThat(haveProducts).isTrue();
    }

    @Test
    public void testRecursiveDeleteChildren() throws Exception {
        Category category = new Category("CLOTHING");
        Category parentCategory = categoryService.retrieveCategoryByCategoryId(createdCategoryId);
        Category subCategory = categoryService.createNewCategory(category, parentCategory.getCategoryId());
        Category subSubCategory = categoryService.createNewCategory(new Category("Jackets"), subCategory.getCategoryId());
    }

    @Test
    public void testUpdateCategory() throws CategoryNotFoundException, InputDataValidationException, CreateNewCategoryException, UpdateCategoryException, DeleteCategoryException {
        Category category = new Category("CLOTHING");
        Category menCategory = categoryService.retrieveCategoryByCategoryId(createdCategoryId);
        Category menClothingCategory = categoryService.createNewCategory(category, menCategory.getCategoryId());
        Category category1 = new Category("PANTS");
        Category menClothingPantsCategory = categoryService.createNewCategory(category1, menClothingCategory.getCategoryId());
        //MEN > CLOTHING > PANTS created

        Category category2 = new Category("WOMEN");
        Category womenCategory = categoryService.createNewCategory(category2, null);
        Category category3 = new Category("CLOTHING");
        Category womenClothingCategory = categoryService.createNewCategory(category3, womenCategory.getCategoryId());
        Category category4 = new Category("DRESS");
        Category womenClothingDressCategory = categoryService.createNewCategory(category4, womenClothingCategory.getCategoryId());
        //WOMEN > CLOTHING > DRESS created

        //start the update
        //original MEN > CLOTHING > PANTS
        //shift PANTS to WOMEN > CLOTHING
        //so become WOMEN > CLOTHING > PANTS & DRESS
        //           MEN > CLOTHING
        Category updatedCategory = categoryService.updateCategory(menClothingPantsCategory, womenClothingCategory.getCategoryId());

        //this should print
        Category c = categoryService.retrieveCategoryByCategoryId(updatedCategory.getCategoryId());
        String s = c.getCategoryName();
        while (c.getParentCategory() != null) {
            s = s.concat("<" + c.getParentCategory().getCategoryName());
            System.out.println(s);
            c = categoryService.retrieveCategoryByCategoryId(c.getParentCategory().getCategoryId());
        }

        categoryService.deleteCategory(womenClothingDressCategory.getCategoryId());
        categoryService.deleteCategory(updatedCategory.getCategoryId());
        categoryService.deleteCategory(womenClothingCategory.getCategoryId());
        categoryService.deleteCategory(womenCategory.getCategoryId());
        categoryService.deleteCategory(menClothingCategory.getCategoryId());
    }

    //Expect error because DRESS have 1 product, and we shifting PANTS to under DRESS
    @Test(expected = UpdateCategoryException.class)
    public void testUpdateParentCategoryWithProduct() throws CategoryNotFoundException, InputDataValidationException, CreateNewCategoryException, UpdateCategoryException, CreateNewProductException, DeleteCategoryException, ProductVariantNotFoundException, ProductStockNotFoundException, ProductNotFoundException {

        Category category = new Category("CLOTHING");
        Category menCategory = categoryService.retrieveCategoryByCategoryId(createdCategoryId);
        Category menClothingCategory = categoryService.createNewCategory(category, menCategory.getCategoryId());
        Category category1 = new Category("PANTS");
        Category menClothingPantsCategory = categoryService.createNewCategory(category1, menClothingCategory.getCategoryId());
        //MEN > CLOTHING > PANTS created

        Category category2 = new Category("WOMEN");
        Category womenCategory = categoryService.createNewCategory(category2, null);
        Category category3 = new Category("CLOTHING");
        Category womenClothingCategory = categoryService.createNewCategory(category3, womenCategory.getCategoryId());
        Category category4 = new Category("DRESS");
        Category womenClothingDressCategory = categoryService.createNewCategory(category4, womenClothingCategory.getCategoryId());
        //WOMEN > CLOTHING > DRESS created

        Product product = new Product("0010", "Stan Smith", "Adidas", BigDecimal.valueOf(109.90), BigDecimal.valueOf(49.90));
        product.setCategory(womenClothingDressCategory);

        List<SizeEnum> sizes = new ArrayList<>();
        sizes.add(SizeEnum.S);
        sizes.add(SizeEnum.M);
        sizes.add(SizeEnum.L);
        List<ColourToImageUrlsMap> colourToImageUrlsMaps = new ArrayList<>();
        colourToImageUrlsMaps.add(new ColourToImageUrlsMap("Ember", new ArrayList<>()));
        colourToImageUrlsMaps.add(new ColourToImageUrlsMap("Snow", new ArrayList<>()));

        Product newProduct = productService.createNewProduct(product, womenClothingDressCategory.getCategoryId(), null, null, sizes, colourToImageUrlsMaps);

        try {
            Category updatedCategory = categoryService.updateCategory(menClothingPantsCategory, womenClothingDressCategory.getCategoryId());
        } catch (UpdateCategoryException ex) {
            productService.deleteProduct(newProduct.getProductId());
            categoryService.deleteCategory(womenClothingDressCategory.getCategoryId());
            categoryService.deleteCategory(womenClothingCategory.getCategoryId());
            categoryService.deleteCategory(womenCategory.getCategoryId());

            categoryService.deleteCategory(menClothingPantsCategory.getCategoryId());
            categoryService.deleteCategory(menClothingCategory.getCategoryId());

            throw new UpdateCategoryException(ex.getMessage());
        }
    }
}
