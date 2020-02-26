export default class DeleteTagFromProductsRequest {
  tagId;
  productIds;

  constructor(tagId, productIds) {
    this.tagId = tagId;
    this.productIds = productIds;
  }
}
