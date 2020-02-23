import React, { Component } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import {
  retrieveAllCategories,
  deleteCategory,
  createCategory
} from "../../../redux/actions/categoryActions";
import { retrieveAllProducts } from "../../../redux/actions/productActions";
import { Tree } from "primereact/tree";
import {
  getParentKeys,
  buildCategoryTree,
  getCategoryInfoFromTree
} from "../../../services/categoryService";
import { Grid } from "@material-ui/core";
import { ProductsTableRaw } from "../../Product/ProductsList/components/ProductsTable";
import { ContextMenu } from "primereact/contextmenu";
import CreateUpdateCategoryDialog from "./CreateUpdateCategoryDialog";
import { Button } from "reactstrap";

class CategoryTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategoryId: null,
      selectedNodeKey: null,
      dialogOpen: false,
      dialogMode: null
    };
  }

  componentDidMount() {
    this.props.retrieveAllCategories();
  }

  onSelectionChange = e => {
    this.setState({ selectedCategoryId: e.value });
    // TODO: Update store/warehouse ID from global state / local storage
    this.props.retrieveAllProducts(null, e.value);
  };

  onContextMenu = event => {
    //console.log(event);
    this.cm.show(event.originalEvent);
  };

  onContextMenuSelectionChange = event => {
    this.setState({ selectedNodeKey: event.value });
  };

  openDialog = mode => {
    this.setState({ dialogOpen: true, dialogMode: mode });
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const {
      allCategories,
      renderLoader,
      categoryProducts,
      deleteCategory
    } = this.props;
    const menu = [
      {
        label: "Add Child",
        command: () => this.openDialog("createChild")
      },
      {
        label: "Update",
        command: () => this.openDialog("update")
      },
      {
        label: "Delete",
        command: () => deleteCategory(this.state.selectedNodeKey)
      }
    ];

    let selectedDialogCategory;
    if (allCategories && this.state.selectedNodeKey) {
      selectedDialogCategory = getCategoryInfoFromTree(
        this.state.selectedNodeKey,
        allCategories
      );
    }

    return (
      <React.Fragment>
        <div className="card__title">
          <h5 className="bold-text">All Categories</h5>
        </div>
        {allCategories !== null ? (
          <React.Fragment>
            {this.state.selectedNodeKey && this.state.dialogMode ? (
              <CreateUpdateCategoryDialog
                open={this.state.dialogOpen}
                closeDialog={this.closeDialog}
                mode={this.state.dialogMode}
                selectedCategory={selectedDialogCategory}
                key={`${this.state.dialogMode}-${selectedDialogCategory.categoryName}-${selectedDialogCategory.categoryId}`}
              />
            ) : null}
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <h6 style={{ marginBottom: "5px" }}>
                  Left click to view products <br />
                  Right click for more options
                </h6>
                <ContextMenu
                  appendTo={document.body}
                  model={menu}
                  ref={el => (this.cm = el)}
                />
                <Tree
                  value={buildCategoryTree(allCategories)}
                  selectionMode="single"
                  propagateSelectionUp={false}
                  propagateSelectionDown={false}
                  expandedKeys={getParentKeys(allCategories, {})}
                  selectionKeys={this.state.selectedCategoryId}
                  onSelectionChange={this.onSelectionChange}
                  filter={true}
                  style={{ width: "100%" }}
                  onContextMenu={this.onContextMenu}
                  onContextMenuSelectionChange={
                    this.onContextMenuSelectionChange
                  }
                />
              </Grid>
              <Grid item xs={12} md={9}>
                {categoryProducts ? (
                  <ProductsTableRaw
                    products={categoryProducts}
                    renderLoader={renderLoader}
                  />
                ) : (
                  <ProductsTableRaw products={[]} renderLoader={renderLoader} />
                )}
              </Grid>
            </Grid>
          </React.Fragment>
        ) : (
          renderLoader()
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  allCategories: state.category.allCategories,
  categoryProducts: state.category.categoryProducts
});

const mapDispatchToProps = {
  retrieveAllCategories,
  retrieveAllProducts,
  deleteCategory,
  createCategory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(CategoryTree, "Category Management"));
