package capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class InsufficientStockException extends Exception {
    Map<String, String> errorMap;

    public InsufficientStockException() {

    }

    public InsufficientStockException(String msg) {
        super(msg);
    }

    public InsufficientStockException(Map<String, String> errorMap, String msg) {
        super(msg);
        this.errorMap = errorMap;
    }
}