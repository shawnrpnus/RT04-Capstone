package capstone.rt04.retailbackend.util.exceptions.reservation;



public class ReservationNotFoundException extends Exception
{
    public ReservationNotFoundException()
    {
    }



    public ReservationNotFoundException(String msg)
    {
        super(msg);
    }
}