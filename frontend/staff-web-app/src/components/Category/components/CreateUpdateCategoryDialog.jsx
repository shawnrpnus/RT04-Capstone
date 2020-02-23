import React, { Component } from "react";
import * as PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "reactstrap";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import {
  Category,
  CreateCategoryRequest
} from "../../../models/category/CreateCategoryRequest";
import { createCategory } from "../../../redux/actions/categoryActions";
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
    console.log(this.props);
    // fill in name only if is updating a current category,
    // otherwise the category passed in as props is meant to be the parent i.e. mode == "createChild"
    const propsCatName =
      props.mode === "update" ? selectedCategory.categoryName : null;
    this.state = {
      categoryId: selectedCategory ? selectedCategory.categoryId : null,
      categoryName: propsCatName ? propsCatName : ""
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
      const createCategoryRequest = new CreateCategoryRequest(category, null);
    } else if (this.props.mode === "createChild") {
      const createCategoryRequest = new CreateCategoryRequest(
        category,
        this.state.categoryId
      );
      this.props.createCategory(createCategoryRequest);
      this.props.closeDialog();
    } else if (this.props.mode === "update") {
      category.categoryId = this.state.categoryId;
      // TODO: make update request
    }
  };

  render() {
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
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors
});

const mapDispatchToProps = {
  clearErrors,
  createCategory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUpdateCategoryDialog);
