export default class StaffCreateRequest {
  staff;
  staffAddress;
  roleId;
  departmentId;
  storeId;

  constructor(staff, roleId, departmentId, staffAddress, storeId) {
    this.staff = staff;
    this.staffAddress = staffAddress;
    this.roleId = roleId;
    this.departmentId = departmentId;
    this.storeId = storeId;
  }
}
