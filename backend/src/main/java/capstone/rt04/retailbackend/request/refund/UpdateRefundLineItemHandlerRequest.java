package capstone.rt04.retailbackend.request.refund;

import capstone.rt04.retailbackend.util.enums.RefundProgressEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateRefundLineItemHandlerRequest {
    private Long refundLineItemId;
    private String refundProgressEnum;
    private Long staffId;
    private Integer quantityConfirmedRefunded;
}
