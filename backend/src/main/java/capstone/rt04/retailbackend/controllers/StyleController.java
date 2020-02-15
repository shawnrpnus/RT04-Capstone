package capstone.rt04.retailbackend.controllers;


import capstone.rt04.retailbackend.entities.Style;
import capstone.rt04.retailbackend.services.StyleService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.DeleteStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.UpdateStyleException;
import capstone.rt04.retailbackend.util.routeconstants.StyleControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(StyleControllerRoutes.STYLE_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class StyleController {

    private final StyleService styleService;

    public StyleController(StyleService styleService) {
        this.styleService = styleService;
    }

    @PostMapping(StyleControllerRoutes.CREATE_NEW_STYLE)
    public ResponseEntity<?> createNewStyle(@RequestBody Style style) throws CreateNewStyleException, InputDataValidationException {
        Style newStyle = styleService.createNewStyle(style);
        return new ResponseEntity<>(newStyle, HttpStatus.CREATED);
    }

    @GetMapping(StyleControllerRoutes.RETRIEVE_STYLE_BY_ID)
    public ResponseEntity<?> retrieveStyleById(@PathVariable Long styleId) throws StyleNotFoundException {
        Style style = styleService.retrieveStyleByStyleId(styleId);
        return new ResponseEntity<>(style, HttpStatus.OK);
    }

    @GetMapping(StyleControllerRoutes.RETRIEVE_ALL_STYLES)
    public ResponseEntity<?> retrieveAllStyles() {
        return new ResponseEntity<>(styleService.retrieveAllStyles(), HttpStatus.OK);
    }

    @PostMapping(StyleControllerRoutes.UPDATE_STYLE)
    public ResponseEntity<?> updateStyle(@RequestBody Style style) throws UpdateStyleException, StyleNotFoundException, InputDataValidationException {
        Style updatedStyle = styleService.updateStyle(style);
        return new ResponseEntity<>(updatedStyle, HttpStatus.OK);
    }

    @DeleteMapping(StyleControllerRoutes.DELETE_STYLE)
    public ResponseEntity<?> deleteStyle(@PathVariable Long styleId) throws StyleNotFoundException, DeleteStyleException {
        Style style = styleService.deleteStyle(styleId);
        return new ResponseEntity<>(style, HttpStatus.OK);
    }
}
