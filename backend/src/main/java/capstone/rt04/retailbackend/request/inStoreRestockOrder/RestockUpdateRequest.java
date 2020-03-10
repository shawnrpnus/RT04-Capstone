package capstone.rt04.retailbackend.request.inStoreRestockOrder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RestockUpdateRequest {

    private Long restockOrderId;

    private List<StockIdQuantityMap> stockIdQuantityMaps;
}
