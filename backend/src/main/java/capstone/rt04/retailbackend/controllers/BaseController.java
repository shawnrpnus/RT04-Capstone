package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.request.tag.AddTagToProductRequest;
import capstone.rt04.retailbackend.request.tag.DeleteTagFromProductsRequest;
import capstone.rt04.retailbackend.services.TagService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.CreateNewTagException;
import capstone.rt04.retailbackend.util.exceptions.tag.DeleteTagException;
import capstone.rt04.retailbackend.util.exceptions.tag.TagNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.UpdateTagException;
import capstone.rt04.retailbackend.util.routeconstants.TagControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class BaseController {

    @GetMapping
    public ResponseEntity<?> test(){
        return new ResponseEntity<>("apricot-and-nut backend working", HttpStatus.OK);
    }

}
