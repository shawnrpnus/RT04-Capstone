export default class ApproveRejectLeaveRequest {
    leaveId;
    hrId;
    action;

    constructor(leaveId, hrId, action ) {
        this.leaveId = leaveId;
        this.hrId = hrId;
        this.action = action;
    }
}
