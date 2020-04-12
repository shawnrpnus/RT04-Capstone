export default class ReassignStaffStoreRequest {
    storeId;
    staffIds;

    constructor(storeId, staffIds) {
        this.storeId = storeId;
        this.staffIds = staffIds;
    }
}
