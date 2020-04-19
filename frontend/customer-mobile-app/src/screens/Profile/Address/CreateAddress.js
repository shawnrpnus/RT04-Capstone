import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShippingAddress } from "src/redux/actions/customerActions";
import AddressForm from "src/screens/Profile/Address/AddressForm";
import { clearErrors, errorMapError } from "src/redux/actions";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";

const _ = require("lodash");

function CreateAddress(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const errors = useSelector(state => state.errors);
  const [inputState, setInputState] = useState({
    line1: "",
    line2: "",
    postalCode: "",
    buildingName: "",
    default: false,
    billing: false
  });
  const [loading, setLoading] = useState(false);

  const onChange = (fieldName, text) => {
    setInputState(inputState => ({
      ...inputState,
      [fieldName]: text
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  const handleCreateAddress = () => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Singapore+${inputState.postalCode}|result_type=postal_code&key=AIzaSyBwSEn5eVyay7QWpufONLyFn6beB1Vf5rc`
      )
      .then(response => {
        if (response.data.status === "OK") {
          const location = response.data.results[0].geometry.location;
          const addr = { ...inputState, lat: location.lat, lng: location.lng };
          dispatch(
            createShippingAddress(
              customer.customerId,
              addr,
              navigation,
              setLoading
            )
          );
        } else {
          dispatch(errorMapError({ postalCode: "Postal code is invalid" }));
        }
      });
  };

  return (
    <>
      <AddressForm
        customer={customer}
        inputState={inputState}
        errors={errors}
        onChange={onChange}
        handleSubmit={handleCreateAddress}
        mode="CREATE"
      />
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={{ color: "white" }}
        overlayColor="rgba(0,0,0,0.75)"
      />
    </>
  );
}

export default CreateAddress;
