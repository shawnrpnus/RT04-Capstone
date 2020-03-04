package capstone.rt04.retailbackend.util.exceptions.staff;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;


@Getter
@Setter
public class StaffNotFoundException extends Exception {
    Map<String, String> errorMap;
    public StaffNotFoundException(String msg){
        super(msg);

    }

    public StaffNotFoundException(Map<String, String> errorMap,String msg){
        super(msg);
        this.errorMap = errorMap;
        }
}
