package capstone.rt04.retailbackend.request.stripe;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeleteCardRequest {

    private Long customerId;

    private Long creditCardId;
}
