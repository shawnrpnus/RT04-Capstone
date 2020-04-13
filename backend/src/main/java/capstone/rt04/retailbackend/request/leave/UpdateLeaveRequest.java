package capstone.rt04.retailbackend.request.leave;
import capstone.rt04.retailbackend.entities.Staff;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateLeaveRequest {
    private Long leaveId;
    private Staff applicant;
    private LocalDate fromDateTime;
    private LocalDate toDateTime;
}
