export default class StaffCreateRequest {
  staff;
  role;
  department;
  staffAddress;

  constructor(staff, role, department, staffAddress) {
    this.staff = staff;
    this.role = role;
    this.department = department;
    this.staffAddress = staffAddress;
  }
}
