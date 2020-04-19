package capstone.rt04.retailbackend.controllers;


import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Style;
import capstone.rt04.retailbackend.request.style.*;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.StyleService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.DeleteStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.UpdateStyleException;
import capstone.rt04.retailbackend.util.routeconstants.StyleControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(StyleControllerRoutes.STYLE_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class StyleController {

    private final StyleService styleService;
    private final RelationshipService relationshipService;

    public StyleController(StyleService styleService, RelationshipService relationshipService) {
        this.styleService = styleService;
        this.relationshipService = relationshipService;
    }

    @PostMapping(StyleControllerRoutes.CREATE_NEW_STYLE)
    public ResponseEntity<?> createNewStyle(@RequestBody Style style) throws CreateNewStyleException, InputDataValidationException {
        Style newStyle = styleService.createNewStyle(style);
        clearStyleRelationship(newStyle);
        return new ResponseEntity<>(newStyle, HttpStatus.CREATED);
    }

    @GetMapping(StyleControllerRoutes.RETRIEVE_STYLE_BY_ID)
    public ResponseEntity<?> retrieveStyleById(@PathVariable Long styleId) throws StyleNotFoundException {
        Style style = styleService.retrieveStyleByStyleId(styleId);
        clearStyleRelationship(style);
        return new ResponseEntity<>(style, HttpStatus.OK);
    }

    @GetMapping(StyleControllerRoutes.RETRIEVE_ALL_STYLES)
    public ResponseEntity<?> retrieveAllStyles() {
        List<Style> styles = styleService.retrieveAllStyles();
        styles.forEach(style -> clearStyleRelationship(style));
        return new ResponseEntity<>(styles, HttpStatus.OK);
    }

    @PostMapping(StyleControllerRoutes.UPDATE_STYLE)
    public ResponseEntity<?> updateStyle(@RequestBody Style style) throws UpdateStyleException, StyleNotFoundException, InputDataValidationException {
        Style updatedStyle = styleService.updateStyle(style);
        clearStyleRelationship(updatedStyle);
        return new ResponseEntity<>(updatedStyle, HttpStatus.OK);
    }

    @DeleteMapping(StyleControllerRoutes.DELETE_STYLE)
    public ResponseEntity<?> deleteStyle(@PathVariable Long styleId) throws StyleNotFoundException, DeleteStyleException {
        styleService.deleteStyle(styleId);
        return new ResponseEntity<>("Style has been deleted", HttpStatus.OK);
    }

    @PostMapping(StyleControllerRoutes.ADD_STYLE_TO_PRODUCTS)
    public ResponseEntity<?> addStyleToProducts(@RequestBody AddStyleToProductRequest addStyleToProductRequest) throws StyleNotFoundException, ProductNotFoundException {
        Style style = styleService.addStyleToProduct(addStyleToProductRequest.getStyleId(), addStyleToProductRequest.getProductIds());
        clearStyleRelationship(style);
        return new ResponseEntity<>(style, HttpStatus.OK);
    }

    @PostMapping(StyleControllerRoutes.DELETE_STYLE_FROM_PRODUCTS)
    public ResponseEntity<?> addStyleToProducts(@RequestBody DeleteStyleFromProductsRequest deleteStyleFromProductsRequest) throws StyleNotFoundException, ProductNotFoundException {
        Style style = styleService.deleteStyleFromProduct(deleteStyleFromProductsRequest.getStyleId(), deleteStyleFromProductsRequest.getProductIds());
        clearStyleRelationship(style);
        return new ResponseEntity<>(style, HttpStatus.OK);
    }

    @PostMapping(StyleControllerRoutes.CREATE_STYLE_QUIZ_QNS)
    public ResponseEntity<?> createStyleQuizQns(@RequestBody StyleQuizQnsCreateRequest styleQuizQnsCreateRequest) {
        List<Style> styles = styleService.createStyleQuizQns(styleQuizQnsCreateRequest.getQuestion(),
                styleQuizQnsCreateRequest.getStyleIdAnswerMaps());
        styles.forEach(style -> clearStyleRelationship(style));
        return new ResponseEntity<>(styles, HttpStatus.CREATED);
    }

    @PostMapping(StyleControllerRoutes.DELETE_STYLE_QUIZ_QNS)
    public ResponseEntity<?> deleteStyleQuizQns(@PathVariable Integer qnsNum) {
        List<Style> styles = styleService.deleteStyleQuizQns(qnsNum);
        styles.forEach(style -> clearStyleRelationship(style));
        return new ResponseEntity<>(styles, HttpStatus.OK);
    }

    @PostMapping(StyleControllerRoutes.UPDATE_STYLE_QUIZ_QNS)
    public ResponseEntity<?> updateStyleQuizQns(@RequestBody StyleQuizQnsUpdateRequest styleQuizQnsUpdateRequest) throws StyleNotFoundException {
        List<Style> styles = styleService.updateStyleQuizQns(styleQuizQnsUpdateRequest.getQnsToUpdate(),
                styleQuizQnsUpdateRequest.getUpdatedQns(), styleQuizQnsUpdateRequest.getStyleIdAnswerMaps());
        styles.forEach(style -> clearStyleRelationship(style));
        return new ResponseEntity<>(styles, HttpStatus.CREATED);
    }

    @PostMapping(StyleControllerRoutes.CREATE_NEW_STYLE_WITH_ANS)
    public ResponseEntity<?> createNewStyleWithAns(@RequestBody CreateStyleRequest createStyleRequest) throws CreateNewStyleException, InputDataValidationException {
        Style newStyle = styleService.createNewStyleWithAns(createStyleRequest.getStyleName(), createStyleRequest.getStyleIdAnswerMaps());
        clearStyleRelationship(newStyle);
        return new ResponseEntity<>(newStyle, HttpStatus.CREATED);
    }

    private void clearStyleRelationship(Style style) {
        for(Product product : style.getProducts()) {
            relationshipService.clearProductRelationships(product);
        }
        style.setCustomers(null);
    }


}
