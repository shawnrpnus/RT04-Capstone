package capstone.rt04.retailbackend.request.inStoreRestockOrder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockIdQuantityMap {

    private Long productStockId;

    private Integer orderQuantity;
}
