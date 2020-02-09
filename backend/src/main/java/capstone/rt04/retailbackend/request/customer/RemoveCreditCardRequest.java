package capstone.rt04.retailbackend.request.customer;

import capstone.rt04.retailbackend.entities.CreditCard;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RemoveCreditCardRequest {

    @NotNull
    private Long customerId;

    @NotNull
    private Long creditCardId;
}
