package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.request.tag.AddTagToProductRequest;
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
@RequestMapping(TagControllerRoutes.TAG_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000"})
public class TagController {
    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping(TagControllerRoutes.CREATE_NEW_TAG)
    public ResponseEntity<?> createNewTag(@RequestBody Tag tag) throws CreateNewTagException, InputDataValidationException {
        Tag newTag = tagService.createNewTag(tag);
        return new ResponseEntity<>(newTag, HttpStatus.CREATED);
    }

    @GetMapping(TagControllerRoutes.RETRIEVE_TAG_BY_ID)
    public ResponseEntity<?> retrieveTagById(@PathVariable Long tagId) throws TagNotFoundException {
        Tag tag = tagService.retrieveTagByTagId(tagId);
        return new ResponseEntity<>(tag, HttpStatus.OK);
    }

    @GetMapping(TagControllerRoutes.RETRIEVE_ALL_TAGS)
    public ResponseEntity<?> retrieveAllTags() {
        return new ResponseEntity<>(tagService.retrieveAllTags(), HttpStatus.OK);
    }

    @PostMapping(TagControllerRoutes.UPDATE_TAG)
    public ResponseEntity<?> updateTag(@RequestBody Tag tag) throws UpdateTagException, TagNotFoundException, InputDataValidationException {
        Tag updatedTag = tagService.updateTag(tag);
        return new ResponseEntity<>(updatedTag, HttpStatus.OK);
    }

    @DeleteMapping(TagControllerRoutes.DELETE_TAG)
    public ResponseEntity<?> deleteStyle(@PathVariable Long tagId) throws DeleteTagException, TagNotFoundException {
        Tag tag = tagService.deleteTag(tagId);
        return new ResponseEntity<>(tag, HttpStatus.OK);
    }

    @PostMapping(TagControllerRoutes.ADD_TAG_TO_PRODUCTS)
    public ResponseEntity<?> addTagToProducts(@RequestBody AddTagToProductRequest addTagToProductRequest) throws TagNotFoundException, ProductNotFoundException {
        Tag tag = tagService.addTagToProduct(addTagToProductRequest.getTagId(), addTagToProductRequest.getProducts());
        return new ResponseEntity<>(tag, HttpStatus.OK);
    }

}
