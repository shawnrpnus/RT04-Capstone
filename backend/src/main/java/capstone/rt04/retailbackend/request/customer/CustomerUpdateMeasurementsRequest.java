package capstone.rt04.retailbackend.request.customer;

import capstone.rt04.retailbackend.entities.Measurements;
import capstone.rt04.retailbackend.util.ErrorMessages;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerUpdateMeasurementsRequest {

    @NotNull
    private Long customerId;

    @NotNull
    private Measurements measurements;
}
