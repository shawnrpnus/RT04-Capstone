package capstone.rt04.retailbackend.util.exceptions.staff;

import lombok.Getter;
import java.util.Map;
import lombok.Setter;

@Getter
@Setter
public class CreateNewStaffAccountException extends Exception {
    Map<String, String> errorMap;

    public CreateNewStaffAccountException(){
    }

    public CreateNewStaffAccountException(Map<String, String> errorMap,String msg) {
        super(msg);
        this.errorMap = errorMap;
    }
}
