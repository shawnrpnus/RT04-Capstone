export default class PaymentRequest {
  constructor(
    customerId,
    paymentMethodId,
    totalAmount,
    storeId,
    deliveryAddress,
    billingAddress,
    storeToCollectId,
    promoCodeId
  ) {
    this.customerId = customerId;
    this.paymentMethodId = paymentMethodId;
    this.totalAmount = totalAmount;
    this.storeId = storeId;
    this.deliveryAddress = deliveryAddress;
    this.billingAddress = billingAddress;
    this.storeToCollectId = storeToCollectId;
    this.promoCodeId = promoCodeId;
  }
}
