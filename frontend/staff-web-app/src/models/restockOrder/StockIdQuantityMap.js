export default class StockIdQuantityMap {
  orderQuantity;
  productStockId;
  constructor(productStockId, orderQuantity) {
    this.productStockId = productStockId;
    this.orderQuantity = orderQuantity;
  }
}
