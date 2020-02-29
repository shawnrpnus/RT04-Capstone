package capstone.rt04.retailbackend.request.productStock;

import capstone.rt04.retailbackend.entities.ProductStock;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductStockQtyUpdateRequest {

    private Long productStockId;

    private Integer quantity;
}
