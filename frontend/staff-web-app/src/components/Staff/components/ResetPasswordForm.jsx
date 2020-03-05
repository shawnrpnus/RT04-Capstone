import React, { Component, PureComponent } from "react";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { resetPassword } from "../../../redux/actions/staffActions";
import ResetStaffPasswordRequest from "../../../models/staff/ResetStaffPasswordRequest";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";

class ResetPasswordForm extends Component {
  static propTypes = {
    errors: PropTypes.object,
    clearErrors: PropTypes.func,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };
  }

  onChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  onCancel = () => {
    this.props.history.goBack();
  };

  handleSubmit = e => {
    e.preventDefault();

    const req = new ResetStaffPasswordRequest(this.state.username);

    this.props.resetPassword(req, this.props.history);
  };

  render() {
    //pulling out the fields from props
    const { errors, disabled } = this.props;

    const hasErrors = Object.keys(this.props.errors).length !== 0;

    return (
      <Grid
        container
        xs={12}
        alignItems="center"
        justify="center"
        style={{ height: "100vh" }}
      >
        <div className="account__card">
          <form className="material-form">
            <div className="form__form-group">
              <MaterialTextField
                fieldLabel="Username"
                onChange={this.onChange}
                fieldName="username"
                state={this.state}
                errors={errors}
                disabled={disabled}
                autoFocus={true}
              />
            </div>

            <ButtonToolbar className="form__button-toolbar">
              <Button
                color="primary"
                className="icon"
                onClick={e => this.handleSubmit(e)}
                disabled={hasErrors}
              >
                <p>
                  <ContentSaveIcon />
                  Submit
                </p>
              </Button>
              <Button type="button" className="icon" onClick={this.onCancel}>
                <p>
                  <CloseCircleIcon />
                  Cancel
                </p>
              </Button>
            </ButtonToolbar>
          </form>
        </div>
      </Grid>
    );
  }
}
//mapping global state to this component
const mapStateToProps = state => ({
  errors: state.errors
});

const mapDispatchToProps = {
  resetPassword,
  clearErrors,
  updateErrors
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm);
