package capstone.rt04.retailbackend.response;

import com.stripe.model.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientSecretAndCardsResponse {

    // Follow format of original response
    private String client_secret;

    private List<PaymentMethod> paymentMethodList;

}
