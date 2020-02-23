export class CreateUpdateCategoryRequest {
  category;
  parentCategoryId;

  constructor(category, parentCategoryId) {
    this.category = category;
    this.parentCategoryId = parentCategoryId;
  }
}

export class Category {
  categoryName;

  constructor(categoryName) {
    this.categoryName = categoryName;
  }
}
