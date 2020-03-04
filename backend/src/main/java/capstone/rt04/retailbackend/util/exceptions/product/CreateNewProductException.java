package capstone.rt04.retailbackend.util.exceptions.product;


import java.util.Map;

public class CreateNewProductException extends Exception
{
    Map<String, String> errorMap;

    public CreateNewProductException(String msg)
    {
        super(msg);
    }
    
    
    
    public CreateNewProductException(String msg)
    {
        super(msg);
        this.errorMap = errorMap;
    }
}