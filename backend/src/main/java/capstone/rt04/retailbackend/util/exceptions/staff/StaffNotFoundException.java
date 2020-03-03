package capstone.rt04.retailbackend.util.exceptions.staff;

import java.util.Map;

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
