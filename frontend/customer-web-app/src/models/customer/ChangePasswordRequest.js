export default class ChangePasswordRequest {
  customerId;
  oldPassword;
  newPassword;
  confirmNewPassword;

  constructor(customerId, oldPassword, newPassword, confirmNewPassword) {
    this.customerId = customerId;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.confirmNewPassword = confirmNewPassword;
  }
}
