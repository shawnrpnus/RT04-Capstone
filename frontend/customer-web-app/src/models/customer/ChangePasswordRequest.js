export default class ChangePasswordRequest {
  customerId;
  oldPassword;
  newPassword;

  constructor(customerId, oldPassword, newPassword) {
    this.customerId = customerId;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}
