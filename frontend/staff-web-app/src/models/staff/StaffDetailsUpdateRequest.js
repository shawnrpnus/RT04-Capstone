export default class StaffDetailsUpdateRequest {
    staff;
    address;
    roleId;
    departmentId;
    storeId;

    constructor(staff, roleId, departmentId, address, storeId) {
        this.staff = staff;
        this.address = address;
        this.roleId = roleId;
        this.departmentId = departmentId;
        this.storeId = storeId;
    }
}
