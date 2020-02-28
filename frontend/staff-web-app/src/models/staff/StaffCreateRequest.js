export default class StaffCreateRequest {
  staff;
  staffAddress;
  roleId;
  departmentId;

  constructor(staff, roleId, departmentId, staffAddress) {
    this.staff = staff;
    this.staffAddress = staffAddress;
    this.roleId = roleId;
    this.departmentId = departmentId;
  }
}
