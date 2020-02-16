package capstone.rt04.retailbackend.request.staff;

import capstone.rt04.retailbackend.entities.Address;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffUpdateAddressRequest {

    @NotNull
    private Long staffId;

    @NotNull
    private Address staffAddress;
}
