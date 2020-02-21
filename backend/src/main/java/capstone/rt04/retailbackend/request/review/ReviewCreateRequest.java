package capstone.rt04.retailbackend.request.review;

import capstone.rt04.retailbackend.entities.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewCreateRequest {
    private Review review;
    private Long productId;
    private Long customerId;
}
