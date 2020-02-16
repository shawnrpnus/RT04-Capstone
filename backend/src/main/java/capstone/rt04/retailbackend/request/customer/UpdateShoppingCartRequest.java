package capstone.rt04.retailbackend.request.customer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateShoppingCartRequest {

    @NotNull
    private Integer quantity;

    @NotNull
    private Long productVariantId;

    @NotNull
    private Long customerId;

    @NotNull
    private String cartType;
}
