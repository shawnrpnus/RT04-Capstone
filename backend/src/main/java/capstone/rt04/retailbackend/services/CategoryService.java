package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.repositories.CategoryRepository;
import capstone.rt04.retailbackend.response.CategoryDetails;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.DeleteCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.UpdateCategoryException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

            if (parentCategoryId != null) {
                Category parentCategoryEntity = retrieveCategoryByCategoryId(parentCategoryId);

                if (!parentCategoryEntity.getProducts().isEmpty()) {
                    throw new CreateNewCategoryException("Parent category cannot be associated with any product");
                }
                newCategory.setParentCategory(parentCategoryEntity);
                parentCategoryEntity.getChildCategories().add(newCategory);
            }
            try {
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
        Category category = categoryRepository.findByCategoryName(name).orElseThrow(
                () -> new CategoryNotFoundException(("Category with name: " + name + " does not exist!")));

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
        return categoryRepository.findAllByParentCategoryIsNull();
    }

    public List<CategoryDetails> retrieveAllChildCategories() {
        List<Category> categories = categoryRepository.findAllByChildCategoriesIsNull();
        List<CategoryDetails> categoryDetails = new ArrayList<>();
        String leafNodeName;

        for(Category category : categories) {
            leafNodeName = generateLeafNodeName(category, "");
            categoryDetails.add(new CategoryDetails(category, leafNodeName));
        }
        return categoryDetails;
    }

    public String generateLeafNodeName(Category category, String leafNodeName) {

        leafNodeName += category.getCategoryName();
        if (category.getParentCategory() != null)  leafNodeName += " > ";

        if (category.getParentCategory() == null) return leafNodeName;
        leafNodeName = generateLeafNodeName(category.getParentCategory(), leafNodeName);

        return leafNodeName;
    }


    public Category updateCategory(Category category, Long parentCategoryId) throws InputDataValidationException, CategoryNotFoundException, UpdateCategoryException {
        Map<String, String> errorMap = validationService.generateErrorMap(category);

        if (errorMap == null) {

            Category categoryToUpdate = retrieveCategoryByCategoryId(category.getCategoryId());

            categoryToUpdate.setCategoryName(category.getCategoryName());

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
            }
            return categoryToUpdate;

        } else {
            throw new InputDataValidationException(errorMap, "Invalid Category");
        }
    }

    public Category deleteCategory(Long categoryId) throws CategoryNotFoundException, DeleteCategoryException {
        Category categoryToRemove = retrieveCategoryByCategoryId(categoryId);

        if (!categoryToRemove.getProducts().isEmpty() || checkChildrenHaveProducts(categoryToRemove.getChildCategories())) {
            throw new DeleteCategoryException("Category is associated with existing products and cannot be deleted!");
        } else {
            // category no products, and children no products
            categoryToRemove.setParentCategory(null);
            if (!categoryToRemove.getChildCategories().isEmpty()) {
                recursivelyDeleteChildren(categoryToRemove.getChildCategories());
            }
            categoryRepository.delete(categoryToRemove);

            return categoryToRemove;
        }
    }

    // PRE-CONDITION: already checkChildrenHaveProducts is false
    private void recursivelyDeleteChildren(List<Category> childCategories) {
        for (int i = 0; i < childCategories.size(); i++) {
            Category child = childCategories.get(i);
            if (!child.getChildCategories().isEmpty()) {
                recursivelyDeleteChildren(child.getChildCategories());
            }

            child.getParentCategory().getChildCategories().remove(child);
            i--;
            child.setParentCategory(null);
            categoryRepository.delete(child);
        }
    }

    public boolean checkChildrenHaveProducts(List<Category> childCategories) {
        for (Category child : childCategories) {
            // has products
            if (!child.getProducts().isEmpty()) {
                return true;
            }
            // no products, is leaf node
            if (child.getChildCategories().isEmpty()) {
                return false;
            }

            return checkChildrenHaveProducts(child.getChildCategories());
        }
        return false;
    }

    private void lazilyLoadSubCategories(Category category) {
        for (Category categoryEntity : category.getChildCategories()) {
            categoryEntity.getCategoryName();
            lazilyLoadSubCategories(categoryEntity);
        }
    }
}
