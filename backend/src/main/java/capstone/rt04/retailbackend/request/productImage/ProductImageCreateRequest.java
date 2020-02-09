package capstone.rt04.retailbackend.request.productImage;

import capstone.rt04.retailbackend.entities.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageCreateRequest {

    @NotNull(message = "Product images must be provided")
    private List<ProductImage> productImages;

    @NotNull(message = "Product image must be linked to a product")
    private Long productVariantId;
}
