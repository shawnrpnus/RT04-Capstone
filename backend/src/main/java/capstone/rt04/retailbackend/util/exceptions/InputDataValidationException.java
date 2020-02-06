package capstone.rt04.retailbackend.util.exceptions;

import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InputDataValidationException extends Exception {

    Map<String, String> errorMap;

    public InputDataValidationException() {
    }

    public InputDataValidationException(Map<String, String> errorMap, String message) {
        super(message);
        this.errorMap = errorMap;
    }

}

