package capstone.rt04.retailbackend.request.leave;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RetrieveLeaveCountInAMonthRequest {
    private LocalDate selectedDate;
    private Long staffId;
}
