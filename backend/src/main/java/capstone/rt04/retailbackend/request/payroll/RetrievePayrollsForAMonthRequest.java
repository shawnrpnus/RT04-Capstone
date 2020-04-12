package capstone.rt04.retailbackend.request.payroll;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RetrievePayrollsForAMonthRequest {
    private LocalDate selectedDate;
}
