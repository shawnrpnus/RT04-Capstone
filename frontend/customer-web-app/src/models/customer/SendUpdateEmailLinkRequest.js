export default class SendUpdateEmailLinkRequest {
  customerId;
  newEmail;

  constructor(customerId, newEmail) {
    this.customerId = customerId;
    this.newEmail = newEmail;
  }
}
