import PromoCode from "../promoCode/promoCode";

class StaffLeave {
    fromDateTime;
    toDateTime;
    applicant;


    constructor(
        fromDateTime,
        toDateTime,
        applicant
    ) {
        this.fromDateTime = fromDateTime;
        this.toDateTime = toDateTime;
        this.applicant = applicant;
    }
}

export default StaffLeave;