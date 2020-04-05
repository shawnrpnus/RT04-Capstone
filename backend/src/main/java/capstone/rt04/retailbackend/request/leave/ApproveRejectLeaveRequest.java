package capstone.rt04.retailbackend.request.leave;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApproveRejectLeaveRequest {
    private Long leaveId;
    private Long hrId;
    private Boolean action;
}
