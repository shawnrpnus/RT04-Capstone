package capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class InStoreRestockOrderUpdateException extends Exception {
    Map<String, String> errorMap;

    public InStoreRestockOrderUpdateException() {

    }

    public InStoreRestockOrderUpdateException(String msg) {
        super(msg);
    }

    public InStoreRestockOrderUpdateException(Map<String, String> errorMap, String msg) {
        super(msg);
        this.errorMap = errorMap;
    }
}