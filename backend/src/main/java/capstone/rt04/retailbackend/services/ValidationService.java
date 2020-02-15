package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import org.hibernate.validator.internal.engine.path.PathImpl;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class ValidationService {

    private final ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
    private final Validator validator = validatorFactory.getValidator();

    public <E> Map<String, String> generateErrorMap(E entity) {
        Set<ConstraintViolation<E>> constraintViolations = validator.validate(entity);

        if (constraintViolations.isEmpty()) {
            return null;
        } else {
            return generateErrorMapFromConstraintViolations(constraintViolations);
        }
    }

    public <E> void throwExceptionIfInvalidBean(E entity) throws InputDataValidationException {
        Map<String, String> errorMap = generateErrorMap(entity);
        if (errorMap != null)
            throw new InputDataValidationException(errorMap, entity.getClass().toString() + " is invalid!");
    }

    private <E> Map<String, String> generateErrorMapFromConstraintViolations(Set<ConstraintViolation<E>> constraintViolations) {
        Map<String, String> errorMap = new HashMap<>();
        for (ConstraintViolation constraintViolation : constraintViolations) {
            String propertyName = ((PathImpl) constraintViolation.getPropertyPath()).getLeafNode().getName();
            errorMap.put(propertyName, constraintViolation.getMessage());
        }

        return errorMap;
    }
}
