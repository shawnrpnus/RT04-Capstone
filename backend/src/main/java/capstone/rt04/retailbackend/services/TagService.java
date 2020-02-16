package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.repositories.TagRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
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

    public TagService(ValidationService validationService, TagRepository tagRepository) {
        this.validationService = validationService;
        this.tagRepository = tagRepository;
    }

    public Tag createNewTag(Tag newTag) throws InputDataValidationException, CreateNewTagException
    {
        Map<String, String> errorMap = validationService.generateErrorMap(newTag);
        if (errorMap == null) {
            try {
                Tag existingTag = null;
                try {
                    existingTag = retrieveTagByName(newTag.getName());
                } catch (TagNotFoundException ex) {
                }
                if (existingTag != null) {
                    errorMap = new HashMap<>();
                    errorMap.put("tag", "This tag is already created!");
                    throw new InputDataValidationException(errorMap, "Tag already created");
                }
                tagRepository.save(newTag);

                return newTag;
            } catch(Exception ex) {
                throw new CreateNewTagException("Error creating new tag: " + ex.getMessage());
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Tag");
        }

    }

    public Tag updateTag(Tag tag) throws InputDataValidationException, TagNotFoundException, UpdateTagException
    {
        Map<String, String> errorMap = validationService.generateErrorMap(tag);
        if (errorMap == null) {
            try {
                Tag tagToUpdate = retrieveTagByTagId(tag.getTagId());
                Tag existingTag = tagRepository.findByNameAndTagId(tag.getName(), tag.getTagId()).orElse(null);

                if (existingTag != null) {
                    throw new UpdateTagException("Name of tag to be updated is duplicated!");
                }

                tagToUpdate.setName(tag.getName());
                return tagToUpdate;
            } catch (Exception ex) {
                throw new UpdateTagException("Error updating tag");
            }
        } else {
            throw new InputDataValidationException(errorMap, "Invalid Tag");
        }
    }

    public Tag deleteTag(Long tagId) throws TagNotFoundException, DeleteTagException
    {
        Tag tagToRemove = retrieveTagByTagId(tagId);
        for(Product p :tagToRemove.getProducts()) {
            p.getTags().remove(tagToRemove);
        }
        tagRepository.delete(tagToRemove);
        return tagToRemove;
    }

    public Tag retrieveTagByName(String name) throws TagNotFoundException
    {
        return tagRepository.findByName(name).orElse(null);
    }

    public Tag retrieveTagByTagId(Long tagId) throws TagNotFoundException
    {
        if(tagId == null)
        {
            throw new TagNotFoundException("Tag ID not provided");
        }
        return tagRepository.findById(tagId)
                .orElseThrow(() -> new TagNotFoundException("Tag ID " + tagId + " does not exist!"));
    }

    public List<Tag> retrieveAllTags() {
        return tagRepository.findAll();
    }

    public List<Tag> retrieveListOfTagsById(List<Long> tagIds) {
        return (List<Tag>) tagRepository.findAllById(tagIds);
    }
}
