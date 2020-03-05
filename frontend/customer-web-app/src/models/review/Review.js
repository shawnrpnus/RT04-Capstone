export default class Review {
  reviewId;
  content;
  rating;

  constructor(reviewId, content, rating) {
    this.reviewId = reviewId;
    this.content = content;
    this.rating = rating;
  }
}
