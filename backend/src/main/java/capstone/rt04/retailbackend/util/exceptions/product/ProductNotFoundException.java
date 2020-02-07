package capstone.rt04.retailbackend.util.exceptions.product;



public class ProductNotFoundException extends Exception
{
    public ProductNotFoundException()
    {
    }
    
    
    
    public ProductNotFoundException(String msg)
    {
        super(msg);
    }
}