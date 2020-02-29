export default class UpdateProductStockRequest {
  quantity;
  productStockId;
  constructor(productStockId, quantity) {
    this.productStockId = productStockId;
    this.quantity = quantity;
  }
}
