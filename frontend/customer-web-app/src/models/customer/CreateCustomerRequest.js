export default class CreateCustomerRequest {
  firstName;
  lastName;
  email;
  password;

  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}
