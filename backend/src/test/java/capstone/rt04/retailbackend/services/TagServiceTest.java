package capstone.rt04.retailbackend.services;

import static org.assertj.core.api.Assertions.assertThat;
import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.tag.CreateNewTagException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class TagServiceTest {
    @Autowired
    private TagService tagService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Before
    public void beforeEachTest() throws Exception{
        Tag expectedValidTag = new Tag("dress");
        Tag testValidTag = tagService.createNewTag(expectedValidTag);
        assertThat(testValidTag.getTagId()).isNotNull();
        assertThat(testValidTag).isEqualTo(expectedValidTag);
    }

    @After
    public void afterEachTest() throws Exception{
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
    public void updateTagName() throws Exception{
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
