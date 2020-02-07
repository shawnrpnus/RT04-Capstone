package capstone.rt04.retailbackend.util.exceptions.shoppingcart;



public class InvalidCartTypeException extends Exception
{
    public InvalidCartTypeException()
    {
    }



    public InvalidCartTypeException(String msg)
    {
        super(msg);
    }
}