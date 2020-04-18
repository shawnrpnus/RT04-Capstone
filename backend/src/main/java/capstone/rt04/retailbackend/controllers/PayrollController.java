package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Payroll;
import capstone.rt04.retailbackend.entities.StaffLeave;
import capstone.rt04.retailbackend.request.payroll.CalculateMonthlyPayrollRequest;
import capstone.rt04.retailbackend.request.payroll.CreatePayrollsRequest;
import capstone.rt04.retailbackend.request.payroll.RetrievePayrollsForAMonthRequest;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.PayrollService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.payroll.PayrollCannotCreateException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

            return new ResponseEntity<>(payrolls, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(CREATE_PAYROLLS)
    public ResponseEntity<?> createPayrolls(@RequestBody CreatePayrollsRequest createPayrollsRequest) throws PayrollCannotCreateException {
            List<Payroll> payrolls = payrollService.createPayrolls(createPayrollsRequest.getSelectedDate());
            System.out.println(payrolls);
            return new ResponseEntity<>(payrolls, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_PAYROLLS)
    public ResponseEntity<?> retrieveAllPayrolls(@PathVariable Long staffId) {
        try {
            List<Payroll> payrolls = payrollService.retrieveAllPayrolls(staffId);
            return new ResponseEntity<>(payrolls, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(RETRIEVE_PAYROLLS_FOR_A_MONTH)
    public ResponseEntity<?> retrievePayrollsForAMonth(@RequestBody RetrievePayrollsForAMonthRequest retrievePayrollsForAMonthRequest) {
        try {
            List<Payroll> payrolls = payrollService.retrievePayrollsForAMonth(retrievePayrollsForAMonthRequest.getSelectedDate());
            return new ResponseEntity<>(payrolls, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(UPDATE_PAYROLL_STATUS)
    public ResponseEntity<?> updatePayrollStatus(@PathVariable Long payrollId) {
        try {
            Payroll payroll = payrollService.updateStatus(payrollId);
            return new ResponseEntity<>(payroll, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
