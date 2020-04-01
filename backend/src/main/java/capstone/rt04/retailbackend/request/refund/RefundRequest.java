package capstone.rt04.retailbackend.request.refund;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RefundRequest {
    private String refundMode;
    private String reason;
    private Long customerId;
    private List<RefundLineItemRequest> refundLineItemRequests;
}
