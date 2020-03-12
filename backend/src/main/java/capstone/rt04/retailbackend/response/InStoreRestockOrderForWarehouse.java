package capstone.rt04.retailbackend.response;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InStoreRestockOrderForWarehouse {

    private Long inStoreRestockOrderId;

    private Timestamp orderDateTime;

    private Timestamp deliveryDateTime;

    private DeliveryStatusEnum deliveryStatus;

    private List<InStoreRestockOrderItemsForWarehouse> inStoreRestockOrderItemsForWarehouse;

    private Store store;

    private Warehouse warehouse;

}
