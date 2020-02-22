import React, { Component } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { retrieveAllCategories } from "../../../redux/actions/categoryActions";
import { retrieveAllProducts } from "../../../redux/actions/productActions";
import { Tree } from "primereact/tree";
import {
  getParentKeys,
  buildCategoryTree
} from "../../../services/categoryService";

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
    // TODO: Update store/warehouse ID from global state / local storage
    this.props.retrieveAllProducts(null, e.value);
  };

  render() {
    const { allCategories } = this.props;
    return (
      <React.Fragment>
        <div className="card__title">
          <h5 className="bold-text">All Categories</h5>
        </div>
        {allCategories !== null ? (
          <Tree
            value={buildCategoryTree(allCategories)}
            selectionMode="single"
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
  allCategories: state.category.allCategories,
  categoryProducts: state.category.categoryProducts
});

const mapDispatchToProps = {
  retrieveAllCategories,
  retrieveAllProducts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(CategoryTree, "Category Management"));
