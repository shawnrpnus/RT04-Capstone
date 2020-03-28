package capstone.rt04.retailbackend.util.exceptions.delivery;



public class NoItemForDeliveryException extends Exception
{
    public NoItemForDeliveryException()
    {
    }



    public NoItemForDeliveryException(String msg)
    {
        super(msg);
    }
}