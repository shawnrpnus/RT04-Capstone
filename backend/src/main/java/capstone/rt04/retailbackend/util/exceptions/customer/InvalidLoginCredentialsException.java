package capstone.rt04.retailbackend.util.exceptions.customer;


import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class InvalidLoginCredentialsException extends Exception
{
    Map<String, String> errorMap;

    public InvalidLoginCredentialsException()
    {
    }

    public InvalidLoginCredentialsException(Map<String, String> errorMap, String message) {
        super(message);
        this.errorMap = errorMap;
    }
    
    public InvalidLoginCredentialsException(String msg)
    {
        super(msg);
    }
}