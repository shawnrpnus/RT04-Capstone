import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "reactstrap";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";

class CreateUpdateCategoryDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryName: ""
    };
  }

  onChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
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
          <MaterialTextField
            fieldLabel="Category Name"
            onChange={this.onChange}
            fieldName="name"
            state={this.state}
            errors={errors}
            autoFocus={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
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

export default CreateUpdateCategoryDialog;
