package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Payroll;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.entities.StaffLeave;
import capstone.rt04.retailbackend.repositories.LeaveRepository;
import capstone.rt04.retailbackend.repositories.PayrollRepository;
import capstone.rt04.retailbackend.repositories.StaffRepository;
import capstone.rt04.retailbackend.util.enums.LeaveStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.payroll.PayrollCannotCreateException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Date;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.List;

@Service
@Transactional
public class PayrollService {
    private final ValidationService validationService;
    private final StaffService staffService;
    private final StaffRepository staffRepository;
    private final PayrollRepository payrollRepository;
    private final LeaveRepository leaveRepository;


    public PayrollService(ValidationService validationService, StaffService staffService, StaffRepository staffRepository, PayrollRepository payrollRepository, LeaveRepository leaveRepository) {
        this.validationService = validationService;
        this.staffService = staffService;
        this.staffRepository = staffRepository;
        this.payrollRepository = payrollRepository;
        this.leaveRepository = leaveRepository;
    }

    public List<Payroll> calculateMonthlySalary(LocalDate d){

        List<Staff> allStaff = staffRepository.findAll();
        List<Payroll> payrolls = new ArrayList<Payroll>();
        int year = d.getYear();
        int month = d.getMonthValue();

        for(Staff s : allStaff){
            //Get the number of days in the given month of a given year
            YearMonth yearMonthObject = YearMonth.of(year, month);
            int daysInMonth = yearMonthObject.lengthOfMonth();
            int count=0;

            //Get all the leaves of the staff
            List<StaffLeave> allLeaves = s.getLeaves();

            //For each approved leave, iterate through the leave period. If month and year corresponds with the current month and year, subtract 1 day from total number of days in month
            for(StaffLeave leave : allLeaves){
                if(leave.getStatus().equals(LeaveStatusEnum.APPROVED)) {

                    //iterate through each day of the leave period to check the month and year
                    for (LocalDate date = leave.getFromDateTime(); (date.isBefore(leave.getToDateTime()) || date.equals(leave.getToDateTime())); date = date.plusDays(1)) {
                        if(date.getMonthValue()== month && date.getYear() == year){
                            daysInMonth --;
                            count++;
                        }
                    }
                }
                }
            BigDecimal salaryPerDay = s.getSalary();
            BigDecimal finalMonthlyAmount = salaryPerDay.multiply(new BigDecimal(daysInMonth));
            LocalDate dd = d.of(year, month, 29);
            Payroll payroll = new Payroll(finalMonthlyAmount, s, dd, count);
            payrolls.add(payroll);
            }

        return payrolls;

        }

    public List<Payroll> createPayrolls(LocalDate d) throws PayrollCannotCreateException {
        List<Payroll> existingPayrolls = payrollRepository.findAll();
        int year = d.getYear();
        int month = d.getMonthValue();
        LocalDate dd = d.of(year, month, 29);
        for(Payroll e : existingPayrolls){
            if(e.getPaymentDateTime().equals(dd)){
                    throw new PayrollCannotCreateException("Payrolls for the month have already been created");
            }
        }

        List<Payroll> payrolls = calculateMonthlySalary(d);
        for(Payroll p : payrolls){
            payrollRepository.save(p);
        }
        return payrolls;

    }


    public List<Payroll> retrieveLeaveCountInAMonth(LocalDate d){
        List<Payroll> payrolls = new ArrayList<Payroll>();
        List<Payroll> existingPayrolls = payrollRepository.findAll();
        int year = d.getYear();
        int month = d.getMonthValue();
        for(Payroll e : existingPayrolls){
            if(e.getPaymentDateTime().getYear()== year && e.getPaymentDateTime().getMonthValue()==month){
                payrolls.add(e);
            }
        }
        return payrolls;

    }


    public List<Payroll> retrieveAllPayrolls(Long staffId) throws StaffNotFoundException {
        Staff existingStaff = staffRepository.findById(staffId)
                .orElseThrow(() -> new StaffNotFoundException("Staff with id: " + staffId + " does not exist"));
        List<Payroll> payrolls = new ArrayList<Payroll>();
        List<Payroll> existingPayrolls = payrollRepository.findAll();
        for(Payroll e : existingPayrolls){
            if(e.getStaff().equals(existingStaff)){
                payrolls.add(e);
            }
        }
        return payrolls;

    }
}