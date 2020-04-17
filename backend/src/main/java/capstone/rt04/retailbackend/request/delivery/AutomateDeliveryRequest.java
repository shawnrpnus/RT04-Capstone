package capstone.rt04.retailbackend.request.delivery;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AutomateDeliveryRequest {

    private List<Long> staffIds;

    private Integer maxCapacity;
}
