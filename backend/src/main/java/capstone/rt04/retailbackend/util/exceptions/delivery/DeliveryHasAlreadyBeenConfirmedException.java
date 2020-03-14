package capstone.rt04.retailbackend.util.exceptions.delivery;



public class DeliveryHasAlreadyBeenConfirmedException extends Exception
{
    public DeliveryHasAlreadyBeenConfirmedException()
    {
    }



    public DeliveryHasAlreadyBeenConfirmedException(String msg)
    {
        super(msg);
    }
}