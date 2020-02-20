package capstone.rt04.retailbackend.request.staff;

import capstone.rt04.retailbackend.entities.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffAccountCreateRequest {
    private Long staffId;
}
