package capstone.rt04.retailbackend.services;

import static org.assertj.core.api.Assertions.assertThat;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.entities.Category;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CategoryServiceTest {
    @Autowired
    private CategoryService categoryService;

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
}
