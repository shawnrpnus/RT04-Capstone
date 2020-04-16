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
public class EligibleStoreForRecommendationRequest {

    private List<Long> productIds;

    private double lat;

    private double lng;
}
