import React, { Component, PureComponent } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { Grid, TextField } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import Button from "@material-ui/core/Button";
import * as PropTypes from "prop-types";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import ButtonToolbar from "reactstrap/es/ButtonToolbar";
import StaffChangePasswordRequest from "../../../models/staff/StaffChangePasswordRequest";
import { changePassword } from "../../../redux/actions/staffActions";

class StaffDetailsPage extends Component {
  static propTypes = {
    errors: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleChangeViewDetails = this.handleChangeViewDetails.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.state = {
      staffId: this.props.loggedInStaff.staffId,
      firstName: this.props.loggedInStaff.firstName,
      lastName: this.props.loggedInStaff.lastName,
      email: this.props.loggedInStaff.email,
      nric: this.props.loggedInStaff.nric,
      leaveRemaining: this.props.loggedInStaff.leaveRemaining,
      salary: this.props.loggedInStaff.salary,
      username: this.props.loggedInStaff.username,
      line1: this.props.loggedInStaff.address.line1,
      line2: this.props.loggedInStaff.address.line2,
      buildingName: this.props.loggedInStaff.address.buildingName,
      postalCode: this.props.loggedInStaff.address.postalCode,
      departmentName: this.props.loggedInStaff.department.departmentName,
      roleName: this.props.loggedInStaff.role.roleName,
      oldPassword: "",
      newPassword: ""
    };
  }

  handleChangeViewDetails() {
    this.setState({ mode: true });
  }
  handleChangePassword() {
    this.setState({ mode: false });
  }

  handleSubmit = e => {
    e.preventDefault();

    const req = new StaffChangePasswordRequest(
      this.state.staffId,
      this.state.oldPassword,
      this.state.newPassword
    );

    this.props.changePassword(req, this.props.history);
  };

  onChange = e => {
    const name = e.target.name;
    console.log(e);
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  render() {
    const { errors, disabled } = this.props;
    const hasErrors = Object.keys(this.props.errors).length !== 0;
    return (
      <React.Fragment>
        <div className="card__title">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {this.state.mode ? (
                <h5 className="bold-text">Profile Details</h5>
              ) : (
                <h5 className="bold-text">Change Password</h5>
              )}
            </Grid>
            <Grid item xs={12} md={3}></Grid>
            <Grid item xs={12} md={2}>
              <ButtonGroup color="primary">
                <Button
                  onClick={this.handleChangeViewDetails}
                  variant={this.state.mode ? "contained" : "outlined"}
                >
                  Details
                </Button>
                <Button
                  onClick={this.handleChangePassword}
                  variant={this.state.mode ? "outlined" : "contained"}
                >
                  Settings
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </div>

        {this.state.mode ? (
          <form className="material-form">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="ID"
                  onChange={this.onChange}
                  fieldName="staffId"
                  state={this.state}
                  errors={errors}
                  disabled={true}
                  autoFocus={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Account username"
                  onChange={this.onChange}
                  fieldName="username"
                  state={this.state}
                  errors={errors}
                  disabled={true}
                  autoFocus={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="First Name"
                  onChange={this.onChange}
                  fieldName="firstName"
                  state={this.state}
                  errors={errors}
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
                  autoFocus={true}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Email"
                  onChange={this.onChange}
                  fieldName="email"
                  state={this.state}
                  errors={errors}
                  disabled={true}
                  autoFocus={true}
                />
              </Grid>
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
              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Salary"
                  onChange={this.onChange}
                  fieldName="salary"
                  state={this.state}
                  errors={errors}
                  disabled={true}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MaterialTextField
                  onChange={this.onChange}
                  state={this.state}
                  fieldLabel="Leave Remaining"
                  fieldName="leaveRemaining"
                  disabled={true}
                  errors={errors}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Postal Code"
                  onChange={this.onChange}
                  fieldName="postalCode"
                  state={this.state}
                  errors={errors}
                  disabled={true}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Building Name"
                  onChange={this.onChange}
                  fieldName="buildingName"
                  state={this.state}
                  errors={errors}
                  disabled={true}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Address Line 1"
                  onChange={this.onChange}
                  fieldName="line1"
                  state={this.state}
                  errors={errors}
                  disabled={true}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Address Line 2"
                  onChange={this.onChange}
                  fieldName="line2"
                  state={this.state}
                  errors={errors}
                  disabled={true}
                />
              </Grid>
            </Grid>
          </form>
        ) : (
          <form className="material-form">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Old password"
                  onChange={this.onChange}
                  fieldName="oldPassword"
                  state={this.state}
                  errors={errors}
                  disabled={disabled}
                  autoFocus={true}
                />
              </Grid>
              <Grid item xs={12} md={6}></Grid>
              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="New password"
                  onChange={this.onChange}
                  fieldName="newPassword"
                  state={this.state}
                  errors={errors}
                  disabled={disabled}
                  autoFocus={true}
                />
              </Grid>
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
        )}
      </React.Fragment>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  loggedInStaff: state.staffEntity.loggedInStaff,
  errors: state.errors
});

const mapDispatchToProps = {
  changePassword
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(StaffDetailsPage, "Your Profile"));
