export default class DeleteStyleFromProductsRequest {
  styleId;
  productIds;

  constructor(styleId, productIds) {
    this.styleId = styleId;
    this.productIds = productIds;
  }
}
