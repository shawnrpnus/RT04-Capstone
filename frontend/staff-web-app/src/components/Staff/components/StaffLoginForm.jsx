import React, { Component } from "react";
import PropTypes from "prop-types";
import { staffLogin } from "../../../redux/actions/staffActions";
import { connect } from "react-redux";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Button } from "reactstrap";
import {clearErrors, updateErrors} from "../../../redux/actions";

const _ = require("lodash");



class StaffLoginForm extends Component {
  static propTypes = {
    errors: PropTypes.object,
    clearErrors: PropTypes.func,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showPassword: false
    };
  }
  onChange = e => {
    const name = e.target.name;
    console.log(e);
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  showPassword(e) {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  }

  handleSubmit = e => {
    e.preventDefault();

    const req = new StaffLoginRequest(this.state.username, this.state.password);
    this.props.staffLogin(req, this.props.history);
  };

  render() {
    const { errors, disabled } = this.props;
    const { showPassword } = this.state;
    const hasErrors = Object.keys(this.props.errors).length !== 0;

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="account__card">
          <div className="account__head">
            <h3 className="account__title">Welcome back</h3>
            <h4 className="account__subhead subhead">Login to get started</h4>
          </div>

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

            <div className="form__form-group">
              <MaterialTextField
                fieldLabel="Password"
                onChange={this.onChange}
                fieldName="password"
                state={this.state}
                errors={errors}
                disabled={disabled}
                autoFocus={true}
              />

              <div className="account__forgot-password">
                <a href="/">Forgot your password?</a>
              </div>
            </div>
            <div className="form__form-group">
              <Button
                className="account__btn"
                onClick={e => this.handleSubmit(e)}
                color="primary"
                disabled={hasErrors}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  loggedInStaff: state.staffEntity.loggedInStaff,
  errors: state.errors
});

const mapDispatchToProps = {
  staffLogin,
  clearErrors,
  updateErrors
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffLoginForm);
