import React, { Component, PureComponent } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import {
  createNewStaff,
  retrieveAllRoles,
  retrieveAllDepartments
} from "../../../redux/actions/staffActions";
import { retrieveAllStores } from "../../../redux/actions/storeActions";
import Address from "../../../models/address";
import Staff from "../../../models/staff/staff";
import StaffCreateRequest from "../../../models/staff/StaffCreateRequest";
import MomentUtils from "@date-io/moment";
import { Grid, TextField } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import axios from "axios";
import MaterialNumberSelect from "../../../shared/components/Form/MaterialNumberSelect";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";

class StaffCreateForm extends Component {
  static propTypes = {
    errors: PropTypes.object,
    clearErrors: PropTypes.func
  };

  componentDidMount() {
    this.props.retrieveAllRoles();
    this.props.retrieveAllDepartments();
    this.props.retrieveAllStores();
  }

  onSelectRole = (event, selectedRole) => {
    if (selectedRole === null) return;
    console.log(selectedRole.roleId);
    this.setState({ roleId: selectedRole.roleId });
  };

  onSelectDepartment = (event, selectedDepartment) => {
    if (selectedDepartment === null) return;
    console.log(selectedDepartment);
    this.setState({ departmentId: selectedDepartment.departmentId });
    if (
      selectedDepartment.departmentName === "Warehouse" ||
      selectedDepartment.departmentName === "Store"
    ) {
      this.setState({ displayStore: true });
    } else {
      this.setState({ displayStore: false });
      this.setState({ storeId: null });
    }
  };

  onSelectStore = (event, selectedStore) => {
    if (selectedStore === null) return;
    console.log(selectedStore);
    this.setState({ storeId: selectedStore.storeId });
  };

  constructor(props) {
    super(props);
    this.state = {
      staffId: undefined,
      firstName: "",
      lastName: "",
      email: "",
      nric: "",
      departmentId: "",
      roleId: "",
      salary: "",
      line1: "",
      line2: "",
      buildingName: "",
      postalCode: "",
      storeId: ""
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

  onCancel = () => {
    this.props.history.goBack();
  };

  handlePostalCodeClick = () => {
    const postalCode = this.state.postalCode;
    axios.get(`https://geocode.xyz/${postalCode}?geoit=json`).then(response => {
      const { data } = response;
      if (!data.error && data.standard.countryname === "Singapore") {
        const addrLine1 = data.standard.addresst;
        this.setState({ line1: addrLine1 });
      } else {
        const customErrors = {
          postalCode: "Postal code is invalid"
        };
        this.props.updateErrors(customErrors);
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const staff = new Staff(
      this.state.firstName,
      this.state.lastName,
      this.state.nric,
      this.state.email,
      this.state.salary
    );

    const staffAddress = new Address(
      this.state.line1,
      this.state.line2,
      this.state.postalCode,
      this.state.buildingName
    );
    const req = new StaffCreateRequest(
      staff,
      this.state.roleId,
      this.state.departmentId,
      staffAddress,
      this.state.storeId
    );

    this.props.createNewStaff(req, this.props.history);
  };

  render() {
    //pulling out the fields from props
    const { errors, disabled } = this.props;
    const postalCodeProps = {
      endAdornment: (
        <InputAdornment position="end">
          <Button
            size="sm"
            color="success"
            outline
            aria-label="toggle password visibility"
            onClick={this.handlePostalCodeClick}
            disabled={disabled}
          >
            Autofill
          </Button>
        </InputAdornment>
      )
    };

    const hasErrors = Object.keys(this.props.errors).length !== 0;

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <form className="material-form">
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <h4>Personal Details</h4>
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="First Name"
                onChange={this.onChange}
                fieldName="firstName"
                state={this.state}
                errors={errors}
                disabled={disabled}
                autoFocus={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="Last Name"
                onChange={this.onChange}
                fieldName="lastName"
                state={this.state}
                errors={errors}
                disabled={disabled}
                autoFocus={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="NRIC"
                onChange={this.onChange}
                fieldName="nric"
                state={this.state}
                errors={errors}
                disabled={disabled}
                autoFocus={true}
              />
              <small>Please enter last 4 characters of NRIC</small>
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="Email"
                onChange={this.onChange}
                fieldName="email"
                state={this.state}
                errors={errors}
                disabled={disabled}
                autoFocus={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                type="number"
                fieldLabel="Postal Code"
                onChange={this.onChange}
                fieldName="postalCode"
                state={this.state}
                errors={errors}
                disabled={disabled}
                onBlur={this.onBlur}
                InputProps={postalCodeProps}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="Building Name"
                onChange={this.onChange}
                fieldName="buildingName"
                state={this.state}
                errors={errors}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="Address Line 1"
                onChange={this.onChange}
                fieldName="line1"
                state={this.state}
                errors={errors}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="Address Line 2"
                onChange={this.onChange}
                fieldName="line2"
                state={this.state}
                errors={errors}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <h4>Employment Details</h4>
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="Wage/day"
                onChange={this.onChange}
                fieldName="salary"
                state={this.state}
                errors={errors}
                disabled={disabled}
                autoFocus={true}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <Autocomplete
                id="tags-standard"
                options={this.props.allDepartments}
                getOptionLabel={option => option.departmentName}
                onChange={(event, value) =>
                  this.onSelectDepartment(event, value)
                }
                getOptionSelected={(option, value) =>
                  option.departmentId === value.departmentId
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Department"
                    fullWidth
                  />
                )}
                errors={errors}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                id="tags-standard"
                options={this.props.allRoles}
                getOptionLabel={option => option.roleName}
                onChange={(event, value) => this.onSelectRole(event, value)}
                getOptionSelected={(option, value) =>
                  option.roleId === value.roleId
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Role"
                    fullWidth
                  />
                )}
                errors={errors}
              />
            </Grid>

            {this.state.displayStore && (
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
            )}
          </Grid>

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
      </MuiPickersUtilsProvider>
    );
  }
}
//mapping global state to this component
const mapStateToProps = state => ({
  allRoles: state.staffEntity.allRoles,
  allDepartments: state.staffEntity.allDepartments,
  allStores: state.storeEntity.allStores,
  errors: state.errors
});

const mapDispatchToProps = {
  createNewStaff, //api/staffEntity/createNewStaff
  clearErrors,
  updateErrors,
  retrieveAllRoles,
  retrieveAllDepartments,
  retrieveAllStores
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(StaffCreateForm, "Staff Management"));
