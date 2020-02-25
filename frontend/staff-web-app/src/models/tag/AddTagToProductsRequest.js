export default class AddTagToProductsRequest {
  tagId;
  products;

  constructor(tagId, products) {
    this.tagId = tagId;
    this.products = products;
  }
}
