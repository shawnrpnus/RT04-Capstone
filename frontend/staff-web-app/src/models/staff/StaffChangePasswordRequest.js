export default class StaffChangePasswordRequest {
  staffId;
  oldPassword;
  newPassword;
  confirmPassword;

  constructor(staffId, oldPassword, newPassword, confirmPassword) {
    this.staffId = staffId;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }
}
