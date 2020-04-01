package capstone.rt04.retailbackend.request.stripe;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddCreditCardMobileRequest {

    @NotNull
    private Long customerId;
    @NotNull
    private String tokenId;

}
