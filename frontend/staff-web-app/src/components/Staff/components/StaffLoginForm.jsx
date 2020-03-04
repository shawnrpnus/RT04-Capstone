import React, { Component } from "react";
import PropTypes, {object} from "prop-types";
import {staffLogin} from "../../../redux/actions/staffActions";
import { connect } from "react-redux";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Button } from "reactstrap";
import { clearErrors, updateErrors } from "../../../redux/actions";
import StaffLoginRequest from "../../../models/staff/StaffLoginRequest";
import Link from "@material-ui/core/Link";
import {retrieveAllStores, retrieveStoreById} from "../../../redux/actions/storeActions";
import {Grid, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
      showPassword: false,
      storeId: ""
    };
  }

  componentDidMount() {
    this.props.retrieveAllStores();
  }

  onChange = e => {
    const name = e.target.name;
    console.log(e);
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  onClick = e => {
    this.props.history.push(`/resetPassword`);
  };

  onSelectStore = (event, selectedStore) => {
    if (selectedStore === null) return;
    console.log(selectedStore.storeId);
    this.setState({ storeId: selectedStore.storeId });
  };

  showPassword(e) {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  }

  handleSubmit = e => {
    e.preventDefault();

    const req = new StaffLoginRequest(this.state.username, this.state.password);
    //retrieve selected store and save it in store
    this.props.retrieveStoreById(this.state.storeId, this.props.history);
    console.log(this.state.storeId);
    console.log(this.props.staffStore);
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

          <Grid container spacing={3}>

          <Grid item xs={12} md={6}>
            <Autocomplete
                id="tags-standard"
                options={this.props.allStores}
                getOptionLabel={option => option.storeName}
                onChange={(event, value) => this.onSelectStore(event, value)}
                getOptionSelected={(option, value) =>
                    option.storeId === value.storeId
                }
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Store"
                        fullWidth
                    />
                )}
                errors={errors}
            />
          </Grid>

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
                autoFocus={true}
              />

              <div className="account__forgot-password">
                <Link  href="#" onClick={this.onClick}>Forgot your password?</Link>

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
            </Grid>
          </Grid>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  staffStore: state.storeEntity.selectedStore,
  loggedInStaff: state.staffEntity.loggedInStaff,
  errors: state.errors,
  allStores: state.storeEntity.allStores
});

const mapDispatchToProps = {
  retrieveStoreById,
  retrieveAllStores,
  staffLogin,
  clearErrors,
  updateErrors

};

export default connect(mapStateToProps, mapDispatchToProps)(StaffLoginForm);
