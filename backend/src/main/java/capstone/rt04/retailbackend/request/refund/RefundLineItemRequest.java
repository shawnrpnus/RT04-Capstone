package capstone.rt04.retailbackend.request.refund;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RefundLineItemRequest {
    private Long transactionLineItemId;
    private Integer quantityToRefund;
    private Long staffId;
}
