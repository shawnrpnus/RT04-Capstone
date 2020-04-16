package capstone.rt04.retailbackend.response;

import capstone.rt04.retailbackend.entities.Store;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EligibleStoreResponse {

    private Long productId;

    private Store store;

    private Integer numOfAvailableColour;

}
