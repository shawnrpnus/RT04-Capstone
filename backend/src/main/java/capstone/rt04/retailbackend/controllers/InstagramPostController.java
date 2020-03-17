package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.InstagramPost;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.request.instagramPost.InstagramPostUpdateRequest;
import capstone.rt04.retailbackend.services.InstagramPostService;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.instagramPost.InstagramPostNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.InstagramPostControllerRoutes.*;

@RestController
@RequestMapping(INSTAGRAM_POST_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class InstagramPostController {

    private final InstagramPostService instagramPostService;
    private final RelationshipService relationshipService;

    public InstagramPostController(InstagramPostService instagramPostService, RelationshipService relationshipService) {
        this.instagramPostService = instagramPostService;
        this.relationshipService = relationshipService;
    }

    @PostMapping(CREATE_INSTAGRAM_POST)
    public ResponseEntity<?> createInstagramPost(@RequestBody InstagramPost instagramPost) throws InputDataValidationException {
        List<InstagramPost> instagramPosts = instagramPostService.createInstagramPost(instagramPost);
        clearInstagramPostRelationships(instagramPosts);
        return new ResponseEntity<>(instagramPosts, HttpStatus.CREATED);
    }

    @GetMapping(RETRIEVE_ALL_INSTAGRAM_POST)
    public ResponseEntity<?> retrieveAllInstagramPost() {
        List<InstagramPost> instagramPosts = instagramPostService.retrieveAllInstagramPost();
        clearInstagramPostRelationships(instagramPosts);
        return new ResponseEntity<>(instagramPosts, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_ACTIVE_INSTAGRAM_POST)
    public ResponseEntity<?> retrieveAllActiveInstagramPost() {
        List<InstagramPost> instagramPosts = instagramPostService.retrieveAllActiveInstagramPost();
        clearInstagramPostRelationships(instagramPosts);
        return new ResponseEntity<>(instagramPosts, HttpStatus.OK);
    }

    @GetMapping(ACTIVATE_INSTAGRAM_POST)
    public ResponseEntity<?> activateInstagramPost(@PathVariable Long instagramPostId) throws InstagramPostNotFoundException {
        List<InstagramPost> instagramPosts = instagramPostService.activateInstagramPost(instagramPostId);
        clearInstagramPostRelationships(instagramPosts);
        return new ResponseEntity<>(instagramPosts, HttpStatus.OK);
    }

    @GetMapping(DISABLE_INSTAGRAM_POST)
    public ResponseEntity<?> disableInstagramPost(@PathVariable Long instagramPostId) throws InstagramPostNotFoundException {
        List<InstagramPost> instagramPosts = instagramPostService.disableInstagramPost(instagramPostId);
        clearInstagramPostRelationships(instagramPosts);
        return new ResponseEntity<>(instagramPosts, HttpStatus.OK);
    }

    @PostMapping(UPDATE_PRODUCTS_TO_INSTAGRAM_POST_ASSOCIATION)
    public ResponseEntity<?> updateProductsToInstagramPostAssociation(@RequestBody InstagramPostUpdateRequest request)
            throws InstagramPostNotFoundException, ProductNotFoundException {
        List<InstagramPost> instagramPosts = instagramPostService.updateProductsToInstagramPostAssociation(request.getInstagramPostId(),
                request.getProductIds());
        clearInstagramPostRelationships(instagramPosts);
        return new ResponseEntity<>(instagramPosts, HttpStatus.OK);
    }

    @DeleteMapping(DELETE_INSTAGRAM_POST)
    public ResponseEntity<?> deleteInstagramPost(@PathVariable Long instagramPostId) throws InstagramPostNotFoundException {
        List<InstagramPost> instagramPosts = instagramPostService.deleteInstagramPost(instagramPostId);
        clearInstagramPostRelationships(instagramPosts);
        return new ResponseEntity<>(instagramPosts, HttpStatus.OK);
    }

    private void clearInstagramPostRelationships(List<InstagramPost> instagramPosts) {
        for (InstagramPost instagramPost : instagramPosts) {
            for (Product product : instagramPost.getAssociatedProducts()) {
                product.setPromoCodes(null);
                product.setDiscounts(null);
                product.setReviews(null);
                product.setTags(null);
                product.setStyles(null);
                // Category
                relationshipService.clearCategoryRelationships(product.getCategory());
                // Product Variant
                product.getProductVariants().forEach(productVariant -> {
                    productVariant.setProductStocks(null);
                    productVariant.setProduct(null);
                });
            }
        }
    }
}
