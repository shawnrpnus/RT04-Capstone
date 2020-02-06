package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.repositories.TagRepository;
import capstone.rt04.retailbackend.util.exceptions.TagNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
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
}
