package capstone.rt04.retailbackend.request.leave;
import capstone.rt04.retailbackend.entities.PromoCode;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.entities.StaffLeave;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateLeaveRequest {
    private Long leaveId;
    private Staff applicant;
    private Date fromDateTime;
    private Date toDateTime;
}
