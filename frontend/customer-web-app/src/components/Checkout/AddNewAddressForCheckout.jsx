import React, { useEffect, useState } from "react";
import CustomTextField from "../UI/CustomInput/CustomTextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Check, Home, Place } from "@material-ui/icons";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "../UI/CustomButtons/Button";
import { clearErrors } from "../../redux/actions";
import Address from "../../models/customer/Address";

import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import customCheckboxRadioSwitch from "../../assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory } from "react-router-dom";
import AddUpdateAddressRequest from "../../models/customer/AddUpdateAddressRequest";
import { addShippingAddressDetailsAtCheckout } from "../../redux/actions/transactionActions";
import axios from "axios";
// import { key } from "../../key";

const useStyles = makeStyles(customCheckboxRadioSwitch);

export default function AddNewAddressForCheckOut({
  addNewAddress: [addNewAddress, setAddNewAddress],
  currShippingAddress: [currShippingAddress, setCurrShippingAddress],
  currBillingAddress: [currBillingAddress, setCurrBillingAddress],
  billingAsShipping: [billingAsShipping, setBillingAsShipping],
  editCurrAddress: [editCurrAddress, setEditCurrAddress],
}) {
  const currCustomer = useSelector((state) => state.customer.loggedInCustomer);
  const errors = useSelector((state) => state.errors);
  const dispatch = useDispatch();

  const classes = useStyles();
  const history = useHistory();
  const [mode, setMode] = useState(null);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  //State
  const [inputState, setInputState] = useState({
    line1: editCurrAddress ? editCurrAddress.line1 : "",
    line2: editCurrAddress ? editCurrAddress.line2 : "",
    postalCode: editCurrAddress ? editCurrAddress.postalCode : "",
    buildingName: editCurrAddress ? editCurrAddress.buildingName : "",
    default: editCurrAddress
      ? editCurrAddress.default
      : currCustomer.shippingAddresses.length === 0,
    billing: editCurrAddress
      ? editCurrAddress.billing
      : currCustomer.shippingAddresses.length === 0,
    addressId: editCurrAddress ? editCurrAddress.addressId : null,
  });

  useEffect(() => {
    setBillingAsShipping(currCustomer.shippingAddresses.length === 0);
  }, [currCustomer]);

  const [dispatchAddress, setDispatchAddress] = useState(null);

  const handleToggle = (e) => {
    setBillingAsShipping(e);
  };

  const handleDefaultAddress = (e) => {
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
  };

  const handleAddAddress = () => {
    //changeCurrBillingOrShipping (true = shipping, false = billing)

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Singapore+${inputState.postalCode}|result_type=postal_code&key=AIzaSyBwSEn5eVyay7QWpufONLyFn6beB1Vf5rc`
      )
      .then((response) => {
        const location = response.data.results[0].geometry.location;
        if (response.data.status === "OK") {
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
          // console.log(address);
          const req = new AddUpdateAddressRequest(
            currCustomer.customerId,
            address
          );
          // console.log(req);
          dispatch(
            addShippingAddressDetailsAtCheckout(req, enqueueSnackbar, history)
          );
          // console.log(currAddress);
          // setDispatchAddress(currAddress);
          // console.log(dispatchAddress);
          setCurrBillingAddress(address);
          setAddNewAddress(false);
        } else {
          enqueueSnackbar("Invalid postal code", {
            variant: "error",
            autoHideDuration: 1200,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChange = (e) => {
    e.persist();
    // console.log(e.target.value);
    setInputState((inputState) => ({
      ...inputState,
      [e.target.name]: e.target.value,
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
    // console.log(inputState);
  };

  const changeAddNewAddress = () => {
    setAddNewAddress(!addNewAddress);
    setBillingAsShipping(false);
  };

  return (
    <div>
      <React.Fragment>
        <div>
          <h4 style={{ marginBottom: 0 }}>Add New Address</h4>
          <small>
            Please enter an address that is stated on your credit card.
          </small>
        </div>
      </React.Fragment>

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
              disabled={currCustomer.shippingAddresses.length === 0}
              onClick={() => handleToggle(!billingAsShipping)}
              checked={billingAsShipping}
              checkedIcon={<Check className={classes.checkedIcon} />}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{
                checked: classes.checked,
                root: classes.checkRoot,
              }}
            />
          }
          classes={{ label: classes.label }}
          label="Set billing same as shipping address"
        />

        {/*<FormControlLabel*/}
        {/*  control={*/}
        {/*    <Checkbox*/}
        {/*      onClick={() => handleToggle("delivery")}*/}
        {/*      // onClick={handleToggle}*/}
        {/*      checked={inputState.default}*/}
        {/*      checkedIcon={<Check className={classes.checkedIcon} />}*/}
        {/*      icon={<Check className={classes.uncheckedIcon} />}*/}
        {/*      classes={{*/}
        {/*        checked: classes.checked,*/}
        {/*        root: classes.checkRoot*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  }*/}
        {/*  classes={{ label: classes.label }}*/}
        {/*  label="Set as default delivery address"*/}
        {/*/>*/}
        {/*<br />*/}
        {/*<FormControlLabel*/}
        {/*  control={*/}
        {/*    <Checkbox*/}
        {/*      tabIndex={-1}*/}
        {/*      onClick={() => handleToggle("billing")}*/}
        {/*      checked={inputState.billing}*/}
        {/*      checkedIcon={<Check className={classes.checkedIcon} />}*/}
        {/*      icon={<Check className={classes.uncheckedIcon} />}*/}
        {/*      classes={{*/}
        {/*        checked: classes.checked,*/}
        {/*        root: classes.checkRoot*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  }*/}
        {/*  classes={{ label: classes.label }}*/}
        {/*  label="Set as default billing address"*/}
        {/*/>*/}
        {/*<br />*/}
        <Button onClick={handleAddAddress} round color="primary">
          Submit
        </Button>
        <Button
          onClick={() => {
            changeAddNewAddress();
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
