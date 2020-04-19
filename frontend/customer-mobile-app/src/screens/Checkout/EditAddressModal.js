import React, { useState } from "react";
import { Button } from "react-native-paper";
import { Block, Text } from "galio-framework";
import { Feather } from "@expo/vector-icons";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import AddressCardCheckout from "src/screens/Checkout/AddressCardCheckout";
import AddressForm from "src/screens/Profile/Address/AddressForm";
import {clearErrors, errorMapError} from "src/redux/actions";
import {
  addAddressAtCheckout,
} from "src/redux/actions/customerActions";
import axios from "axios";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function EditAddressModal(props) {
  const {
    addressModalMode,
    setAddressModalMode,
    customer,
    setDeliveryAddress,
    setBillingAddress
  } = props;

  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);

  const [isAdding, setIsAdding] = useState(false);

  const initialState = {
    line1: "",
    line2: "",
    postalCode: "",
    buildingName: "",
    default: false,
    billing: false
  };
  const [inputState, setInputState] = useState(_.clone(initialState));

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
          addAddressAtCheckout(
            customer.customerId,
            addr,
            dispatch,
            setAddressModalMode,
            addressModalMode === "Billing"
              ? setBillingAddress
              : setDeliveryAddress
          );
        } else {
          dispatch(errorMapError({postalCode: "Postal code is invalid"}));
        }
      });
  };

  const getSortedShippingAddresses = customer => {
    const unsortedShippingAddresses = customer.shippingAddresses;
    return unsortedShippingAddresses.sort((a, b) => {
      const result = b.default - a.default + b.billing - a.billing;
      if (b.default) return 1;
      if (a.default) return -1;
      if (result === 0 && b.default && !a.default) {
        return 1;
      } else {
        return result;
      }
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ width: width * 0.8 }}
        onPress={() => {
          if (addressModalMode === "Billing") {
            setBillingAddress(item);
          } else if (addressModalMode === "Delivery") {
            setDeliveryAddress(item);
          }
          setAddressModalMode(false);
        }}
      >
        <AddressCardCheckout address={item} showTitle />
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        Your address book is empty.
      </Text>
    );
  };

  const closeModal = () => {
    setIsAdding(false);
    setAddressModalMode(null);
    setInputState(initialState);
    dispatch(clearErrors());
  };

  return (
    <Modal
      isVisible={
        addressModalMode === "Delivery" || addressModalMode === "Billing"
      }
      onModalHide={() => closeModal()}
      onBackdropPress={() => closeModal()}
      animationIn="fadeInUpBig"
      animationInTiming={300}
      animationOut="fadeOutDownBig"
      animationOutTiming={300}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      style={{ position: "absolute", top: height * 0.075 }}
    >
      <Block
        flex={0}
        center
        style={{
          width: width * 0.9,
          height: height * 0.8,
          backgroundColor: "white",
          borderRadius: 10
        }}
      >
        <Block
          row
          top
          style={{
            width: "100%",
            padding: 20,
            paddingRight: 12,
            marginBottom: -10
          }}
          space="between"
        >
          <Text h5 bold>
            {isAdding
              ? `Add a ${addressModalMode} Address`
              : "Select an Address"}
          </Text>
          <TouchableOpacity onPress={() => closeModal()}>
            <Feather name="x" size={28} />
          </TouchableOpacity>
        </Block>
        {isAdding ? (
          <Block flex style={{ padding: 20, marginTop: -30 }}>
            <AddressForm
              inputState={inputState}
              onChange={onChange}
              errors={errors}
              hideSubmitButton
              overrideWidth={width * 0.85}
            />
          </Block>
        ) : (
          <Block flex>
            <FlatList
              data={getSortedShippingAddresses(customer)}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.addressId.toString()}
              ListEmptyComponent={renderEmpty()}
              contentContainerStyle={{
                alignItems: "center"
              }}
            />
          </Block>
        )}
        <Block left row style={{ marginBottom: 5 }}>
          {isAdding ? (
            <>
              <Button
                style={{ height: 50 }}
                contentStyle={{ height: 50 }}
                labelStyle={{ color: "darkred" }}
                onPress={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button
                style={{ height: 50 }}
                contentStyle={{ height: 50 }}
                onPress={handleCreateAddress}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              style={{ height: 50 }}
              contentStyle={{ height: 50 }}
              onPress={() => setIsAdding(true)}
            >
              Add New Address
            </Button>
          )}
        </Block>
      </Block>
    </Modal>
  );
}

export default EditAddressModal;
