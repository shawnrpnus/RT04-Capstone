package capstone.rt04.retailbackend.util.routeconstants;

public class PayrollControllerRoutes {
    public static final String PAYROLL_BASE_ROUTE = "/api/payroll";
    public static final String CALCULATE_MONTHLY_SALARY= "/calculateMonthlySalary";
    public static final String CREATE_PAYROLLS = "/createPayrolls";
    public static final String RETRIEVE_PAYROLLS_FOR_A_MONTH = "/retrievePayrollsForAMonth";
    public static final String RETRIEVE_ALL_PAYROLLS = "/retrieveAllPayrolls/{staffId}";
    public static final String UPDATE_PAYROLL_STATUS= "/updatePayrollStatus/{payrollId}";
}
