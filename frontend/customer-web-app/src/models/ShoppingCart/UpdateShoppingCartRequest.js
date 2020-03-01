export default class UpdateShoppingCartRequest {
  quantity;
  productVariantId;
  customerId;
  cartType;

  constructor(quantity, productVariantId, customerId, cartType) {
    this.quantity = quantity;
    this.productVariantId = productVariantId;
    this.customerId = customerId;
    this.cartType = cartType;
  }
}
