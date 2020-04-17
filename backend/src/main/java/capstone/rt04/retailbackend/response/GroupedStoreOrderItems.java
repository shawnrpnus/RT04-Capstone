package capstone.rt04.retailbackend.response;

import capstone.rt04.retailbackend.entities.InStoreRestockOrderItem;
import capstone.rt04.retailbackend.entities.Store;
import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupedStoreOrderItems {

    private Store store;
    private List<InStoreRestockOrderItem> inStoreRestockOrderItems = new ArrayList<>();
    private List<Transaction> transactions = new ArrayList<>();
    private DeliveryStatusEnum deliveryStatus;
}
