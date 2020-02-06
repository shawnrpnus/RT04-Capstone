package capstone.rt04.retailbackend.util.exceptions;



public class InvalidLoginCredentialsException extends Exception
{
    public InvalidLoginCredentialsException()
    {
    }
    
    
    
    public InvalidLoginCredentialsException(String msg)
    {
        super(msg);
    }
}