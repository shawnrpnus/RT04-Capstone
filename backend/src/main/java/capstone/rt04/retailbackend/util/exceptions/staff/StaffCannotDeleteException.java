package capstone.rt04.retailbackend.util.exceptions.staff;

import capstone.rt04.retailbackend.entities.Staff;

public class StaffCannotDeleteException extends Exception {

    public StaffCannotDeleteException(){
    }

    public StaffCannotDeleteException(String msg){super(msg);}
}
