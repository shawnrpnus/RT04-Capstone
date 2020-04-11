package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Payroll;
import capstone.rt04.retailbackend.entities.StaffLeave;
import capstone.rt04.retailbackend.request.payroll.CalculateMonthlyPayrollRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.PayrollService;
import capstone.rt04.retailbackend.services.ValidationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.LeaveControllerRoutes.RETRIEVE_ALL_LEAVES;
import static capstone.rt04.retailbackend.util.routeconstants.PayrollControllerRoutes.*;

@RestController
@RequestMapping(PAYROLL_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PayrollController {
    private final PayrollService payrollService;
    private final ValidationService validationService;

    public PayrollController(PayrollService payrollService, ValidationService validationService) {
        this.payrollService = payrollService;
        this.validationService = validationService;
    }

    @PostMapping(CALCULATE_MONTHLY_SALARY)
    public ResponseEntity<?> calculateMonthlySalary(@RequestBody CalculateMonthlyPayrollRequest calculateMonthlyPayrollRequest) {
        try {
            List<Payroll> payrolls = payrollService.calculateMonthlySalary(calculateMonthlyPayrollRequest.getSelectedDate());
            for(Payroll p : payrolls){
                System.out.println("Staff:"+ p.getStaff().getFirstName());
                System.out.println("Amount:"+ p.getAmount());
                System.out.println("Date:" + p.getPaymentDateTime());
            }

            return new ResponseEntity<>(payrolls, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
