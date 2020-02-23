import React, { Component } from "react";
import * as PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import MaterialObjectSelect from "../../../shared/components/Form/MaterialObjectSelect";
import {
  Category,
  CreateUpdateCategoryRequest
} from "../../../models/category/CreateUpdateCategoryRequest";
import {
  createCategory,
  retrieveAllCategories,
  updateCategory
} from "../../../redux/actions/categoryActions";
import { clearErrors } from "../../../redux/actions";
import { connect } from "react-redux";

class CreateUpdateCategoryDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    dialogMode: PropTypes.string
  };
  constructor(props) {
    super(props);

    const { selectedCategory } = this.props;
    console.log(selectedCategory);
    // fill in name only if is updating a current category,
    // otherwise the category passed in as props is meant to be the parent i.e. mode == "createChild"
    const propsCatName =
      props.mode === "update" ? selectedCategory.categoryName : null;
    this.state = {
      categoryId: selectedCategory ? selectedCategory.categoryId : null,
      categoryName: propsCatName ? propsCatName : "",
      parentCategoryId: selectedCategory
        ? selectedCategory.parentCategory.categoryId
        : null
    };
  }

  onChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  handleSubmit = () => {
    const category = new Category(this.state.categoryName);
    if (this.props.mode === "createRoot") {
      const createCategoryRequest = new CreateUpdateCategoryRequest(
        category,
        null
      );
      this.props.createCategory(createCategoryRequest, this.props.closeDialog);
    } else if (this.props.mode === "createChild") {
      const createCategoryRequest = new CreateUpdateCategoryRequest(
        category,
        this.state.categoryId
      );
      this.props.createCategory(createCategoryRequest, this.props.closeDialog);
    } else if (this.props.mode === "update") {
      category.categoryId = this.state.categoryId;
      const updateCategoryRequest = new CreateUpdateCategoryRequest(
        category,
        this.state.parentCategoryId
      );
      this.props.updateCategory(updateCategoryRequest, this.props.closeDialog);
      // TODO: allow shifting of categories for update
    }
  };

  render() {
    console.log(this.state);
    const { open, closeDialog, errors, mode } = this.props;
    const dialogTitle =
      mode === "createRoot"
        ? "Create Root Category"
        : mode === "createChild"
        ? "Create Child Category"
        : mode === "update"
        ? "Update Category"
        : "";
    return (
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <form className="material-form">
            {mode === "update" ? (
              <MaterialObjectSelect
                fieldName="parentCategoryId"
                fieldLabel="Updated Parent Category"
                onChange={this.onChange}
                state={this.state}
                objects={this.props.allCategories.filter(
                  c => c.categoryId !== this.state.categoryId
                )}
                objectFieldForValue="categoryId"
                objectFieldForKey="categoryId"
                objectFieldToDisplay="categoryName"
              />
            ) : null}
            <MaterialTextField
              fieldLabel="Category Name"
              onChange={this.onChange}
              fieldName="categoryName"
              state={this.state}
              errors={errors}
              autoFocus={true}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSubmit} color="primary">
            Submit
          </Button>
          <Button onClick={closeDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  allCategories: state.category.allCategories
});

const mapDispatchToProps = {
  clearErrors,
  createCategory,
  updateCategory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUpdateCategoryDialog);
