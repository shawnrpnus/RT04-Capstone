package capstone.rt04.retailbackend.request.leave;
import capstone.rt04.retailbackend.entities.StaffLeave;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EndorseRejectLeaveRequest {
    private Long leaveId;
    private Long managerId;
    private Boolean action;
}
