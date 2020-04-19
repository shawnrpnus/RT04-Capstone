class CompletedRefundConfirmation {
  refundNumber;
  name;
  email;
  totalAmount;

  constructor(refundNumber, name, email, totalAmount) {
    this.refundNumber = refundNumber;
    this.name = name;
    this.email = email;
    this.totalAmount = totalAmount;
  }
}

export default CompletedRefundConfirmation;
