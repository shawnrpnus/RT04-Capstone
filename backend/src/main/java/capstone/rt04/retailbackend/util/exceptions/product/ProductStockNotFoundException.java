package capstone.rt04.retailbackend.util.exceptions.product;



public class ProductStockNotFoundException extends Exception
{
    public ProductStockNotFoundException()
    {
    }



    public ProductStockNotFoundException(String msg)
    {
        super(msg);
    }
}