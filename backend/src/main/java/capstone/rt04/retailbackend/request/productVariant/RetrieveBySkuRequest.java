package capstone.rt04.retailbackend.request.productVariant;

import capstone.rt04.retailbackend.request.product.ColourToImageUrlsMap;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RetrieveBySkuRequest {

    @NotNull
    @Size(min=1, message="Please enter an SKU")
    protected String sku;
}
