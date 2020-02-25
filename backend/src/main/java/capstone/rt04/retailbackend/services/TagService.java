package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.repositories.ProductRepository;
import capstone.rt04.retailbackend.repositories.TagRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.CreateNewTagException;
import capstone.rt04.retailbackend.util.exceptions.tag.DeleteTagException;
import capstone.rt04.retailbackend.util.exceptions.tag.TagNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.UpdateTagException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class TagService {

    private final ValidationService validationService;

    private final TagRepository tagRepository;

    private final ProductRepository productRepository;

    public TagService(ValidationService validationService, TagRepository tagRepository, ProductRepository productRepository) {
        this.validationService = validationService;
        this.tagRepository = tagRepository;
        this.productRepository = productRepository;
    }

    public Tag createNewTag(Tag newTag) throws InputDataValidationException, CreateNewTagException {
        Map<String, String> errorMap = validationService.generateErrorMap(newTag);
        if (errorMap == null) {
            try {
                Tag existingTag = null;

                try {
                    existingTag = retrieveTagByName(newTag.getName());
                } catch (TagNotFoundException ex) {
                    throw new TagNotFoundException("Tag does not exist!");
                }

                if (existingTag != null) {
                    errorMap = new HashMap<>();
                    errorMap.put("name", "This tag is already created!");
                    throw new InputDataValidationException(errorMap, "Tag already created");
                }

                tagRepository.save(newTag);
                return newTag;
            } catch (TagNotFoundException ex) {
                throw new CreateNewTagException("Error creating new tag: " + ex.getMessage());
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Tag");
        }

    }

    public Tag addTagToProduct(Long tagId, List<Product> products) throws TagNotFoundException, ProductNotFoundException {
        Tag tag = retrieveTagByTagId(tagId);
        for(Product p : products) {
            Product retrieveProduct = productRepository.findByProductId(p.getProductId());
            //add tag both ways is implemented in the entity
            retrieveProduct.addTag(tag);
        }

        return tag;
    }


    public Tag updateTag(Tag tag) throws InputDataValidationException, TagNotFoundException, UpdateTagException {
        Map<String, String> errorMap = validationService.generateErrorMap(tag);
        if (errorMap == null) {
            try {
                Tag tagToUpdate = retrieveTagByTagId(tag.getTagId());
                Tag existingTag = tagRepository.findByName(tag.getName()).orElse(null);

                if (existingTag != null) {
                    throw new UpdateTagException("Tag Update Failed: Duplicate Name");
                }

                tagToUpdate.setName(tag.getName());
                return tagToUpdate;
            } catch (TagNotFoundException ex) {
                throw new UpdateTagException("Error updating tag");
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Tag");
        }
    }

    public Tag deleteTag(Long tagId) throws TagNotFoundException, DeleteTagException {
        Tag tagToRemove = retrieveTagByTagId(tagId);
        for (Product p : tagToRemove.getProducts()) {
            p.getTags().remove(tagToRemove);
        }
        tagRepository.delete(tagToRemove);
        return tagToRemove;
    }

    public Tag retrieveTagByName(String name) throws TagNotFoundException {
        return tagRepository.findByName(name).orElse(null);
    }

    public Tag retrieveTagByTagId(Long tagId) throws TagNotFoundException {
        if (tagId == null) {
            throw new TagNotFoundException("Tag ID not provided");
        }
        return tagRepository.findById(tagId)
                .orElseThrow(() -> new TagNotFoundException("Tag ID " + tagId + " does not exist!"));
    }

    public List<Tag> retrieveListOfTagsByIds(List<Long> tagIds) {
        List<Tag> tags = (List<Tag>) tagRepository.findAllById(tagIds);
        return lazilyLoadTag(tags);
    }

    private List<Tag> lazilyLoadTag(List<Tag> tags) {
        for (Tag tag : tags) tag.getProducts().size();
        return tags;
    }

    public List<Tag> retrieveAllTags() {
        return lazilyLoadTag(tagRepository.findAll());
    }
}
