import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "moment";
import { connect } from "react-redux";

import { clearErrors } from "../../../redux/actions";
import { createNewTag } from "../../../redux/actions/tagAction";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { Grid, MenuItem, Select } from "@material-ui/core";
import { Button, ButtonToolbar } from "reactstrap";
import MomentUtils from "@date-io/moment";
import CreateUpdateTagRequest from "../../../models/CreateUpdateTagRequest";

class TagForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    errors: PropTypes.object,
    clearErrors: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    currentTag: PropTypes.object
  };
  constructor(props) {
    super(props);
    const { currentTag } = this.props;
    this.state = {
      name: "",
      customErrors: {}
    };
  }

  onChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) this.props.clearErrors();
    if (Object.keys(this.state.customErrors).length !== 0) {
      this.setState({ customErrors: {} });
    }
  };

  render() {
    const { handleSubmit, errors, currentTag } = this.props;
    const hasErrors =
      Object.keys(this.props.errors).length !== 0 ||
      Object.keys(this.state.customErrors).length !== 0;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <form className="material-form" >
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <MaterialTextField
                fieldLabel="Tag Name"
                onChange={this.onChange}
                state={this.state}
                fieldName="name"
                errors={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <ButtonToolbar className="form__button-toolbar">
                <Button
                  color="primary"
                  onClick={e => handleSubmit(e, this.state)}
                  disabled={hasErrors}
                >
                  Submit
                </Button>
                <Button type="button">Cancel</Button>
              </ButtonToolbar>
            </Grid>
          </Grid>
        </form>
      </MuiPickersUtilsProvider>
    );
  }
}
export default TagForm;
