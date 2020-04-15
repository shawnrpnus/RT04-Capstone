package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Style;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.request.category.CategoryCreateRequest;
import capstone.rt04.retailbackend.request.category.CategoryUpdateRequest;
import capstone.rt04.retailbackend.response.AllCategoryTagStyleResponse;
import capstone.rt04.retailbackend.response.CategoryDetails;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.CategoryService;
import capstone.rt04.retailbackend.services.StyleService;
import capstone.rt04.retailbackend.services.TagService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.DeleteCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.UpdateCategoryException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.CategoryControllerRoutes.*;

@RestController
@RequestMapping(CATEGORY_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CategoryController {

    private final CategoryService categoryService;
    private final TagService tagService;
    private final StyleService styleService;

    public CategoryController(CategoryService categoryService, TagService tagService, StyleService styleService) {
        this.categoryService = categoryService;
        this.tagService = tagService;
        this.styleService = styleService;
    }

    @GetMapping(RETRIEVE_CATEGORY_BY_ID)
    public ResponseEntity<?> retrieveCategoryById(@PathVariable Long categoryId) {
        try {
            Category category = categoryService.retrieveCategoryByCategoryId(categoryId);
            clearCategoryRelationships(category);
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (CategoryNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_CATEGORY_TAG_STLYE)
    public ResponseEntity<?> retrieveAllCategoryTagStyle() {
        List<CategoryDetails> childCategories = categoryService.retrieveAllChildCategories();
        List<Tag> tags = tagService.retrieveAllTags();
        List<Style> styles = styleService.retrieveAllStyles();
        clearCategoryDetailsRelationships(childCategories);
        clearStyleRelationships(styles);
        clearTagRelationships(tags);
        return new ResponseEntity<>(new AllCategoryTagStyleResponse(childCategories, tags, styles), HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_ROOT_CATEGORIES)
    public ResponseEntity<?> retrieveAllRootCategories() {
        try {
            List<Category> categoryList = categoryService.retrieveAllRootCategories();
            for (Category c : categoryList) {
                clearCategoryRelationships(c);
            }
            return new ResponseEntity<>(categoryList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_CATEGORIES)
    public ResponseEntity<?> retrieveAllCategories() {
        List<Category> categories = categoryService.retrieveAllCategories();
        for (Category c : categories) {
            clearCategoryRelationships(c);
        }
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_CHILD_CATEGORY)
    public ResponseEntity<?> retrieveAllChildCategories() {
        try {
            List<CategoryDetails> childCategories = categoryService.retrieveAllChildCategories();
            return new ResponseEntity<>(childCategories, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(CREATE_NEW_CATEGORY)
    public ResponseEntity<?> createNewCategory(@RequestBody CategoryCreateRequest categoryCreateRequest) throws CategoryNotFoundException, CreateNewCategoryException, InputDataValidationException {
        Category newCategory = categoryService.createNewCategory(categoryCreateRequest.getCategory(),
                categoryCreateRequest.getParentCategoryId());
        clearCategoryRelationships(newCategory);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }


    @PostMapping(UPDATE_CATEGORY)
    public ResponseEntity<?> updateCategory(@RequestBody CategoryUpdateRequest categoryUpdateRequest) throws CategoryNotFoundException, UpdateCategoryException, InputDataValidationException {

        Category category = categoryService.updateCategory(categoryUpdateRequest.getCategory(), categoryUpdateRequest.getParentCategoryId());
        clearCategoryRelationships(category);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @DeleteMapping(DELETE_CATEGORY)
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId) throws CategoryNotFoundException, DeleteCategoryException {
        Category category = categoryService.deleteCategory(categoryId);
        clearCategoryRelationships(category);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    public void clearTagRelationships(List<Tag> tags) {
        tags.forEach(tag -> tag.setProducts(null));
    }

    public void clearStyleRelationships(List<Style> styles) {
        styles.forEach(style -> {
            style.setCustomers(null);
            style.setProducts(null);
        });
    }

    public void clearCategoryDetailsRelationships(List<CategoryDetails> categoryDetails) {
        categoryDetails.forEach(categoryDetail -> {
            categoryDetail.getCategory().setParentCategory(null);
            categoryDetail.getCategory().setChildCategories(null);
            categoryDetail.getCategory().setProducts(null);
        });
    }


    private void clearCategoryRelationships(Category category){
        Category root = category;
        while (root.getParentCategory() != null){
            root = root.getParentCategory();
        }
        clearChildCategoryRelationships(root);
    }

    private void clearChildCategoryRelationships(Category category) {
        for (Product product : category.getProducts()) {
            product.setTags(null);
            product.setProductVariants(null);
            product.setCategory(null);
        }
        if (category.getChildCategories() != null) {
            for (Category childCat : category.getChildCategories()) {
                for (Product p : childCat.getProducts()) {
                    p.setTags(null);
                    p.setProductVariants(null);
                    p.setCategory(null);
                    p.setStyles(null);
                    p.setDiscounts(null);
                    p.setReviews(null);
                }
                clearChildCategoryRelationships(childCat);
            }
        }
    }

}
