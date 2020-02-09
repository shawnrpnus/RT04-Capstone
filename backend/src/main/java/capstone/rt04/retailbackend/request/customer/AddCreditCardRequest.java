package capstone.rt04.retailbackend.request.customer;

import capstone.rt04.retailbackend.entities.CreditCard;
import capstone.rt04.retailbackend.entities.Measurements;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddCreditCardRequest {

    @NotNull
    private Long customerId;

    @NotNull
    private CreditCard creditCard;
}
