package capstone.rt04.retailbackend.request.productStock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductStockReadRequest {

    private Long warehouseId;

    private Long storeId;

    private Long productVariantId;
}
