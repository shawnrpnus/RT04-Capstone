import React, { Component, PureComponent } from "react";
import { Field, reduxForm, Form } from "redux-form";
import { connect } from "react-redux";
import EyeIcon from "mdi-react/EyeIcon";
import KeyVariantIcon from "mdi-react/KeyVariantIcon";
import AccountOutlineIcon from "mdi-react/AccountOutlineIcon";
import { Link } from "react-router-dom";
import * as PropTypes from "prop-types";
import { Alert, Button } from "reactstrap";
import renderCheckBoxField from "../Form/CheckBox";
import axios from "axios";
import { staffLogin } from "../../../redux/actions/staffActions";
import StaffLoginRequest from "../../../models/staff/StaffLoginRequest";
import { clearErrors, updateErrors } from "../../../redux/actions";
import MaterialTextField from "../Form/MaterialTextField";
import TextField from "@material-ui/core/TextField";

class LogInForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    errorMsg: PropTypes.string,
    errors: PropTypes.object,
    fieldUser: PropTypes.string,
    typeFieldUser: PropTypes.string,
    form: PropTypes.string.isRequired,
  };

  static defaultProps = {
    errorMessage: "",
    errorMsg: "",
    fieldUser: "Username",
    typeFieldUser: "text",
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showPassword: false,
    };

    this.showPassword = this.showPassword.bind(this);
  }

  showPassword(e) {
    e.preventDefault();
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  }

  onChange = (e) => {
    const name = e.target.name;

    console.log(name);
    console.log(e.target.value);
    console.log(e);
    this.setState({ [name]: e.target.value }); //computed property name syntax
    console.log();
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const req = new StaffLoginRequest(this.state.username, this.state.password);
    this.props.staffLogin(req, this.props.history);
  };

  render() {
    const {
      handleSubmit,
      errorMessage,
      errorMsg,
      fieldUser,
      typeFieldUser,
      form,
    } = this.props;
    const { showPassword } = this.state;
    return (
      <Form className="form login-form" onSubmit={handleSubmit}>
        <Alert color="danger" isOpen={!!errorMessage || !!errorMsg}>
          {errorMessage}
          {errorMsg}
        </Alert>
        <div className="form__form-group">
          <span className="form__form-group-label">{fieldUser}</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div>
            <Field
              name="username"
              component="input"
              value={this.state.username}
              onChange={this.onChange}
              errors={this.props.errors}
              // type={typeFieldUser}
              placeholder="Username"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Password</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="password"
              component="input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <button
              type="button"
              className={`form__form-group-button${
                showPassword ? " active" : ""
              }`}
              onClick={(e) => this.showPassword(e)}
            >
              <EyeIcon />
            </button>
            <div className="account__forgot-password">
              <a href="/">Forgot a password?</a>
            </div>
          </div>
        </div>
        <div className="form__form-group">
          <div className="form__form-group form__form-group-field">
            <Field
              name={`remember_me-${form}`}
              component={renderCheckBoxField}
              label="Remember me"
            />
          </div>
        </div>
        <div className="account__btns">
          {form === "modal_login" ? (
            <Button className="account__btn" submit="true" color="primary">
              Sign In
            </Button>
          ) : (
            <Link className="account__btn btn btn-primary" to="/dashboard">
              Sign In
            </Link>
          )}
        </div>
      </Form>
    );
  }
}

//mapping global state to this component
const mapStateToProps = (state) => ({
  loggedInStaff: state.staffEntity.loggedInStaff,
  errors: state.errors,
});

const mapDispatchToProps = {
  staffLogin,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({ form: "login_form" })(LogInForm));
