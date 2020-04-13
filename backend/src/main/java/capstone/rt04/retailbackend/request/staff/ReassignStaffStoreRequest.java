package capstone.rt04.retailbackend.request.staff;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReassignStaffStoreRequest {
    private Long storeId;

    private List<Long> staffIds;
}
