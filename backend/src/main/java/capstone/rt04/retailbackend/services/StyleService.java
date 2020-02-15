package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Style;
import capstone.rt04.retailbackend.repositories.StyleRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.DeleteStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.UpdateStyleException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PersistenceException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class StyleService {

    private final ValidationService validationService;
    private final StyleRepository styleRepository;

    public StyleService(ValidationService validationService, StyleRepository styleRepository) {
        this.validationService = validationService;
        this.styleRepository = styleRepository;
    }

    public Style createNewStyle(Style style) throws CreateNewStyleException, InputDataValidationException {
        Map<String, String> errorMap = validationService.generateErrorMap(style);
        if (errorMap != null){
            throw new InputDataValidationException(errorMap, "Style is invalid!");
        }
        checkDuplicateStyeName(style.getStyleName());
        try {
            Style createdStyle = styleRepository.save(style);
            createdStyle.getProducts().size();
            return createdStyle;
        } catch (PersistenceException ex){
            throw new CreateNewStyleException("Error creating new style");
        }
    }

    public Style retrieveStyleByStyleId(Long styleId) throws StyleNotFoundException {
        Style style = styleRepository.findById(styleId).orElseThrow(
                () -> new StyleNotFoundException("Style with id: " + styleId + " does not exist!")
        );
        style.getProducts().size();
        return style;
    }

    public Style updateStyle(Style style) throws InputDataValidationException, StyleNotFoundException, UpdateStyleException {
        Map<String, String> errorMap = validationService.generateErrorMap(style);
        if (errorMap != null){
            throw new InputDataValidationException(errorMap, "Style is invalid!");
        }
        checkDuplicateStyeName(style.getStyleName());
        try {
            Style styleToUpdate = retrieveStyleByStyleId(style.getStyleId());
            styleToUpdate.setStyleName(style.getStyleName());
            styleToUpdate.getProducts().size();
            return styleToUpdate;
        } catch (Exception ex){
            throw new UpdateStyleException("Error updating style!");
        }
    }

    private Style deleteStyle(Style style) throws StyleNotFoundException, DeleteStyleException {
        Style styleToDelete = retrieveStyleByStyleId(style.getStyleId());
        try {
            List<Customer> customers = styleToDelete.getCustomers();
            styleToDelete.setCustomers(null);
            for (Customer customer : customers){
                customer.getPreferredStyles().remove(style);
            }

            List<Product> products = styleToDelete.getProducts();
            styleToDelete.setProducts(null);
            for (Product product : products){
                product.getStyles().remove(style);
            }

            styleRepository.delete(style);
            return style;
        } catch (Exception ex){
            throw new DeleteStyleException("Error deleting style!");
        }
    }

    private void checkDuplicateStyeName(String styleName) throws InputDataValidationException {
        Style existingStyle = styleRepository.findByStyleName(styleName).orElse(null);
        if (existingStyle != null){
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("styleName", "This style already exists!");
            throw new InputDataValidationException(errorMap, "Style already exists");
        }
    }
}
