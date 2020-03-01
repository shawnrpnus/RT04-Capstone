export default class ChangePasswordRequest {
  categoryId;
  tags;
  colours;
  sizes;
  minPrice;
  maxPrice;
  sortEnum;

  constructor(categoryId, tags, colours, sizes, minPrice, maxPrice, sortEnum) {
    this.categoryId = categoryId;
    this.tags = tags;
    this.colours = colours;
    this.sizes = sizes;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.sortEnum = sortEnum;
  }
}
