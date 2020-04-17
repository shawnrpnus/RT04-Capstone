
class Payroll {
    amount;
    paymentDateTime;
    staff;

    constructor(amount, paymentDateTime, staff) {
        this.amount = amount;
        this.paymentDateTime = paymentDateTime;
        this.staff = staff;
    }
}

export default Payroll;