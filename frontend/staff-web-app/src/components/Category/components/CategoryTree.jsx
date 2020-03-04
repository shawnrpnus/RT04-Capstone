import React, { Component } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import {
  retrieveAllRootCategories,
  deleteCategory,
  createCategory,
  retrieveAllCategories
} from "../../../redux/actions/categoryActions";
import { retrieveProductsDetails } from "../../../redux/actions/productActions";
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
import { Button, ButtonToolbar } from "reactstrap";
import { clearErrors } from "../../../redux/actions";

class CategoryTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategoryId: null,
      selectedNodeKey: null,
      dialogOpen: false,
      dialogMode: null //can be createRoot, createChild, update
    };
  }

  componentDidMount() {
    this.props.retrieveAllRootCategories();
    this.props.retrieveAllCategories();
  }

  onSelectionChange = e => {
    this.setState({ selectedCategoryId: e.value });
    // TODO: Update store/warehouse ID from global state / local storage
    this.props.retrieveProductsDetails(null, e.value);
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
    this.props.clearErrors();
  };

  render() {
    const {
      allRootCategories,
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
    if (
      allRootCategories &&
      this.state.selectedNodeKey &&
      this.state.dialogMode &&
      this.state.dialogMode !== "createRoot"
    ) {
      selectedDialogCategory = getCategoryInfoFromTree(
        this.state.selectedNodeKey,
        allRootCategories
      );
    }

    return (
      <React.Fragment>
        <div className="card__title">
          <h5 className="bold-text">All Categories</h5>
        </div>
        {allRootCategories !== null ? (
          <React.Fragment>
            {this.state.selectedNodeKey &&
            this.state.dialogOpen &&
            selectedDialogCategory ? (
              <CreateUpdateCategoryDialog
                open={this.state.dialogOpen}
                closeDialog={this.closeDialog}
                mode={this.state.dialogMode}
                selectedCategory={selectedDialogCategory}
                key={`${this.state.dialogMode}-${selectedDialogCategory.categoryName}-${selectedDialogCategory.categoryId}`}
              />
            ) : this.state.dialogOpen ? (
              <CreateUpdateCategoryDialog
                open={this.state.dialogOpen}
                closeDialog={this.closeDialog}
                mode={this.state.dialogMode}
                key={`${this.state.dialogMode}`}
              />
            ) : null}
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <ul style={{ marginBottom: "5px" }}>
                  <li>
                    <h6>
                      <b>Left click</b> to view products
                    </h6>
                  </li>
                  <li>
                    <h6>
                      <b>Right click</b> for more options
                    </h6>
                  </li>
                </ul>
                <Button
                  size="sm"
                  style={{ width: "100%", marginBottom: "5px" }}
                  onClick={() => this.openDialog("createRoot")}
                  color="primary"
                >
                  Create Root Category
                </Button>
                <ContextMenu
                  appendTo={document.body}
                  model={menu}
                  ref={el => (this.cm = el)}
                />
                <Tree
                  value={buildCategoryTree(allRootCategories)}
                  selectionMode="single"
                  propagateSelectionUp={false}
                  propagateSelectionDown={false}
                  expandedKeys={getParentKeys(allRootCategories, {})}
                  selectionKeys={this.state.selectedCategoryId}
                  onSelectionChange={this.onSelectionChange}
                  filter={true}
                  style={{ width: "100%" }}
                  onContextMenu={this.onContextMenu}
                  onContextMenuSelectionChange={
                    this.onContextMenuSelectionChange
                  }
                  key={Object.keys(getParentKeys(allRootCategories, {})).length}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                {categoryProducts ? (
                  <ProductsTableRaw
                    products={categoryProducts}
                    renderLoader={renderLoader}
                    {...this.props}
                  />
                ) : (
                  <ProductsTableRaw
                    products={[]}
                    renderLoader={renderLoader}
                    {...this.props}
                  />
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
  allRootCategories: state.category.allRootCategories,
  categoryProducts: state.category.categoryProducts
});

const mapDispatchToProps = {
  retrieveAllRootCategories,
  retrieveAllCategories,
  retrieveProductsDetails,
  deleteCategory,
  createCategory,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(CategoryTree, "Category Management"));
