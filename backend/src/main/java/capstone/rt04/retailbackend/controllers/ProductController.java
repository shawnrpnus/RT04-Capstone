package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.services.CategoryService;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductException;
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

    @GetMapping("/")
    public ResponseEntity<?> retrieveProduct(@RequestParam Long productId) {

        return new ResponseEntity<>("Ola!", HttpStatus.OK);
    }

    @GetMapping("/retrieveAllCategory")
    public ResponseEntity<?> retrieveCategory() {
        try {
            List<Category> categories = categoryService.retrieveAllCategories();
            return new ResponseEntity<>(categories, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/retrieveAllProduct")
    public ResponseEntity<?> retrieveAllProduct() {
        try {
            List<Product> products = productService.retrieveAllProducts();
//            products = removeCyclicReference(products);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/createNewProduct")
    public ResponseEntity<?> createNewProduct(@RequestBody Product product) {
        try {
            Product newProduct = productService.createNewProduct(product, null, null);
            return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
        } catch (InputDataValidationException ex) {
            return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
        } catch (CreateNewProductException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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
