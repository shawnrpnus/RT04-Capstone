class RefundRequest {
  refundMode;
  reason;
  refundLineItemRequests;
  customerId;
  storeId;

  constructor(refundMode, reason, refundLineItemRequests, customerId, storeId) {
    this.refundMode = refundMode;
    this.reason = reason;
    this.refundLineItemRequests = refundLineItemRequests;
    this.customerId = customerId;
    this.storeId = storeId;
  }
}

export default RefundRequest;
