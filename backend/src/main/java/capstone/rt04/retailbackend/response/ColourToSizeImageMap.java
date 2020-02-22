package capstone.rt04.retailbackend.response;

import capstone.rt04.retailbackend.entities.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ColourToSizeImageMap {

    // this is for a certain colour of a product
    // for every product, start a new list of this entity

    private String colour;

    private List<ProductImage> productImages;

    private List<SizeToProductVariantAndStockMap> sizeMaps;

}
