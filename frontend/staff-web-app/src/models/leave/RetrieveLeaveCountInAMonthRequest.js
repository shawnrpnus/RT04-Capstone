export default class RetrieveLeaveCountInAMonthRequest {
    selectedDate;
    staffId;

    constructor(selectedDate, staffId) {
        this.selectedDate = selectedDate;
        this.staffId = staffId;
    }
}
