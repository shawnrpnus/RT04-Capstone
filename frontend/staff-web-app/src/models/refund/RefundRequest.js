class RefundRequest {
  refundMode;
  reason;
  refundLineItemRequests;
  customerId;

  constructor(refundMode, reason, refundLineItemRequests, customerId) {
    this.refundMode = refundMode;
    this.reason = reason;
    this.refundLineItemRequests = refundLineItemRequests;
    this.customerId = customerId;
  }
}

export default RefundRequest;
