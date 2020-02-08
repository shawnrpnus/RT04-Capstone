package capstone.rt04.retailbackend.services;

import static org.assertj.core.api.Assertions.assertThat;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
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
import java.util.HashMap;
import java.util.Map;


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

    @Test(expected = CreateNewCategoryException.class)
    public void createDuplicateCategory() throws Exception {
        Category invalidCategory = new Category("MEN");
        categoryService.createNewCategory(invalidCategory, null);
    }

    @Test
    public void updateMostParentCategoryName() throws Exception {
        Category updateCategory = categoryService.retrieveCategoryByName("MEN");
        String change = "WOMEN";
        updateCategory.setName(change);
        categoryService.updateCategory(updateCategory, null);
        Category existingCategory = categoryService.retrieveCategoryByName("WOMEN");
        assertThat(existingCategory.getName().compareTo(change)).isEqualTo(0);

        existingCategory.setName("MEN");
        categoryService.updateCategory(existingCategory, null);
        Category finalCategory = categoryService.retrieveCategoryByName("MEN");
        assertThat(finalCategory.getName().compareTo("MEN")).isEqualTo(0);
    }

    @Test
    public void updateChildCategoryName() throws Exception {
        Category category = new Category("CLOTHING");
        Category parentCategory = categoryService.retrieveCategoryByName("MEN");
        Category subCategory = categoryService.createNewCategory(category, parentCategory.getCategoryId());

        assertThat(subCategory.getParentCategory().getCategoryId().compareTo(parentCategory.getCategoryId())).isEqualTo(0);

        categoryService.deleteCategory(subCategory.getCategoryId());
    }
}
