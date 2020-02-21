import React, { Component } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { retrieveAllCategories } from "../../../redux/actions/categoryActions";
import { Tree } from "primereact/tree";

class CategoryTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategoryId: null
    };
  }

  componentDidMount() {
    this.props.retrieveAllCategories();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log(nextProps);
  }

  onSelectionChange = e => {
    this.setState({ selectedCategoryId: e.value });
    console.log(this.state);
  };

  render() {
    const { allCategories } = this.props;
    if (allCategories !== null) {
      console.log(allCategories[0].childCategories);
      console.log(sumChildrenProducts(allCategories[0]));
    }
    return (
      <React.Fragment>
        <div className="card__title">
          <h5 className="bold-text">All Categories</h5>
        </div>
        {allCategories !== null ? (
          <Tree
            value={buildCategoryTree(allCategories)}
            selectionMode="checkbox"
            propagateSelectionUp={false}
            propagateSelectionDown={false}
            expandedKeys={getParentKeys(allCategories, {})}
            selectionKeys={this.state.selectedCategoryId}
            onSelectionChange={this.onSelectionChange}
            filter={true}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  allCategories: state.category.allCategories
});

const mapDispatchToProps = {
  retrieveAllCategories
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(CategoryTree, "Category Management"));

const buildCategoryTree = categories => {
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

const getParentKeys = (categories, obj) => {
  const parentKeys = obj;
  for (let index = 0; index < categories.length; index++) {
    if (categories[index].childCategories.length > 0)
      parentKeys[categories[index].categoryId] = true;
    getParentKeys(categories[index].childCategories, parentKeys);
  }
  return parentKeys;
};
