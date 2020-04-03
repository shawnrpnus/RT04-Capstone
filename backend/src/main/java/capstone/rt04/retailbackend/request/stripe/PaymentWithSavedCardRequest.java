package capstone.rt04.retailbackend.request.stripe;

import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentWithSavedCardRequest {

    @NotNull
    private Long customerId;

    @NotNull
    private String paymentMethodId;

    private String cardIssuer;

    private String cardLast4;

    @NotNull
    private Long totalAmount;

    private Long storeId;

    private Address deliveryAddress;

    @NotNull
    private Address billingAddress;

    private Long storeToCollectId;

    private Long promoCodeId;

    @NotNull
    private CollectionModeEnum collectionModeEnum;


}
