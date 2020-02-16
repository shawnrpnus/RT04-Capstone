package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.util.exceptions.tag.CreateNewTagException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class TagServiceTest {
    @Autowired
    private TagService tagService;

    private Long tagId1;

    @Before
    public void beforeEachTest() throws Exception {
        Tag expectedValidTag = new Tag("dress");
        Tag testValidTag = tagService.createNewTag(expectedValidTag);
        tagId1 = testValidTag.getTagId();
        assertThat(testValidTag.getTagId()).isNotNull();
        assertThat(testValidTag).isEqualTo(expectedValidTag);
    }

    @After
    public void afterEachTest() throws Exception {
        Tag validTag = tagService.retrieveTagByName("dress");
        Tag removedTag = tagService.deleteTag(validTag.getTagId());
        assertThat(removedTag.getTagId()).isEqualTo(validTag.getTagId());
    }

    @Test(expected = CreateNewTagException.class)
    public void createNewTag() throws Exception {
        Tag invalidTag = new Tag("dress");
        tagService.createNewTag(invalidTag);
    }

    @Test
    public void createAndRetrieveListOfTags() throws Exception {
        Tag tag = new Tag("bermudas");
        tagService.createNewTag(tag);
        Long tagId2 = tag.getTagId();

        List<Long> tagIds = new ArrayList<>();
        tagIds.add(tagId1);
        tagIds.add(tagId2);

        List<Tag> tags = tagService.retrieveListOfTagsByIds(tagIds);
        assertThat(tags.size()).isEqualTo(2);

        tagService.deleteTag(tagId2);
    }

    @Test
    public void updateTagName() throws Exception {
        Tag updateTag = tagService.retrieveTagByName("dress");
        String change = "LongDress";
        updateTag.setName(change);
        tagService.updateTag(updateTag);
        Tag existingTag = tagService.retrieveTagByName("LongDress");
        assertThat(existingTag.getName().compareTo(change)).isEqualTo(0);

        existingTag.setName("dress");
        tagService.updateTag(existingTag);
        Tag finalTag = tagService.retrieveTagByName("dress");
        assertThat(finalTag.getName().compareTo("dress")).isEqualTo(0);
    }


}
