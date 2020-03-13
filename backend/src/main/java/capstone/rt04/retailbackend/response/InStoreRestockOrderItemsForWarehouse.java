package capstone.rt04.retailbackend.response;

import capstone.rt04.retailbackend.entities.Delivery;
import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InStoreRestockOrderItemsForWarehouse {

    private Long inStoreRestockOrderItemId;

    private Integer quantity;

    private ProductStock productStock;

    private Integer warehouseStockQuantity;

    private Timestamp deliveryDateTime;

    private DeliveryStatusEnum deliveryStatus;

    private Delivery delivery;


}
