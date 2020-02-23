import React from "react";
import "moment";
import MomentUtils from "@date-io/moment";
import { Grid } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import { Link } from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import axios from "axios";
import MaterialNumberSelect from "../../../shared/components/Form/MaterialNumberSelect";
import Select from "../../../shared/components/Form/Select";
import PencilIcon from "mdi-react/PencilIcon";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import DeleteIcon from "mdi-react/DeleteIcon";
import TableEyeIcon from "mdi-react/TableEyeIcon";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

let moment = require("moment");

class StaffForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    errors: PropTypes.object,
    clearErrors: PropTypes.func,
    disabled: PropTypes.bool,
    currentStaff: PropTypes.object
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
      leavesRemaining: currentStaff ? currentStaff.leavesRemaining : "",
      departmentName: currentStaff ? currentStaff.departmentName : "",
      roleName: currentStaff ? currentStaff.roleName : "",
      salary: currentStaff ? currentStaff.salary : "",
      line1: currentStaff ? currentStaff.address.line1 : "",
      line2: currentStaff ? currentStaff.address.line2 : "",
      buildingName: currentStaff ? currentStaff.address.buildingName : "",
      postalCode: currentStaff ? currentStaff.address.postalCode : ""
    };
  }

  onChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  handleTimeChange = (time, attr) => {
    const momentAttr = attr + "Moment";
    const timeString = time.format("HH:mm") + ":00";
    this.setState({
      [attr]: timeString,
      [momentAttr]: time
    });
  };

  handleDelete = storeId => {
    this.props
      .confirmDialog({ description: "Store will be deleted permanently" })
      .then(() => this.props.deleteStore(storeId, this.props.history));
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

  render() {
    const { handleSubmit, errors, disabled, currentStore } = this.props;
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
                fieldLabel="Department"
                onChange={this.onChange}
                fieldName="departmentName"
                state={this.state}
                errors={errors}
                disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
                autoFocus={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialNumberSelect
                onChange={this.onChange}
                state={this.state}
                fieldLabel="Leaves Remaining"
                fieldName="leavesRemaining"
                optionStart={1}
                optionEnd={20}
                disabled={disabled}
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
          </Grid>
          {!disabled ? (
            <ButtonToolbar className="form__button-toolbar">
              <Button
                color="primary"
                className="icon"
                onClick={e => handleSubmit(e, this.state)}
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
          ) : (
            <ButtonToolbar className="form__button-toolbar">
              <Link to={`/store/update/${currentStore.storeId}`}>
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
                onClick={() => this.handleDelete(currentStore.storeId)}
              >
                <p>
                  <DeleteIcon />
                  Delete
                </p>
              </Button>
              <Link to={`/store/viewAll`}>
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
    );
  }
}

export default withMaterialConfirmDialog(StaffForm);
