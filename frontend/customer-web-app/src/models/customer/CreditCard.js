export default class CreditCard {
  last4;
  paymentMethodId;
  expiryMonth;
  expiryYear;
  defaultCard;

  constructor(last4, paymentMethodId, expiryMonth, expiryYear, defaultCard) {
    this.last4 = last4;
    this.paymentMethodId = paymentMethodId;
    this.expiryMonth = expiryMonth;
    this.expiryYear = expiryYear;
    this.defaultCard = defaultCard;
  }
}
