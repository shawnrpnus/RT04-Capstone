package capstone.rt04.retailbackend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.InstanceOfAssertFactories.stream;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.UpdateCategoryException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductException;
import org.hibernate.sql.Update;
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


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CategoryServiceTest {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ProductService productService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Before
    public void beforeEachTest() throws Exception{
        Category expectedValidCategory = new Category("MEN");
        Category testValidCategory = categoryService.createNewCategory(expectedValidCategory, null);
        assertThat(testValidCategory.getCategoryId()).isNotNull();
        assertThat(testValidCategory).isEqualTo(expectedValidCategory);
    }

    @After
    public void afterEachTest() throws Exception{
        Category validCategory = categoryService.retrieveCategoryByName("MEN");
        Category removedCategory = categoryService.deleteCategory(validCategory.getCategoryId());
        assertThat(removedCategory.getCategoryId()).isEqualTo(validCategory.getCategoryId());
    }

//    @Test(expected = CreateNewCategoryException.class)
//    public void createDuplicateCategory() throws Exception {
//        Category invalidCategory = new Category("MEN");
//        categoryService.createNewCategory(invalidCategory, null);
//    }

    @Test
    public void updateMostParentCategoryName() throws Exception {
        Category updateCategory = categoryService.retrieveCategoryByName("MEN");
        String change = "WOMEN";
        updateCategory.setCategoryName(change);
        categoryService.updateCategory(updateCategory, null);
        Category existingCategory = categoryService.retrieveCategoryByName("WOMEN");
        assertThat(existingCategory.getCategoryName().compareTo(change)).isEqualTo(0);

        existingCategory.setCategoryName("MEN");
        categoryService.updateCategory(existingCategory, null);
        Category finalCategory = categoryService.retrieveCategoryByName("MEN");
        assertThat(finalCategory.getCategoryName().compareTo("MEN")).isEqualTo(0);
    }

    @Test
    public void updateChildCategoryName() throws Exception {
        //Create
        Category category = new Category("CLOTHING");
        Category parentCategory = categoryService.retrieveCategoryByName("MEN");
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
    public void checkChildrenHaveProducts() throws Exception{
        Category subCategory = new Category("CLOTHING");
        Category parentCategory = categoryService.retrieveCategoryByName("MEN");
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
    public void testRecursiveDeleteChildren() throws Exception{
        Category category = new Category("CLOTHING");
        Category parentCategory = categoryService.retrieveCategoryByName("MEN");
        Category subCategory = categoryService.createNewCategory(category, parentCategory.getCategoryId());
        Category subSubCategory = categoryService.createNewCategory(new Category("Jackets"), subCategory.getCategoryId());
    }

    @Test
    public void testUpdateCategory() throws CategoryNotFoundException, InputDataValidationException, CreateNewCategoryException, UpdateCategoryException {
        Category category = new Category("CLOTHING");
        Category menCategory = categoryService.retrieveCategoryByName("MEN");
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
        while(c.getParentCategory()!= null) {
            s = s.concat("<" + c.getParentCategory().getCategoryName());
            System.out.println(s);
            c = categoryService.retrieveCategoryByCategoryId(c.getParentCategory().getCategoryId());
        }
    }

    //Expect error because DRESS have 1 product, and we shifting PANTS to under DRESS
    @Test(expected = UpdateCategoryException.class)
    public void testUpdateParentCategoryWithProduct() throws CategoryNotFoundException, InputDataValidationException, CreateNewCategoryException, UpdateCategoryException, CreateNewProductException {
        Category category = new Category("CLOTHING");
        Category menCategory = categoryService.retrieveCategoryByName("MEN");
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
        List<String> colors = new ArrayList<>();
        colors.add("Black");
        colors.add("Green");
        colors.add("Red");
        Product newProduct = productService.createNewProduct(product, womenClothingDressCategory.getCategoryId(), null, sizes, colors);

        Category updatedCategory = categoryService.updateCategory(menClothingPantsCategory, womenClothingDressCategory.getCategoryId());

    }
}
