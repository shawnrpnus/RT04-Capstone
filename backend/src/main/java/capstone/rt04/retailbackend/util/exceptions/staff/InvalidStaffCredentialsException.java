package capstone.rt04.retailbackend.util.exceptions.staff;

import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvalidStaffCredentialsException extends Exception {
    Map<String, String> errorMap;

    public InvalidStaffCredentialsException() {
    }

    public InvalidStaffCredentialsException( String message) {
        super(message);
    }

    public InvalidStaffCredentialsException(Map<String, String> errorMap, String message) {
        super(message);
        this.errorMap = errorMap;
    }
}
