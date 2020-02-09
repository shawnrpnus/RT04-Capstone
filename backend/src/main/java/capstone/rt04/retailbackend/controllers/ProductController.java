package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.services.CategoryService;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.TagNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = {"http://localhost:3000"})
public class ProductController {

    @Autowired
    private final CategoryService categoryService;
    private final ProductService productService;

    public ProductController(CategoryService categoryService, ProductService productService) {
        this.categoryService = categoryService;
        this.productService = productService;
    }

    @GetMapping("/retrieveProductById/{productId}")
    public ResponseEntity<?> retrieveProductById(@PathVariable Long productId) {
        try {
            Product product = productService.retrieveProductById(productId);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (ProductNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/retrieveAllProduct")
    public ResponseEntity<?> retrieveAllProduct() {
        try {
            List<Product> products = productService.retrieveAllProducts();
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateProduct/{productId}")
    public ResponseEntity<?> updateProduct(@RequestBody Product newProduct) {
        try {
            Product product = productService.updateProduct(newProduct);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (ProductNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/createNewProduct")
    public ResponseEntity<?> createNewProduct(@RequestBody Product product, @RequestParam Long categoryId) {
        try {
            Category category = categoryService.retrieveCategoryByCategoryId(categoryId);
            product.setCategory(category);
            Product newProduct = productService.createNewProduct(product, categoryId, null);
            return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (CreateNewProductException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/addOrRemovePromoCode")
    public ResponseEntity<?> addOrRemovePromoCode(@RequestParam Long promoCodeId, @RequestParam Long productId, @RequestParam Boolean add) {
        try {
            if (add) {
                Product product = productService.addPromoCode(promoCodeId, productId);
                return new ResponseEntity<>(product, HttpStatus.CREATED);
            } else {
                Product product = productService.removePromoCode(promoCodeId, productId);
                return new ResponseEntity<>(product, HttpStatus.CREATED);
            }
        } catch (PromoCodeNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (ProductNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/addOrRemoveTag")
    public ResponseEntity<?> addOrRemoveTag(@RequestParam Long tagId, @RequestParam Long productId, @RequestParam Boolean add) {
        try {
            if (add) {
                Tag tag = productService.addTag(tagId, productId);
                return new ResponseEntity<>(tag, HttpStatus.CREATED);
            } else {
                Tag tag = productService.removeTag(tagId, productId);
                return new ResponseEntity<>(tag, HttpStatus.CREATED);
            }
        } catch (ProductNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (TagNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




//    @GetMapping("/retrieveAllCategory")
//    public ResponseEntity<?> retrieveAllCategory() {
//        try {
//            List<Category> categories = categoryService.retrieveAllCategories();
//            return new ResponseEntity<>(categories, HttpStatus.OK);
//        } catch (Exception ex) {
//            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

//    @GetMapping("/getEvaluationsDoneByManager")
//    public ResponseEntity<?> getEvaluationsDoneByManager(@RequestParam Long employeeId) {
//        List<Evaluation> evals = evaluationService.getEvaluationsDoneByManager(employeeId);
//        for (Evaluation e : evals) {
//            e.getSurveyForm().setEvaluations(null);
//        }
//        return new ResponseEntity<>(evals, HttpStatus.OK);
//    }
//
//    @GetMapping("/getEmployeesForManager/{managerId}")
//    public ResponseEntity<?> getEmployeesForManager(@PathVariable Long managerId) {
//        return new ResponseEntity<>(employeeService.getEmployeesForManager(managerId), HttpStatus.OK);
//    }
}
