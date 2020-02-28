package capstone.rt04.retailbackend.request.productVariant;

import capstone.rt04.retailbackend.request.product.ColourToImageUrlsMap;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariantCreateRequest {
    private Long productId;

    private List<ColourToImageUrlsMap> colourToImageUrlsMaps;

    private List<SizeEnum> sizes;
}
