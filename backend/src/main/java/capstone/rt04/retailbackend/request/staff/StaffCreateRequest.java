package capstone.rt04.retailbackend.request.staff;

import capstone.rt04.retailbackend.entities.Address;
import capstone.rt04.retailbackend.entities.Staff;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffCreateRequest {

    private Staff staff;
    private Address staffAddress;

}
