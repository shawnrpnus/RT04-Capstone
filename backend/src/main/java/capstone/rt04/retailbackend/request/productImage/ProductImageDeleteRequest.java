package capstone.rt04.retailbackend.request.productImage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageDeleteRequest {

    @NotNull(message = "Product image must be selected")
    private Long productImageId;

    @NotNull(message = "Product image must be linked to a product")
    private Long productVariantId;
}
