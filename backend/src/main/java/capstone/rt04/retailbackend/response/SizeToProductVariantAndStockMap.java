package capstone.rt04.retailbackend.response;

import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class SizeToProductVariantAndStockMap {

    // this is for a certain colour
    // every time colour change, start a new list of this entity

    private SizeEnum size;

    private Long productVariantId;

    private ProductStock productStock;

    public Integer getSizeValue() {
        return this.size.value;
    }

}
