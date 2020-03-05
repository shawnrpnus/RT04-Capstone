package capstone.rt04.retailbackend.request.stripe;

import capstone.rt04.retailbackend.entities.Address;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentWithSavedCardRequest {

    private Long customerId;

    private String paymentMethodId;

    private Long totalAmount;

    private Long storeId;

    private Address deliveryAddress;

    private Address billingAddress;

}
