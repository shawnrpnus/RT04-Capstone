package capstone.rt04.retailbackend.request.transaction;

import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TransactionRetrieveRequest {

    private Long customerId;
    private CollectionModeEnum collectionMode;
    private DeliveryStatusEnum deliveryStatus;
    private String startDate; //dateTime must be in format 'YYYY-MM-DD hh:mm:ss' should start with 00:00:00
    private String endDate; //dateTime must be in format 'YYYY-MM-DD hh:mm:ss' end with 23:59:59
    private SortEnum sortEnum;
}
