import React from "react";
import "moment";
import MomentUtils from "@date-io/moment";
import { Grid, MenuItem, Select } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import CreateUpdateStoreRequest from "../../../models/store/CreateUpdateStoreRequest";

let moment = require("moment");

class StoreForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    errors: PropTypes.object,
    clearErrors: PropTypes.func,
    disabled: PropTypes.bool,
    currentStore: PropTypes.instanceOf(CreateUpdateStoreRequest)
  };

  constructor(props) {
    super(props);
    const { currentStore } = this.props;
    this.state = {
      storeName: currentStore ? currentStore.storeName : "",
      numChangingRooms: currentStore ? currentStore.numChangingRooms : "10",
      numReservedChangingRooms: currentStore ? currentStore.numReservedChangingRooms : "5",
      openingTime: currentStore ? currentStore.openingTime : "09:00:00",
      closingTime: currentStore ? currentStore.closingTime: "22:00:00",
      numManagers: currentStore ? currentStore.numManagers : "1",
      numAssistants: currentStore ? currentStore.numAssistants : "5",
      line1: currentStore ? currentStore.address.line1 : "",
      line2: currentStore ? currentStore.address.line2: "",
      buildingName: currentStore ? currentStore.address.buildingName: "",
      postalCode: currentStore ? currentStore.address.postalCode: "",
      openingTimeMoment: currentStore ? moment(currentStore.openingTime, "HH:mm:ss") : moment("09:00", "HH:mm"),
      closingTimeMoment: currentStore ? moment(currentStore.closingTime, "HH:mm:ss") : moment("22:00", "HH:mm")
    };
  }

  onChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) this.props.clearErrors();
    console.log(this.state);
  };

  handleTimeChange = (time, attr) => {
    const momentAttr = attr + "Moment";
    const timeString = time.format("HH:mm") + ":00";
    this.setState({
      [attr]: timeString,
      [momentAttr]: time
    });
  };

  render() {
    const { handleSubmit, errors, disabled } = this.props;

    const numberOptions = Array.from({ length: 20 }, (v, k) => k + 1);

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <form
          className="material-form"
          onSubmit={e => handleSubmit(e, this.state)}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MaterialTextField
                fieldLabel="Store Name"
                onChange={this.onChange}
                fieldName="storeName"
                state={this.state}
                errors={errors}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="material-form__label">Opening Time</div>
              <KeyboardTimePicker
                className="material-form__field"
                style={{ marginTop: 0 }}
                margin="normal"
                variant="dialog"
                inputVariant="outlined"
                value={this.state.openingTimeMoment}
                disabled={disabled}
                onChange={time => {
                  this.handleTimeChange(time, "openingTime");
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="material-form__label">Closing Time</div>
              <KeyboardTimePicker
                className="material-form__field"
                style={{ marginTop: 0 }}
                margin="normal"
                variant="dialog"
                inputVariant="outlined"
                value={this.state.closingTimeMoment}
                disabled={disabled}
                onChange={time => {
                  this.handleTimeChange(time, "closingTime");
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <div className="material-form__label">
                Number of changing rooms
              </div>
              <Select
                name="numChangingRooms"
                className="material-form__field"
                onChange={this.onChange}
                value={this.state.numChangingRooms}
                disabled={disabled}
              >
                {numberOptions.map(option => (
                  <MenuItem key={`ncr-${option}`} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={3}>
              <div className="material-form__label">
                Number of reserved changing rooms
              </div>
              <Select
                name="numChangingRooms"
                className="material-form__field"
                onChange={this.onChange}
                value={this.state.numReservedChangingRooms}
                disabled={disabled}
              >
                {numberOptions.map(option => (
                  <MenuItem key={`nrcr-${option}`} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={3}>
              <div className="material-form__label">Number of managers</div>
              <Select
                name="numManagers"
                className="material-form__field"
                onChange={this.onChange}
                value={this.state.numManagers}
                disabled={disabled}
              >
                {numberOptions.map(option => (
                  <MenuItem key={`nm-${option}`} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={3}>
              <div className="material-form__label">Number of assistants</div>
              <Select
                name="numAssistants"
                className="material-form__field"
                onChange={this.onChange}
                value={this.state.numAssistants}
                disabled={disabled}
              >
                {numberOptions.map(option => (
                  <MenuItem key={`na-${option}`} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <MaterialTextField
                fieldLabel="Address Line 1"
                onChange={this.onChange}
                fieldName="line1"
                state={this.state}
                errors={errors}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12}>
              <MaterialTextField
                fieldLabel="Address Line 2"
                onChange={this.onChange}
                fieldName="line2"
                state={this.state}
                errors={errors}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={6}>
              <MaterialTextField
                fieldLabel="Building Name"
                onChange={this.onChange}
                fieldName="buildingName"
                state={this.state}
                errors={errors}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={6}>
              <MaterialTextField
                fieldLabel="Postal Code"
                onChange={this.onChange}
                fieldName="postalCode"
                state={this.state}
                errors={errors}
                disabled={disabled}
              />
            </Grid>
          </Grid>
          {!disabled ?
            <ButtonToolbar className="form__button-toolbar">
              <Button color="primary" type="submit">
                Submit
              </Button>
              <Button type="button">Cancel</Button>
            </ButtonToolbar> : ""
          }
        </form>
      </MuiPickersUtilsProvider>
    );
  }
}

export default StoreForm;
