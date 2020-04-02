import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "moment";
import { connect } from "react-redux";

import { clearErrors } from "../../../redux/actions";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { Grid, MenuItem, Select } from "@material-ui/core";
import { Button, ButtonToolbar } from "reactstrap";
import MomentUtils from "@date-io/moment";

class StyleForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    errors: PropTypes.object,
    clearErrors: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this.state = {
      styleName: ""
    };
  }

  onChange = e => {
    this.setState({ styleName: e.target.value }); 
    if (Object.keys(this.props.errors).length !== 0) this.props.clearErrors();
  };

  clear = () => {
    this.setState({ styleName: "" });
  };

  render() {
    const { handleSubmit, errors } = this.props;
    const hasErrors = Object.keys(this.props.errors).length !== 0;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <form className="material-form">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MaterialTextField
                fieldLabel="Style Name"
                onChange={this.onChange}
                state={this.state}
                fieldName="styleName"
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
                <Button type="button" onClick={this.clear}>
                  Clear
                </Button>
              </ButtonToolbar>
            </Grid>
          </Grid>
        </form>
      </MuiPickersUtilsProvider>
    );
  }
}
export default StyleForm;
