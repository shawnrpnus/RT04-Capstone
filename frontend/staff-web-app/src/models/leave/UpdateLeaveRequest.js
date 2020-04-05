export default class UpdateLeaveRequest {
    leaveId;
    applicant;
    fromDateTime;
    toDateTime;

    constructor(leaveId, applicant, fromDateTime, toDateTime) {
        this.leaveId = leaveId;
        this.applicant = applicant;
        this.fromDateTime = fromDateTime;
        this.toDateTime = toDateTime;
    }
}