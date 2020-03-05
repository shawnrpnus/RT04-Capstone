export default class AddEditReviewRequest {
  review;
  productId;
  customerId;

  constructor(review, productId, customerId) {
    this.review = review;
    this.productId = productId;
    this.customerId = customerId;
  }
}
