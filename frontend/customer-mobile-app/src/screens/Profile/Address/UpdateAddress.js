import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {createShippingAddress, updateShippingAddress} from "src/redux/actions/customerActions";
import AddressForm from "src/screens/Profile/Address/AddressForm";
import { clearErrors } from "src/redux/actions";
import Spinner from "react-native-loading-spinner-overlay";

const _ = require("lodash");

function UpdateAddress(props) {
  const { navigation, route } = props;
  const { addressToUpdate } = route.params;
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

  useEffect(() => {
    if (customer) {
      setInputState(addressToUpdate);
    }
  }, [customer]);

  const onChange = (fieldName, text) => {
    setInputState(inputState => ({
      ...inputState,
      [fieldName]: text
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  const handleUpdateAddress = () => {
    dispatch(
      updateShippingAddress(
        customer.customerId,
        inputState,
        navigation,
        setLoading
      )
    );
  };

  return (
    <>
      <AddressForm
        customer={customer}
        inputState={inputState}
        errors={errors}
        onChange={onChange}
        handleSubmit={handleUpdateAddress}
        mode="UPDATE"
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

export default UpdateAddress;
