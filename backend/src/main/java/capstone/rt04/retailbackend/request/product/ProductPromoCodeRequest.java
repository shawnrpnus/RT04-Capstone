package capstone.rt04.retailbackend.request.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductPromoCodeRequest {

    private Long promoCodeId;

    private Long productId;

    private List<Long> promoCodeIds;

    private List<Long> productIds;

    private Boolean isAppend;
}
