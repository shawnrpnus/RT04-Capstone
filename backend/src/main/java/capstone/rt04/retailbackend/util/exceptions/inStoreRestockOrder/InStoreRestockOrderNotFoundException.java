package capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class InStoreRestockOrderNotFoundException extends Exception {
    Map<String, String> errorMap;

    public InStoreRestockOrderNotFoundException() {

    }

    public InStoreRestockOrderNotFoundException(String msg) {
        super(msg);
    }

    public InStoreRestockOrderNotFoundException(Map<String, String> errorMap, String msg) {
        super(msg);
        this.errorMap = errorMap;
    }
}