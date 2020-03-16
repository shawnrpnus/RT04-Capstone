class staffUpdate {
    staffId;
    firstName;
    lastName;
    leaveRemaining;
    nric;
    email;
    salary;

    constructor(staffId, firstName, lastName, leaveRemaining, nric, email, salary) {
        this.staffId = staffId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.leaveRemaining = leaveRemaining;
        this.nric = nric;
        this.email = email;
        this.salary = salary;
    }
}

export default staffUpdate;
