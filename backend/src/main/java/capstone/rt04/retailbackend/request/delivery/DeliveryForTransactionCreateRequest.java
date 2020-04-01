package capstone.rt04.retailbackend.request.delivery;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryForTransactionCreateRequest {

    private List<Long> transactionIds;

    private Long staffId;
}
