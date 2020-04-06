class GenerateRefundLabel {
  deliveryAddress;
  name;
  refundNumber;
  refundId;
  email;
  orderNumber;

  constructor(deliveryAddress, name, refundNumber, refundId, email, orderNumber) {
    this.deliveryAddress = deliveryAddress;
    this.name = name;
    this.refundNumber = refundNumber;
    this.refundId = refundId;
    this.email = email;
    this.orderNumber = orderNumber;
  }
}

export default GenerateRefundLabel;
