package capstone.rt04.retailbackend.request.transaction;

import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TransactionRetrieveRequest {

    private CollectionModeEnum collectionMode;
    private DeliveryStatusEnum deliveryStatus;
    private Date startDate;
    private Date endDate;
    private SortEnum sortEnum;
}
