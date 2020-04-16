import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes, { object } from "prop-types";
import { staffLogin } from "../../../redux/actions/staffActions";
import { connect } from "react-redux";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Button } from "reactstrap";
import { clearErrors, updateErrors } from "../../../redux/actions";
import StaffLoginRequest from "../../../models/staff/StaffLoginRequest";
import { retrieveAllStores } from "../../../redux/actions/storeActions";
import Grid from "@material-ui/core/Grid";

const _ = require("lodash");

class StaffLoginForm extends Component {
  static propTypes = {
    errors: PropTypes.object,
    clearErrors: PropTypes.func,
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showPassword: false,
      store: {},
    };
  }

  onChange = (e) => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  onClick = (e) => {
    this.props.history.push(`/resetPassword`);
  };

  showPassword(e) {
    e.preventDefault();
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, store } = this.state;
    const req = new StaffLoginRequest(username, password);
    this.props.staffLogin(req, this.props.history, store);
  };

  render() {
    const { errors, disabled, allStores } = this.props;
    const { showPassword } = this.state;
    const hasErrors = Object.keys(this.props.errors).length !== 0;

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{ height: "100vh" }}
        >
          <div className="account__card">
            <div
              style={{
                width: "100%",
                marginBottom: "10%",
                textAlign: "center",
                transform: "scale(1.2)",
              }}
            >
              <img
                style={{ width: "auto" }}
                src="https://res.cloudinary.com/rt04capstone/image/upload/v1583433855/rsz_1apricot-nut-logo-word_jzhocy.png"
              />
            </div>

            <div className="account__head">
              <h3 className="account__title">Welcome back</h3>
              <h4 className="account__subhead subhead">Login to get started</h4>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
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
                      type="password"
                    />
                    {/*<div className="account__forgot-password">*/}
                    {/*  <Link to="/resetPassword">Forgot your password?</Link>*/}
                    {/*</div>*/}
                  </div>
                  <div className="form__form-group">
                    <Button
                      className="account__btn"
                      onClick={(e) => this.handleSubmit(e)}
                      color="primary"
                      disabled={hasErrors}
                      style={{ margin: "5% 0" }}
                    >
                      Sign In
                    </Button>
                  </div>
                </form>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
}

//mapping global state to this component
const mapStateToProps = (state) => ({
  staffStore: state.storeEntity.selectedStore,
  loggedInStaff: state.staffEntity.loggedInStaff,
  errors: state.errors,
  allStores: state.storeEntity.allStores,
});

const mapDispatchToProps = {
  retrieveAllStores,
  staffLogin,
  clearErrors,
  updateErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffLoginForm);
