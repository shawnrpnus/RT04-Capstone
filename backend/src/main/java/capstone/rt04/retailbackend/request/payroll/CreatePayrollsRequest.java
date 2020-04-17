package capstone.rt04.retailbackend.request.payroll;
import capstone.rt04.retailbackend.entities.Payroll;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreatePayrollsRequest {
    private LocalDate selectedDate;
}
