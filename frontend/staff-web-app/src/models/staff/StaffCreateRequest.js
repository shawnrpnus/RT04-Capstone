export default class StaffCreateRequest {
    newStaff;
    role;
    department;
    address;

    constructor(newStaff, role, department, address) {
        this.newStaff = newStaff;
        this.role = role;
        this.department = department;
        this.address = address;
    }


}
