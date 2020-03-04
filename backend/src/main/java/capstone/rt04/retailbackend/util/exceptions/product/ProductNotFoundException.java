package capstone.rt04.retailbackend.util.exceptions.product;

import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter
@Setter
public class ProductNotFoundException extends Exception
{
    Map<String, String> errorMap;

    public ProductNotFoundException()
    {

    }

    public ProductNotFoundException(String msg)
    {
        super(msg);
    }

    public ProductNotFoundException(Map<String, String> errorMap,String msg)
    {
        super(msg);
        this.errorMap = errorMap;
    }
}