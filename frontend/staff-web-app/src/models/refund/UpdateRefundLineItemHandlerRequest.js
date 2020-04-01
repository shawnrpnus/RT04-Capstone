class UpdateRefundLineItemHandlerRequest {
  refundLineItemId;
  refundProgressEnum;
  staffId;
  quantityConfirmedRefunded

  constructor(refundLineItemId, refundProgressEnum, staffId, quantityConfirmedRefunded) {
    this.refundLineItemId = refundLineItemId;
    this.refundProgressEnum = refundProgressEnum;
    this.staffId = staffId;
    this.quantityConfirmedRefunded = quantityConfirmedRefunded;
  }
}

export default UpdateRefundLineItemHandlerRequest;
