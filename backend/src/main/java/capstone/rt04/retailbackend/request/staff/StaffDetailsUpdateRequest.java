package capstone.rt04.retailbackend.request.staff;
import capstone.rt04.retailbackend.entities.Department;
import capstone.rt04.retailbackend.entities.Staff;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;



import capstone.rt04.retailbackend.entities.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffDetailsUpdateRequest {
    private Staff staff;
    private Long roleId;
    private Long departmentId;
    private Address address;
    private Long storeId;

}
