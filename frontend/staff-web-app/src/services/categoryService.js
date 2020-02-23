export const buildCategoryTree = categories => {
  return categories.map(parentCategory => {
    if (parentCategory !== null) {
      let hasChildren = parentCategory.childCategories.length > 0;
      let numProducts = hasChildren
        ? sumChildrenProducts(parentCategory, 0)
        : parentCategory.products.length;
      return {
        key: parentCategory.categoryId,
        label: hasChildren
          ? `${parentCategory.name} (${numProducts})`
          : `${parentCategory.name} (${numProducts})`,
        selectable: true,
        children:
          parentCategory.childCategories.length > 0
            ? buildCategoryTree(parentCategory.childCategories)
            : null
      };
    }
  });
};

const sumChildrenProducts = category => {
  let sum = 0;
  category.childCategories.forEach(child => {
    sum += child.products.length;
    sum += sumChildrenProducts(child, sum);
  });
  return sum;
};

export const getParentKeys = (categories, obj) => {
  const parentKeys = obj;
  for (let index = 0; index < categories.length; index++) {
    if (categories[index].childCategories.length > 0)
      parentKeys[categories[index].categoryId] = true;
    getParentKeys(categories[index].childCategories, parentKeys);
  }
  return parentKeys;
};
