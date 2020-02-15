package capstone.rt04.retailbackend.controllers;


import capstone.rt04.retailbackend.entities.Style;
import capstone.rt04.retailbackend.services.StyleService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
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
        return new ResponseEntity<>(newStyle, HttpStatus.OK);
    }
}
