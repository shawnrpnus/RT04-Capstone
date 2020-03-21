package capstone.rt04.retailbackend.request.promoCode;
import capstone.rt04.retailbackend.entities.PromoCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PromoCodeUpdateRequest {
    private PromoCode newPromoCode;
}
