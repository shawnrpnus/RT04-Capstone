export default class CreateCustomerRequest {
  customerId;
  shippingAddress;

  constructor(customerId, shippingAddress) {
    this.customerId = customerId;
    this.shippingAddress = shippingAddress;
  }
}
