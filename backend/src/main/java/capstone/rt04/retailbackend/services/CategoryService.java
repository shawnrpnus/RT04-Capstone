package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.repositories.CategoryRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.DeleteCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.UpdateCategoryException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CategoryService {

    private final ValidationService validationService;

    private final CategoryRepository categoryRepository;

    public CategoryService(ValidationService validationService, CategoryRepository categoryRepository) {
        this.validationService = validationService;
        this.categoryRepository = categoryRepository;
    }

    public Category createNewCategory(Category newCategory, Long parentCategoryId) throws InputDataValidationException, CreateNewCategoryException, CategoryNotFoundException {
        Map<String, String> errorMap = validationService.generateErrorMap(newCategory);

        if (errorMap == null) {
            try {
//                Category existingCategory = null;
//                try {
//                    existingCategory = retrieveCategoryByName(newCategory.getName());
//                } catch (CategoryNotFoundException ex) {
//                }
//                if (existingCategory != null) {
//                    errorMap = new HashMap<>();
//                    errorMap.put("category", "This category is already created!");
//                    throw new InputDataValidationException(errorMap, "Category already created");
//                }
                if (parentCategoryId != null) {


                    Category parentCategoryEntity = retrieveCategoryByCategoryId(parentCategoryId);

                    if (!parentCategoryEntity.getProducts().isEmpty()) {
                        throw new CreateNewCategoryException("Parent category cannot be associated with any product");
                    }

                    newCategory.setParentCategory(parentCategoryEntity);
                    parentCategoryEntity.getChildCategories().add(newCategory);
                }

                categoryRepository.save(newCategory);
                return newCategory;
            } catch (Exception ex) {
                throw new CreateNewCategoryException("Error creating new category");
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Category");
        }
    }

    public Category retrieveCategoryByName(String name) throws CategoryNotFoundException {
        Category category = categoryRepository.findByName(name).orElseThrow(
                () -> new CategoryNotFoundException(("Category with name " + name + " does not exist!")));

        lazilyLoadSubCategories(category);
        return category;
    }

    public Category retrieveCategoryByCategoryId(Long categoryId) throws CategoryNotFoundException {
        if (categoryId == null) {
            throw new CategoryNotFoundException("Category ID not provided");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category ID " + categoryId + " does not exist!"));

        lazilyLoadSubCategories(category);
        return category;
    }

    public List<Category> retrieveAllCategories() {
        return (List<Category>) categoryRepository.findAll();
    }

    public Category updateCategory(Category category) throws InputDataValidationException, CategoryNotFoundException, UpdateCategoryException {
        Map<String, String> errorMap = validationService.generateErrorMap(category);

        if (errorMap == null) {
            try {
                Category categoryToUpdate = retrieveCategoryByCategoryId(category.getCategoryId());
                Category existingCategory = categoryRepository.findByNameAndCategoryId(category.getName(), category.getCategoryId()).orElse(null);

                Long parentCategoryId = null;
                if(categoryToUpdate.getParentCategory() != null) {
                    parentCategoryId = categoryToUpdate.getParentCategory().getCategoryId();
                }
                if (existingCategory != null) {
                    throw new UpdateCategoryException("Name of category to be updated is duplicated!");
                }

                categoryToUpdate.setName(category.getName());

                if (parentCategoryId != null) {
                    if (categoryToUpdate.getCategoryId().equals(parentCategoryId)) {
                        throw new UpdateCategoryException("Category cannot be its own parent");
                    } else if (categoryToUpdate.getParentCategory() == null || (!categoryToUpdate.getParentCategory().getCategoryId().equals(parentCategoryId))) {
                        Category parentCategory = retrieveCategoryByCategoryId(parentCategoryId);
                        if (!parentCategory.getProducts().isEmpty()) {
                            throw new UpdateCategoryException("Parent category cannot have any product associated with it");
                        }

                        categoryToUpdate.setParentCategory(parentCategory);
                    }
                } else {
                    if(categoryToUpdate.getParentCategory() != null) {
                        throw new CategoryNotFoundException("Category ID not provided for category to be updated");
                    }

                }
                return categoryToUpdate;
            } catch (Exception ex) {
                throw new UpdateCategoryException("Error updating category");
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Category");
        }
    }

    public Category deleteCategory(Long categoryId) throws CategoryNotFoundException , DeleteCategoryException
    {
        Category categoryToRemove = retrieveCategoryByCategoryId(categoryId);

        if(!categoryToRemove.getChildCategories().isEmpty())
        {
            throw new DeleteCategoryException("Category ID " + categoryId + " is associated with existing sub-categories and cannot be deleted!");
        }
        else if(!categoryToRemove.getProducts().isEmpty())
        {
            throw new DeleteCategoryException("Category ID " + categoryId + " is associated with existing products and cannot be deleted!");
        }
        else
        {
            categoryToRemove.setParentCategory(null);

            categoryRepository.delete(categoryToRemove);

            return categoryToRemove;
        }
    }

    private void lazilyLoadSubCategories(Category category) {
        for (Category categoryEntity : category.getChildCategories()) {
            categoryEntity.getName();
            lazilyLoadSubCategories(categoryEntity);
        }
    }
}
