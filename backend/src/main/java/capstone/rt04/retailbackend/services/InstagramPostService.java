package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.InstagramPost;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.repositories.InstagramPostRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.instagramPost.InstagramPostNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
public class InstagramPostService {

    private final InstagramPostRepository instagramPostRepository;

    private final ValidationService validationService;
    private final ProductService productService;

    public InstagramPostService(InstagramPostRepository instagramPostRepository, ValidationService validationService, ProductService productService) {
        this.instagramPostRepository = instagramPostRepository;
        this.validationService = validationService;
        this.productService = productService;
    }

    public List<InstagramPost> createInstagramPost(InstagramPost instagramPost) throws InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(instagramPost);
        instagramPostRepository.save(instagramPost);
        return retrieveAllInstagramPost();
    }

    public List<InstagramPost> retrieveAllInstagramPost() {
        List<InstagramPost> instagramPosts = instagramPostRepository.findAll();
        lazilyLoadInstagramPost(instagramPosts);
        return instagramPostRepository.findAll();
    }

    public List<InstagramPost> retrieveAllActiveInstagramPost() {
        List<InstagramPost> instagramPosts = instagramPostRepository.findAllByActive(Boolean.TRUE);
        lazilyLoadInstagramPost(instagramPosts);
        return instagramPostRepository.findAll();
    }

    public InstagramPost retrieveInstagramPostById(Long instagramPostId) throws InstagramPostNotFoundException {
        return instagramPostRepository.findById(instagramPostId).orElseThrow(() ->
                new InstagramPostNotFoundException("Instagram post with ID: " + instagramPostId + " does not exist!"));
    }

    public List<InstagramPost> updateProductsToInstagramPostAssociation(Long instagramPostId, List<Long> productIds) throws InstagramPostNotFoundException, ProductNotFoundException {
        InstagramPost instagramPost = retrieveInstagramPostById(instagramPostId);
        // Remove old links
        instagramPost.getAssociatedProducts().clear();
        Product product;
        for (Long productId : productIds) {
            product = productService.retrieveProductById(productId);
            instagramPost.getAssociatedProducts().add(product);
        }
        return retrieveAllInstagramPost();
    }

    public List<InstagramPost> activateInstagramPost(Long instagramPostId) throws InstagramPostNotFoundException {
        InstagramPost instagramPost = retrieveInstagramPostById(instagramPostId);
        instagramPost.setActive(Boolean.TRUE);
        return retrieveAllInstagramPost();
    }

    public List<InstagramPost> disableInstagramPost(Long instagramPostId) throws InstagramPostNotFoundException {
        InstagramPost instagramPost = retrieveInstagramPostById(instagramPostId);
        instagramPost.setActive(Boolean.FALSE);
        return retrieveAllInstagramPost();
    }

    public List<InstagramPost> deleteInstagramPost(Long instagramPostId) throws InstagramPostNotFoundException {
        InstagramPost instagramPost = retrieveInstagramPostById(instagramPostId);
        instagramPost.setAssociatedProducts(null);
        instagramPostRepository.delete(instagramPost);
        return retrieveAllInstagramPost();
    }

    private void lazilyLoadInstagramPost(List<InstagramPost> instagramPosts) {
        instagramPosts.forEach(instagramPost -> {
            instagramPost.getAssociatedProducts().size();
        });
    }
}
