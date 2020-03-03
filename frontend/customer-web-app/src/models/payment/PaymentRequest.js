export default class PaymentRequest {
  customerId;
  paymentMethodId;
  totalAmount;
  shoppingCartId;

  constructor(customerId, paymentMethodId, totalAmount, shoppingCartId) {
    this.customerId = customerId;
    this.paymentMethodId = paymentMethodId;
    this.totalAmount = totalAmount;
    this.shoppingCartId = shoppingCartId;
  }
}
