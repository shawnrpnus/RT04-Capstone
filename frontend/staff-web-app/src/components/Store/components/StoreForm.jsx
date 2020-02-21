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
import PencilIcon from "mdi-react/PencilIcon";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";

let moment = require("moment");

class StoreForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    errors: PropTypes.object,
    clearErrors: PropTypes.func,
    disabled: PropTypes.bool,
    currentStore: PropTypes.object
  };

  constructor(props) {
    super(props);
    const { currentStore } = this.props;
    this.state = {
      storeId: currentStore ? currentStore.storeId : undefined,
      storeName: currentStore ? currentStore.storeName : "",
      numChangingRooms: currentStore ? currentStore.numChangingRooms : "10",
      numReservedChangingRooms: currentStore
        ? currentStore.numReservedChangingRooms
        : "5",
      openingTime: currentStore ? currentStore.openingTime : "09:00:00",
      closingTime: currentStore ? currentStore.closingTime : "22:00:00",
      numManagers: currentStore ? currentStore.numManagers : "1",
      numAssistants: currentStore ? currentStore.numAssistants : "5",
      line1: currentStore ? currentStore.address.line1 : "",
      line2: currentStore ? currentStore.address.line2 : "",
      buildingName: currentStore ? currentStore.address.buildingName : "",
      postalCode: currentStore ? currentStore.address.postalCode : "",
      openingTimeMoment: currentStore
        ? moment(currentStore.openingTime, "HH:mm:ss")
        : moment("09:00", "HH:mm"),
      closingTimeMoment: currentStore
        ? moment(currentStore.closingTime, "HH:mm:ss")
        : moment("22:00", "HH:mm")
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
                fieldLabel="Store Name"
                onChange={this.onChange}
                fieldName="storeName"
                state={this.state}
                errors={errors}
                disabled={disabled}
                autoFocus={true}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <div className="material-form__label">Opening Time</div>
              <KeyboardTimePicker
                className="material-form__field"
                style={{ marginTop: 0 }}
                margin="normal"
                variant="dialog"
                inputVariant="standard"
                value={this.state.openingTimeMoment}
                disabled={disabled}
                onChange={time => {
                  this.handleTimeChange(time, "openingTime");
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <div className="material-form__label">Closing Time</div>
              <KeyboardTimePicker
                className="material-form__field"
                style={{ marginTop: 0 }}
                margin="normal"
                variant="dialog"
                inputVariant="standard"
                value={this.state.closingTimeMoment}
                disabled={disabled}
                onChange={time => {
                  this.handleTimeChange(time, "closingTime");
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MaterialNumberSelect
                onChange={this.onChange}
                state={this.state}
                fieldLabel="Number of changing rooms"
                fieldName="numChangingRooms"
                optionStart={1}
                optionEnd={20}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MaterialNumberSelect
                onChange={this.onChange}
                state={this.state}
                fieldLabel="Number of reserved changing rooms"
                fieldName="numReservedChangingRooms"
                optionStart={1}
                optionEnd={20}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MaterialNumberSelect
                onChange={this.onChange}
                state={this.state}
                fieldLabel="Number of managers"
                fieldName="numManagers"
                optionStart={1}
                optionEnd={20}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MaterialNumberSelect
                onChange={this.onChange}
                state={this.state}
                fieldLabel="Number of assistants"
                fieldName="numAssistants"
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
                onClick={e => handleSubmit(e, this.state)}
                disabled={hasErrors}
              >
                <p>
                  <ContentSaveIcon />
                  Submit
                </p>
              </Button>
              <Button type="button" onClick={this.onCancel}>
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
            </ButtonToolbar>
          )}
        </form>
      </MuiPickersUtilsProvider>
    );
  }
}

export default StoreForm;
