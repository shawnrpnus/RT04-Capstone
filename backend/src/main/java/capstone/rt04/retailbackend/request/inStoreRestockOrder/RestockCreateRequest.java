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
public class RestockCreateRequest {

    private Long storeId;

    private List<StockIdQuantityMap> stockIdQuantityMaps;
}
