import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShippingAddress } from "src/redux/actions/customerActions";
import AddressForm from "src/screens/Profile/Address/AddressForm";
import { clearErrors } from "src/redux/actions";
import Spinner from "react-native-loading-spinner-overlay";

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
    dispatch(
      createShippingAddress(customer.customerId, inputState, navigation, setLoading)
    );
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
        textStyle={{color: "white"}}
        overlayColor="rgba(0,0,0,0.75)"
      />
    </>
  );
}

export default CreateAddress;
