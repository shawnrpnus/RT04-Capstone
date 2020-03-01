import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  cardLink,
  cardSubtitle,
  cardTitle
} from "../../../assets/jss/material-kit-pro-react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import customSelectStyle from "../../../assets/jss/material-kit-pro-react/customSelectStyle";
import React, {useEffect, useState} from "react";
import { clearErrors } from "../../../redux/actions";
import CustomTextField from "../../UI/CustomInput/CustomTextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Apartment, Check, Dehaze, Face, Home, Place} from "@material-ui/icons";
import Button from "../../UI/CustomButtons/Button";
import SendUpdateEmailLinkRequest from "../../../models/customer/SendUpdateEmailLinkRequest";
import {
  addShippingAddressDetails,
  emailSending,
  sendUpdateEmailLink,
  updateCustomerName
} from "../../../redux/actions/customerActions";
import UpdateCustomerRequest from "../../../models/customer/UpdateCustomerRequest";
import Address from "../../../models/customer/Address";
import AddUpdateAddressRequest from "../../../models/customer/AddUpdateAddressRequest";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import customCheckboxRadioSwitch from "../../../assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle";
import {useSnackbar} from "notistack";


const useStyles = makeStyles(customCheckboxRadioSwitch);

// do this to edit props (pass in props as a tuple)
export default function AddAddress({ addNewAddress: [addNewAddress, setAddNewAddress] }) {
  // console.log(addNewAddress);
  //Hooks
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  //Redux
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const currCustomer = useSelector(
    state => state.customer.loggedInCustomer
  );

  //State
  const [inputState, setInputState] = useState({
    line1: "",
    line2: "",
    postalCode: "",
    buildingName: "",
    default: false,
    billing: false
  });

  const onChange = e => {
    e.persist();
    // console.log(e.target.value);
    setInputState(inputState => ({
      ...inputState,
      [e.target.name]: e.target.value
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
    // console.log(inputState);
  };

  const handleAddAddress = () => {
    const address = new Address(
      inputState.line1,
      inputState.line2,
      inputState.postalCode,
      inputState.buildingName,
      inputState.default,
      inputState.billing
    );
    const req = new AddUpdateAddressRequest(currCustomer.customerId, address);
    dispatch(addShippingAddressDetails(req, enqueueSnackbar, history));
  };

  const handleToggle = (e) => {
    if(e === "delivery") {
      setInputState(inputState => ({
        ...inputState,
        default: !inputState.default
      }));
    } else {
      setInputState(inputState => ({
        ...inputState,
        billing: !inputState.billing
      }));
    }

    // console.log(inputState.default);
  }

  const handleCancelAddAddress = () => {
    setAddNewAddress(!addNewAddress);
  };

  return (
    <div>
      <h4 style={{marginBottom:0}}>Add New Address</h4>
      <small>Please enter an address you would like to save and deliver your items to.</small>

      <form>
        <CustomTextField
          fieldLabel="Postal Code"
          fieldName="postalCode"
          inputState={inputState}
          onChange={onChange}
          errors={errors}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Place />
              </InputAdornment>
            )
          }}
        />
        <CustomTextField
          fieldLabel="Address Line 1"
          fieldName="line1"
          inputState={inputState}
          onChange={onChange}
          errors={errors}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home />
              </InputAdornment>
            )
          }}
        />
        <CustomTextField
          fieldLabel="Address Line 2"
          fieldName="line2"
          inputState={inputState}
          onChange={onChange}
          errors={errors}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home />
              </InputAdornment>
            )
          }}
        />

        <CustomTextField
          fieldLabel="Building Name"
          fieldName="buildingName"
          inputState={inputState}
          onChange={onChange}
          errors={errors}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home />
              </InputAdornment>
            )
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              onClick={() => handleToggle("delivery")}
              // onClick={handleToggle}
              checkedIcon={<Check className={classes.checkedIcon} />}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{
                checked: classes.checked,
                root: classes.checkRoot
              }}
            />
          }
          classes={{ label: classes.label }}
          label="Set as default delivery address"
        />
        <br/>
        <FormControlLabel
          control={
            <Checkbox
              tabIndex={-1}
              onClick={() => handleToggle("billing")}
              checkedIcon={<Check className={classes.checkedIcon} />}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{
                checked: classes.checked,
                root: classes.checkRoot
              }}
            />
          }
          classes={{ label: classes.label }}
          label="Set as default billing address"
        />
        <br/>
        <Button onClick={handleAddAddress} round color="primary">
          Submit
        </Button>
        <Button onClick={handleCancelAddAddress} round >
          Cancel
        </Button>
      </form>
    </div>
  );
}
