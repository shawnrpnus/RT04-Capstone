export default class UpdateCustomerRequest {
  customerId;
  firstName;
  lastName;

  constructor(customerId, firstName, lastName) {
    this.customerId = customerId;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
