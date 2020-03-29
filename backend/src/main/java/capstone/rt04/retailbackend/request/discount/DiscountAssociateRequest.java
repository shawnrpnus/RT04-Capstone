package capstone.rt04.retailbackend.request.discount;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiscountAssociateRequest {

    private Long discountId;

    private List<Long> productIds;

}
