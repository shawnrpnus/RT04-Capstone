package capstone.rt04.retailbackend.request.productVariant;

import capstone.rt04.retailbackend.entities.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariantCreateRequest {

    private ProductVariant productVariant;

    private Long productId;

}
