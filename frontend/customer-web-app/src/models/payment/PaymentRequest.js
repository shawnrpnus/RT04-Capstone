export default class PaymentRequest {
  constructor(
    customerId,
    paymentMethodId,
    totalAmount,
    storeId,
    deliveryAddress,
    billingAddress,
    storeToCollectId,
    promoCodeId,
    cardIssuer,
    cardLast4,
    collectionModeEnum
  ) {
    this.customerId = customerId;
    this.paymentMethodId = paymentMethodId;
    this.totalAmount = totalAmount;
    this.storeId = storeId;
    this.deliveryAddress = deliveryAddress;
    this.billingAddress = billingAddress;
    this.storeToCollectId = storeToCollectId;
    this.promoCodeId = promoCodeId;
    this.cardIssuer = cardIssuer;
    this.cardLast4 = cardLast4;
    this.collectionModeEnum = collectionModeEnum;
  }
}
