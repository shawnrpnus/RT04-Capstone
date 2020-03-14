package capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class InStoreRestockOrderItemNotFoundException extends Exception {
    Map<String, String> errorMap;

    public InStoreRestockOrderItemNotFoundException() {

    }

    public InStoreRestockOrderItemNotFoundException(String msg) {
        super(msg);
    }

    public InStoreRestockOrderItemNotFoundException(Map<String, String> errorMap, String msg) {
        super(msg);
        this.errorMap = errorMap;
    }
}