class staffUpdate {
  staffId;
  firstName;
  lastName;
  nric;
  email;
  salary;

  constructor(
    staffId,
    firstName,
    lastName,
    nric,
    email,
    salary
  ) {
    this.staffId = staffId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nric = nric;
    this.email = email;
    this.salary = salary;
  }
}

export default staffUpdate;
