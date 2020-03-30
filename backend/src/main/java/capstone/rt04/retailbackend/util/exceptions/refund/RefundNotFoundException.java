package capstone.rt04.retailbackend.util.exceptions.refund;

import java.util.Map;

public class RefundNotFoundException extends Exception {
    Map<String, String> errorMap;

    public RefundNotFoundException() {
    }

    public RefundNotFoundException(String message) {
        super(message);
    }
    public RefundNotFoundException(Map<String, String> errorMap, String msg)
    {
        super(msg);
        this.errorMap = errorMap;
    }
}
