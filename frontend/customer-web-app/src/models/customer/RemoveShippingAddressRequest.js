export default class RemoveShippingAddressRequest {
  customerId;
  shippingAddressId;

  constructor(customerId, shippingAddressId) {
    this.customerId = customerId;
    this.shippingAddressId = shippingAddressId;
  }
}
