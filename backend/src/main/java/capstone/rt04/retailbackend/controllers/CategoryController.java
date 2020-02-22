package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.request.category.CategoryCreateRequest;
import capstone.rt04.retailbackend.request.category.CategoryUpdateRequest;
import capstone.rt04.retailbackend.response.AllCategoryTagResponse;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.CategoryService;
import capstone.rt04.retailbackend.services.TagService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.CategoryControllerRoutes.*;

@RestController
@RequestMapping(CATEGORY_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class CategoryController {

    private final CategoryService categoryService;
    private final TagService tagService;

    public CategoryController(CategoryService categoryService, TagService tagService) {
        this.categoryService = categoryService;
        this.tagService = tagService;
    }

    @GetMapping(RETRIEVE_CATEGORY_BY_ID)
    public ResponseEntity<?> retrieveCategoryById(@PathVariable Long categoryId) {
        try {
            Category category = categoryService.retrieveCategoryByCategoryId(categoryId);
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (CategoryNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_CATEGORY_AND_TAG)
    public ResponseEntity<?> retrieveAllCategoryAndTag() {
        try {
            List<Category> categories = categoryService.retrieveAllCategories();
            List<Tag> tags = tagService.retrieveAllTags();
            return new ResponseEntity<>(new AllCategoryTagResponse(categories, tags), HttpStatus.OK);
        }  catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(RETRIEVE_ALL_CATEGORY)
    public ResponseEntity<?> retrieveAllCategories() {
        try {
            List<Category> categoryList = categoryService.retrieveAllCategories();
            return new ResponseEntity<>(categoryList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(CREATE_NEW_CATEGORY)
    public ResponseEntity<?> createNewCategory(@RequestBody CategoryCreateRequest categoryCreateRequest) {
        try {
            Category newCategory = categoryService.createNewCategory(categoryCreateRequest.getCategory(),
                    categoryCreateRequest.getParentCategoryId());
            return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (CreateNewCategoryException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(UPDATE_CATEGORY)
    public ResponseEntity<?> updateCategory(@RequestBody CategoryUpdateRequest categoryUpdateRequest) {
        try {
            Category category = categoryService.updateCategory(categoryUpdateRequest.getCategory(), categoryUpdateRequest.getParentCategoryId());
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (CategoryNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(DELETE_CATEGORY)
    public ResponseEntity<?> deleteProduct(@PathVariable Long categoryId) {
        try {
            Category category = categoryService.deleteCategory(categoryId);
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (CategoryNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
