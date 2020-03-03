export default class StaffChangePasswordRequest {
    staffId;
    oldPassword;
    newPassword;

    constructor(staffId, oldPassword, newPassword) {
        this.staffId = staffId;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }
}
