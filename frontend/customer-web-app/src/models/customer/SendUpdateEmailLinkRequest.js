export default class SendUpdateEmailLinkRequest {
  customerId;
  email;

  constructor(customerId, email) {
    this.customerId = customerId;
    this.email = email;
  }
}
