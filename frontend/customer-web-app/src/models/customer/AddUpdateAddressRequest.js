export default class AddUpdateAddressRequest {
  customerId;
  shippingAddress;

  constructor(customerId, shippingAddress) {
    this.customerId = customerId;
    this.shippingAddress = shippingAddress;
  }
}
