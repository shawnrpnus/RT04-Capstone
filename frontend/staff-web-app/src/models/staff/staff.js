class Staff {
  firstName;
  lastName;
  leaveRemaining;
  nric;
  email;
  salary;

  constructor(firstName, lastName, leaveRemaining, nric, email, salary) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.leaveRemaining = leaveRemaining;
    this.nric = nric;
    this.email = email;
    this.salary = salary;
  }
}

export default Staff;
