export default class PaymentRequest {
  customerId;
  paymentMethodId;
  totalAmount;
  storeId;
  deliveryAddress;
  billingAddress;

  constructor(
    customerId,
    paymentMethodId,
    totalAmount,
    storeId,
    deliveryAddress,
    billingAddress
  ) {
    this.customerId = customerId;
    this.paymentMethodId = paymentMethodId;
    this.totalAmount = totalAmount;
    this.storeId = storeId;
    this.deliveryAddress = deliveryAddress;
    this.billingAddress = billingAddress;
  }
}
