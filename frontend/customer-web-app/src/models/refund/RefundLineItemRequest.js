class RefundLineItemRequest {
  transactionLineItemId;
  quantityToRefund;
  staffId;

  constructor(transactionLineItemId, quantityToRefund, staffId) {
    this.transactionLineItemId = transactionLineItemId;
    this.quantityToRefund = quantityToRefund;
    this.staffId = staffId;
  }
}

export default RefundLineItemRequest;
