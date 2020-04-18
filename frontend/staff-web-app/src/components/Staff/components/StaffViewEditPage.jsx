import React, { Component, PureComponent } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import {
  retrieveStaffById,
  deleteStaff,
  retrieveAllRoles,
  retrieveAllDepartments,
  updateStaff
} from "../../../redux/actions/staffActions";
import Address from "../../../models/address";
import staffUpdate from "../../../models/staff/staffUpdate";
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
import { retrieveAllStores } from "../../../redux/actions/storeActions";
import StaffDetailsUpdateRequest from "../../../models/staff/StaffDetailsUpdateRequest";
import { Link } from "react-router-dom";
import PencilIcon from "mdi-react/PencilIcon";
import DeleteIcon from "mdi-react/DeleteIcon";
import TableEyeIcon from "mdi-react/TableEyeIcon";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";

const _ = require("lodash");

class StaffViewEditPage extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(["view", "update"]),
    errors: PropTypes.object,
    clearErrors: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    currentStaff: PropTypes.object,
    retrieveStaffById: PropTypes.func
  };

  componentDidMount() {
    this.props.retrieveAllRoles();
    this.props.retrieveAllDepartments();
    this.props.retrieveAllStores();
    const staffId = this.props.match.params.staffId;
    this.props.retrieveStaffById(staffId, this.props.history);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { currentStaff } = this.props;

    if (currentStaff && prevProps.currentStaff !== this.props.currentStaff) {
      //set the entire state here to this.props.currentStaff etc
      this.setState({
        staffId: currentStaff.staffId,
        firstName: currentStaff.firstName,
        lastName: currentStaff.lastName,
        email: currentStaff.email,
        nric: currentStaff.nric,
        departmentId: currentStaff.department.departmentId,
        roleId: currentStaff.role.roleId,
        salary: currentStaff.salary,
        line1: currentStaff.address.line1,
        line2: currentStaff.address.line2,
        buildingName: currentStaff.address.buildingName,
        postalCode: currentStaff.address.postalCode,
        storeId:
          currentStaff && currentStaff.store ? currentStaff.store.storeId : "",
        departmentName: currentStaff.department.departmentName,
        roleName: currentStaff.role.roleName,
        storeName:
          currentStaff && currentStaff.store ? currentStaff.store.storeName : ""
      });
    }
  }

  updateErrors = errorMap => {
    this.props.updateErrors(errorMap);
  };

  handleDelete = staffId => {
    this.props
      .confirmDialog({ description: "Staff will be deleted permanently" })
      .then(() => this.props.deleteStaff(staffId, this.props.history));
  };

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
    const { currentStaff } = this.props;
    this.state = {
      staffId: currentStaff ? currentStaff.staffId : undefined,
      firstName: currentStaff ? currentStaff.firstName : "",
      lastName: currentStaff ? currentStaff.lastName : "",
      email: currentStaff ? currentStaff.email : "",
      nric: currentStaff ? currentStaff.nric : "",
      departmentId: currentStaff ? currentStaff.department.departmentId : "",
      roleId: currentStaff ? currentStaff.role.roleId : "",
      salary: currentStaff ? currentStaff.salary : "",
      line1: currentStaff ? currentStaff.address.line1 : "",
      line2: currentStaff ? currentStaff.address.line2 : "",
      buildingName: currentStaff ? currentStaff.address.buildingName : "",
      postalCode: currentStaff ? currentStaff.address.postalCode : "",
      storeId:
        currentStaff && currentStaff.store ? currentStaff.store.storeId : "",
      departmentName: currentStaff
        ? currentStaff.department.departmentName
        : "",
      roleName: currentStaff ? currentStaff.role.roleName : "",
      storeName:
        currentStaff && currentStaff.store ? currentStaff.store.storeName : ""
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

    const staff = new staffUpdate(
      this.state.staffId,
      this.state.firstName,
      this.state.lastName,
      this.state.nric,
      this.state.email,
      this.state.salary
    );

    const address = new Address(
      this.state.line1,
      this.state.line2,
      this.state.postalCode,
      this.state.buildingName
    );
    const req = new StaffDetailsUpdateRequest(
      staff,
      this.state.roleId,
      this.state.departmentId,
      address,
      this.state.storeId
    );

    this.props.updateStaff(req, this.props.history);
  };

  render() {
    const { errors, mode, currentStaff, renderLoader } = this.props;

    const hasErrors = Object.keys(this.props.errors).length !== 0;

    const department = _.get(currentStaff, "department.departmentName", "");
    const showStore = department === "Warehouse" || department === "Store";

    const postalCodeProps = {
      endAdornment: (
        <InputAdornment position="end">
          <Button
            size="sm"
            color="success"
            outline
            aria-label="toggle password visibility"
            onClick={this.handlePostalCodeClick}
            disabled={mode === "view"}
          >
            Autofill
          </Button>
        </InputAdornment>
      )
    };

    const header =
      mode === "view"
        ? "Staff Information"
        : mode === "update"
        ? "Update Staff Information"
        : "";

    const routeStaffId = parseInt(this.props.match.params.staffId);
    return (
      <React.Fragment>
        <div className="card__title">
          <h5 className="bold-text">{header}</h5>
        </div>

        {currentStaff && routeStaffId === currentStaff.staffId ? (
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
                    disabled={mode === "view"}
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
                    disabled={mode === "view"}
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
                    disabled={mode === "view"}
                    autoFocus={true}
                  />
                  {mode === "view" ? (
                    <small>Last 4 characters of NRIC</small>
                  ) : (
                    <small>Please enter last 4 characters of NRIC</small>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <MaterialTextField
                    fieldLabel="Email"
                    onChange={this.onChange}
                    fieldName="email"
                    state={this.state}
                    errors={errors}
                    disabled={mode === "view"}
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
                    disabled={mode === "view"}
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
                    disabled={mode === "view"}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <MaterialTextField
                    fieldLabel="Address Line 1"
                    onChange={this.onChange}
                    fieldName="line1"
                    state={this.state}
                    errors={errors}
                    disabled={mode === "view"}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <MaterialTextField
                    fieldLabel="Address Line 2"
                    onChange={this.onChange}
                    fieldName="line2"
                    state={this.state}
                    errors={errors}
                    disabled={mode === "view"}
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
                    disabled={mode === "view"}
                    autoFocus={true}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>


                <Grid item xs={12} md={6}>
                  {mode === "view" ? (
                    <Grid item xs={12} md={6}>
                      <MaterialTextField
                        fieldLabel="Department"
                        onChange={this.onChange}
                        fieldName="departmentName"
                        state={this.state}
                        errors={errors}
                        disabled={true}
                        autoFocus={true}
                      />
                    </Grid>
                  ) : (
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
                          placeholder={this.state.departmentName}
                          fullWidth
                        />
                      )}
                      errors={errors}
                    />
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {mode === "view" ? (
                    <Grid item xs={12} md={6}>
                      <MaterialTextField
                        fieldLabel="Role"
                        onChange={this.onChange}
                        fieldName="roleName"
                        state={this.state}
                        errors={errors}
                        disabled={true}
                        autoFocus={true}
                      />
                    </Grid>
                  ) : (
                    <Autocomplete
                      id="tags-standard"
                      options={this.props.allRoles}
                      getOptionLabel={option => option.roleName}
                      onChange={(event, value) =>
                        this.onSelectRole(event, value)
                      }
                      getOptionSelected={(option, value) =>
                        option.roleId === value.roleId
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Role"
                          placeholder={this.state.roleName}
                          fullWidth
                        />
                      )}
                      errors={errors}
                    />
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {mode === "view"
                    ? showStore && (
                        <Grid item xs={12} md={6}>
                          <MaterialTextField
                            fieldLabel="Store"
                            onChange={this.onChange}
                            fieldName="storeName"
                            state={this.state}
                            errors={errors}
                            disabled={true}
                            autoFocus={true}
                          />
                        </Grid>
                      )
                    : this.state.displayStore && (
                        <Autocomplete
                          id="tags-standard"
                          options={this.props.allStores}
                          getOptionLabel={option => option.storeName}
                          onChange={(event, value) =>
                            this.onSelectStore(event, value)
                          }
                          getOptionSelected={(option, value) =>
                            option.storeId === value.storeId
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="Store"
                              placeholder={this.state.storeName}
                              fullWidth
                            />
                          )}
                          errors={errors}
                        />
                      )}
                </Grid>
              </Grid>

              {mode === "update" ? (
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
                  <Button
                    type="button"
                    className="icon"
                    onClick={this.onCancel}
                  >
                    <p>
                      <CloseCircleIcon />
                      Cancel
                    </p>
                  </Button>
                </ButtonToolbar>
              ) : (
                <ButtonToolbar className="form__button-toolbar">
                  <Link to={`/staff/update/${currentStaff.staffId}`}>
                    <Button className="icon" color="primary">
                      <p>
                        <PencilIcon />
                        Update
                      </p>
                    </Button>
                  </Link>
                  <Button
                    className="icon"
                    color="danger"
                    onClick={() => this.handleDelete(currentStaff.staffId)}
                  >
                    <p>
                      <DeleteIcon />
                      Delete
                    </p>
                  </Button>
                  <Link to={`/staff/viewAll`}>
                    <Button className="icon">
                      <p>
                        <TableEyeIcon />
                        View All
                      </p>
                    </Button>
                  </Link>
                </ButtonToolbar>
              )}
            </form>
          </MuiPickersUtilsProvider>
        ) : (
          renderLoader()
        )}
      </React.Fragment>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  allRoles: state.staffEntity.allRoles,
  allDepartments: state.staffEntity.allDepartments,
  allStores: state.storeEntity.allStores,
  currentStaff: state.staffEntity.retrievedStaff,
  errors: state.errors
});

const mapDispatchToProps = {
  clearErrors,
  retrieveStaffById,
  updateStaff,
  updateErrors,
  deleteStaff,
  retrieveAllRoles,
  retrieveAllDepartments,
  retrieveAllStores
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMaterialConfirmDialog(withPage(StaffViewEditPage, "Staff Management")));
