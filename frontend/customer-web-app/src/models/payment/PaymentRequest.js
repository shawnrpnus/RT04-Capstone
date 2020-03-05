export default class PaymentRequest {
  customerId;
  paymentMethodId;
  totalAmount;
  shoppingCartId;
  deliveryAddress;
  billingAddress;

  constructor(
    customerId,
    paymentMethodId,
    totalAmount,
    shoppingCartId,
    deliveryAddress,
    billingAddress
  ) {
    this.customerId = customerId;
    this.paymentMethodId = paymentMethodId;
    this.totalAmount = totalAmount;
    this.shoppingCartId = shoppingCartId;
    this.deliveryAddress = deliveryAddress;
    this.billingAddress = billingAddress;
  }
}
