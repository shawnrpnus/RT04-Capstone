package capstone.rt04.retailbackend.util.exceptions.customer;



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