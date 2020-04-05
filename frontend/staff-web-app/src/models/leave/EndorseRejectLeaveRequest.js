export default class EndorseRejectLeaveRequest {
    leaveId;
    managerId;
    action;

    constructor(leaveId, managerId, action ) {
        this.leaveId = leaveId;
        this.managerId = managerId;
        this.action = action;
    }
}
