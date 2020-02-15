package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Style;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.DeleteStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.UpdateStyleException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class StyleServiceTest {

    @Autowired
    private StyleService styleService;

    @Test
    public void crudStyle() throws CreateNewStyleException, InputDataValidationException, StyleNotFoundException, UpdateStyleException, DeleteStyleException {
        Style invalidStyle = new Style();
        try {
            styleService.createNewStyle(invalidStyle);
        } catch (InputDataValidationException ex){
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("styleName", ErrorMessages.STYLE_NAME_REQUIRED);
            assertThat(ex.getErrorMap()).isEqualTo(errorMap);
        }
        Style style = new Style("Bold");
        Style newStyle = styleService.createNewStyle(style);
        assertThat(newStyle.getStyleId()).isNotNull();

        try{
            styleService.createNewStyle(style);
        } catch (InputDataValidationException ex) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("styleName", ErrorMessages.STYLE_ALREADY_EXISTS);
            assertThat(ex.getErrorMap()).isEqualTo(errorMap);
        }


        Style retrievedStyle = styleService.retrieveStyleByStyleId(newStyle.getStyleId());
        assertThat(retrievedStyle.getStyleId().compareTo(newStyle.getStyleId())).isZero();

        List<Style> allStyles = styleService.retrieveAllStyles();
        assertThat(allStyles.size()).isOne();

        retrievedStyle.setStyleName("Updated");
        Style updatedStyle = styleService.updateStyle(retrievedStyle);
        assertThat(updatedStyle.getStyleId().compareTo(retrievedStyle.getStyleId())).isZero();
        assertThat(updatedStyle.getStyleName()).isEqualTo("Updated");

        styleService.deleteStyle(updatedStyle.getStyleId());
        allStyles = styleService.retrieveAllStyles();
        assertThat(allStyles.size()).isZero();
    }

}
