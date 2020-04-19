package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Style;
import capstone.rt04.retailbackend.repositories.ProductRepository;
import capstone.rt04.retailbackend.repositories.StyleRepository;
import capstone.rt04.retailbackend.request.style.StyleIdAnswerMap;
import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.DeleteStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.UpdateStyleException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class StyleService {

    private final ValidationService validationService;
    private final StyleRepository styleRepository;
    private final ProductRepository productRepository;

    public StyleService(ValidationService validationService, StyleRepository styleRepository, ProductRepository productRepository) {
        this.validationService = validationService;
        this.styleRepository = styleRepository;
        this.productRepository = productRepository;
    }

    public Style createNewStyle(Style style) throws CreateNewStyleException, InputDataValidationException {
        Map<String, String> errorMap = validationService.generateErrorMap(style);
        if (errorMap != null){
            throw new InputDataValidationException(errorMap, "Style is invalid!");
        }
        checkDuplicateStyleName(style.getStyleName());
        try {
            Style createdStyle = styleRepository.save(style);
            createdStyle.getProducts().size();
            return createdStyle;
        } catch (PersistenceException ex){
            throw new CreateNewStyleException("Error creating new style");
        }
    }

    public Style addStyleToProduct(Long styleId, List<Long> productIds) throws StyleNotFoundException, ProductNotFoundException {
        Style style = retrieveStyleByStyleId(styleId);
        for(Long p : productIds) {
            Product retrieveProduct = productRepository.findByProductId(p);
            try{
                retrieveProduct.addStyle(style);
            } catch(NullPointerException ex) {
                throw new ProductNotFoundException("Product with Product ID: " + p + " not found!");
            }
        }

        return style;
    }

    public Style deleteStyleFromProduct(Long styleId, List<Long> productIds) throws StyleNotFoundException, ProductNotFoundException {
        Style style = retrieveStyleByStyleId(styleId);
        for(Long p : productIds) {
            Product retrieveProduct = productRepository.findByProductId(p);
            try{
                retrieveProduct.getStyles().remove(style);
                style.getProducts().remove(retrieveProduct);
            } catch(NullPointerException ex) {
                throw new ProductNotFoundException("Product with Product ID: " + p + " not found!");
            }
        }
        return style;
    }

    public Style retrieveStyleByStyleId(Long styleId) throws StyleNotFoundException {
        Style style = styleRepository.findById(styleId).orElseThrow(
                () -> new StyleNotFoundException("Style with id: " + styleId + " does not exist!")
        );
        style.getProducts().size();
        return style;
    }

    public Style retrieveStyleByStyleName(String styleName) throws StyleNotFoundException {
        Style style = styleRepository.findByStyleName(styleName).orElseThrow(
                () -> new StyleNotFoundException("Style with name: " + styleName + " does not exist!")
        );
        style.getProducts().size();
        return style;
    }

    public List<Style> retrieveListOfStylesById(List<Long> styleIds) {
        List<Style> styles = (List<Style>) styleRepository.findAllById(styleIds);
        return lazilyLoadStyle(styles);
    }

    public List<Style> retrieveAllStyles() {
        List<Style> styles = styleRepository.findAll();
        return lazilyLoadStyle(styleRepository.findAll());
    }

    private List<Style> lazilyLoadStyle(List<Style> styles) {
        for(Style style: styles) {
            style.getProducts().size();
            style.getCustomers().size();
        }
        return styles;
    }

    public Style updateStyle(Style style) throws InputDataValidationException, StyleNotFoundException, UpdateStyleException {
        Map<String, String> errorMap = validationService.generateErrorMap(style);
        if (errorMap != null){
            throw new InputDataValidationException(errorMap, "Style is invalid!");
        }
        checkDuplicateStyleName(style.getStyleName());
        try {
            Style styleToUpdate = retrieveStyleByStyleId(style.getStyleId());
            styleToUpdate.setStyleName(style.getStyleName());
            styleToUpdate.getProducts().size();
            return styleToUpdate;
        } catch (Exception ex){
            throw new UpdateStyleException("Error updating style!");
        }
    }

    public void deleteStyle(Long styleId) throws StyleNotFoundException, DeleteStyleException {
        Style styleToDelete = retrieveStyleByStyleId(styleId);
        try {
            List<Customer> customers = styleToDelete.getCustomers();
            for (Customer customer : customers){
                customer.setStyle(null);
            }

            List<Product> products = styleToDelete.getProducts();
            for (Product product : products){
                product.getStyles().remove(styleToDelete);
            }

            styleRepository.delete(styleToDelete);
        } catch (Exception ex){
            throw new DeleteStyleException("Error deleting style!");
        }
    }

    private void checkDuplicateStyleName(String styleName) throws InputDataValidationException {
        Style existingStyle = styleRepository.findByStyleName(styleName).orElse(null);
        if (existingStyle != null){
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("styleName", "This style is already exists!");
            throw new InputDataValidationException(errorMap, ErrorMessages.STYLE_ALREADY_EXISTS);
        }
    }

    public List<Style> createStyleQuizQns(String question, List<StyleIdAnswerMap> styleIdAnswerMaps) {
        List<Style> allStyles = retrieveAllStyles();
        Integer index = 0;
        for (Style style: allStyles) {
            List<String> questions = style.getQuestions();
            Map<String, String> answers = style.getAnswers();
            questions.add(question);
            //get styleIdAnswerMap based on index
            StyleIdAnswerMap map = styleIdAnswerMaps.get(index);
            //based on this styleIdAnswerMap, get the answer
            String ansRetrieved = map.getAnswer();
            answers.put(question, ansRetrieved);
            style.setQuestions(questions);
            style.setAnswers(answers);
            System.out.println(style.getAnswers());
            index++;
        }
        return allStyles;
    }

    public List<Style> deleteStyleQuizQns(Integer qnsNum) {
        List<Style> allStyles = retrieveAllStyles();
        for (Style style: allStyles) {
            List<String> questions = style.getQuestions();
            Integer lengthBefore = questions.size();
            Integer index = 0;
            Map<String, String> answers = style.getAnswers();

            String question = questions.get(qnsNum);
            questions.remove(question);
            Integer lengthAfter = questions.size();
            style.setQuestions(questions);
            answers.remove(question);
            style.setAnswers(answers);
            System.out.println("size before:" + lengthBefore + "size after:" + lengthAfter);
            System.out.println("removed question successfully");

        }
        return allStyles;
    }

    public List<Style> updateStyleQuizQns(String qnsToUpdate, String updatedQns, List<StyleIdAnswerMap> styleIdAnswerMaps) throws StyleNotFoundException {
        //retrieve all styles
        List<Style> allStyles = retrieveAllStyles();
        System.out.println(styleIdAnswerMaps);
        for (StyleIdAnswerMap map: styleIdAnswerMaps) {
            String ansRetrieved = map.getAnswer();
            Long idRetrieved = map.getStyleId();
            //retrieve style by style id
            Integer index = 0;
            Style style = retrieveStyleByStyleId(idRetrieved);
            List<String> questions = style.getQuestions();
            Map<String, String> answers = style.getAnswers();
            for (int i = 0; i < questions.size(); i++) {
                if (questions.get(i).equals(qnsToUpdate)) {
                    index = i;
                    break;
                }
            }
            //set questions List with updatedQns based on index
            questions.set(index, updatedQns);
            style.setQuestions(questions);
            //remove old qns,ans pair value
            answers.remove(qnsToUpdate);
            //put in new qns,ans pair value
            answers.put(updatedQns, ansRetrieved);
            System.out.println(ansRetrieved);
            //set style with updatedQns
            style.setAnswers(answers);
        }
        return allStyles;
    }

    public Style createNewStyleWithAns(String styleName, List<StyleIdAnswerMap> styleIdAnswerMaps) throws CreateNewStyleException, InputDataValidationException {
        Style newStyle = new Style(styleName);
        Map<String, String> errorMap = validationService.generateErrorMap(newStyle);
        if (errorMap != null){
            throw new InputDataValidationException(errorMap, "Style is invalid!");
        }
        checkDuplicateStyleName(newStyle.getStyleName());
        try {
            //retrieve all styles
            List<Style> allStyles = retrieveAllStyles();
            Style firstStyle = allStyles.get(0);
            List<String> questions = firstStyle.getQuestions();
            List<String> newQns = new ArrayList<>();
            Integer index = 0;
            Map<String, String> qnsAnsMap = new HashMap<String, String>();
            for (StyleIdAnswerMap map: styleIdAnswerMaps) {
                qnsAnsMap.put(questions.get(index), map.getAnswer());
                newQns.add(questions.get(index));
                index++;
            }
            newStyle.setQuestions(newQns);
            newStyle.setAnswers(qnsAnsMap);
            Style createdStyle = styleRepository.save(newStyle);
            createdStyle.getProducts().size();
            return createdStyle;
        } catch (PersistenceException ex){
            throw new CreateNewStyleException("Error creating new style");
        }
    }
}
