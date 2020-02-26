export default class AddTagToProductsRequest {
  tagId;
  productIds;

  constructor(tagId, productIds) {
    this.tagId = tagId;
    this.productIds = productIds;
  }
}
