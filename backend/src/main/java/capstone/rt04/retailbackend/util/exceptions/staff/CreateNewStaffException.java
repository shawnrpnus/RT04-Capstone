package capstone.rt04.retailbackend.util.exceptions.staff;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateNewStaffException extends Exception {

    public CreateNewStaffException(){
    }

    public CreateNewStaffException(String msg) { super(msg);}
}
