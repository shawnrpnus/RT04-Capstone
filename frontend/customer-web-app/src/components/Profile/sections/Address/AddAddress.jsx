import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { clearErrors } from "redux/actions";
import CustomTextField from "components/UI/CustomInput/CustomTextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Check, Home, Place } from "@material-ui/icons";
import Button from "components/UI/CustomButtons/Button";
import {
  addShippingAddressDetails,
  updateShippingAddressDetails,
} from "redux/actions/customerActions";
import Address from "models/customer/Address";
import AddUpdateAddressRequest from "models/customer/AddUpdateAddressRequest";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import customCheckboxRadioSwitch from "assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle";
import { useSnackbar } from "notistack";
import axios from "axios";
// import { key } from "key.js";

const useStyles = makeStyles(customCheckboxRadioSwitch);

// do this to edit props (pass in props as a tuple)
export default function AddAddress({
  addNewAddress: [addNewAddress, setAddNewAddress],
  currAddress: [currAddress, setCurrAddress],
}) {
  //Hooks
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  //Redux
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const currCustomer = useSelector((state) => state.customer.loggedInCustomer);

  //State
  const [inputState, setInputState] = useState({
    line1: currAddress ? currAddress.line1 : "",
    line2: currAddress ? currAddress.line2 : "",
    postalCode: currAddress ? currAddress.postalCode : "",
    buildingName: currAddress ? currAddress.buildingName : "",
    default: currAddress ? currAddress.default : false,
    billing: currAddress ? currAddress.billing : false,
    addressId: currAddress ? currAddress.addressId : undefined,
  });

  const onChange = (e) => {
    e.persist();
    setInputState((inputState) => ({
      ...inputState,
      [e.target.name]: e.target.value,
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  const handleAddAddress = () => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Singapore+${inputState.postalCode}|result_type=postal_code&key=AIzaSyBwSEn5eVyay7QWpufONLyFn6beB1Vf5rc`
      )
      .then((response) => {
        console.log(response.data);

        if (response.data.status === "OK") {
          const location = response.data.results[0].geometry.location;
          if (currAddress) {
            const address = new Address(
              inputState.addressId,
              inputState.line1,
              inputState.line2,
              inputState.postalCode,
              inputState.buildingName,
              inputState.default,
              inputState.billing,
              location.lat,
              location.lng
            );
            const req = new AddUpdateAddressRequest(
              currCustomer.customerId,
              address
            );

            dispatch(
              updateShippingAddressDetails(req, enqueueSnackbar, history)
            );
            setAddNewAddress(!addNewAddress);
            setCurrAddress("");
          } else {
            const address = new Address(
              inputState.addressId,
              inputState.line1,
              inputState.line2,
              inputState.postalCode,
              inputState.buildingName,
              inputState.default,
              inputState.billing,
              location.lat,
              location.lng
            );
            const req = new AddUpdateAddressRequest(
              currCustomer.customerId,
              address
            );
            dispatch(addShippingAddressDetails(req, enqueueSnackbar, history));
            if (inputState.line1 !== "" && inputState.postalCode !== "") {
              setAddNewAddress(!addNewAddress);
            }
          }
        } else {
          enqueueSnackbar("Invalid postal code", {
            variant: "error",
            autoHideDuration: 1200,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleToggle = (e) => {
    if (e === "delivery") {
      setInputState((inputState) => ({
        ...inputState,
        default: !inputState.default,
      }));
    } else {
      setInputState((inputState) => ({
        ...inputState,
        billing: !inputState.billing,
      }));
    }

    // console.log(inputState.default);
  };

  const handleCancelAddAddress = () => {
    setAddNewAddress(!addNewAddress);
    setCurrAddress("");
  };

  return (
    <div>
      {currAddress ? (
        <React.Fragment>
          <h4 style={{ marginBottom: 0 }}>Edit Address</h4>
          <small>
            All future delivery labels will appear exactly as they are below.
          </small>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h4 style={{ marginBottom: 0 }}>Add New Address</h4>
          <small>
            Please enter an address you would like to save and deliver your
            items to.
          </small>
        </React.Fragment>
      )}

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
            ),
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
            ),
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
            ),
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
            ),
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              onClick={() => handleToggle("delivery")}
              // onClick={handleToggle}
              checked={inputState.default}
              checkedIcon={<Check className={classes.checkedIcon} />}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{
                checked: classes.checked,
                root: classes.checkRoot,
              }}
            />
          }
          classes={{ label: classes.label }}
          label="Set as default delivery address"
        />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              tabIndex={-1}
              onClick={() => handleToggle("billing")}
              checked={inputState.billing}
              checkedIcon={<Check className={classes.checkedIcon} />}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{
                checked: classes.checked,
                root: classes.checkRoot,
              }}
            />
          }
          classes={{ label: classes.label }}
          label="Set as default billing address"
        />
        <br />
        <Button onClick={handleAddAddress} round color="primary">
          Submit
        </Button>
        <Button
          onClick={() => {
            handleCancelAddAddress();
            dispatch(clearErrors());
          }}
          round
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}
