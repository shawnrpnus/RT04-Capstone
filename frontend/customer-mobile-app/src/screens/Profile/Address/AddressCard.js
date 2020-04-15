import React from "react";
import { Block, Checkbox, Text } from "galio-framework";
import { useDispatch } from "react-redux";
import {
  removeShippingAddress,
  updateShippingAddress
} from "src/redux/actions/customerActions";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import { Switch } from "react-native-paper";
import Theme from "src/constants/Theme";
import { Feather } from "@expo/vector-icons";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function AddressCard(props) {
  const { address, customer, setLoading, navigation } = props;

  const dispatch = useDispatch();

  const getTitle = address => {
    if (address.default && address.billing) {
      return "Shipping & Billing Address";
    } else if (address.default && !address.billing) {
      return "Shipping Address";
    } else if (!address.default && address.billing) {
      return "Billing Address";
    } else {
      return "Other Address";
    }
  };

  const setAddrDefault = () => {
    const updatedAddress = _.clone(address);
    updatedAddress.default = true;
    dispatch(updateShippingAddress(customer.customerId, updatedAddress, null, setLoading));
  };

  const setAddrBilling = () => {
    const updatedAddress = _.clone(address);
    updatedAddress.billing = true;
    dispatch(updateShippingAddress(customer.customerId, updatedAddress, null, setLoading));
  };

  const showDeleteConfirmationAlert = () => {
    Alert.alert(
      "Remove address",
      "Are you sure you want to remove this address?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: () =>
            dispatch(
              removeShippingAddress(
                customer.customerId,
                address.addressId,
                setLoading
              )
            )
        }
      ]
    );
  };

  const navigateToUpdateAddress = () => {
    const addressToUpdate = _.clone(address);
    addressToUpdate.postalCode = addressToUpdate.postalCode.toString();
    navigation.navigate("Update Address", {
      addressToUpdate
    });
  };

  return (
    <Block
      flex
      card
      style={{
        backgroundColor: "white",
        width: width * 0.98,
        marginTop: 4,
        padding: 12,
        elevation: 2,
        borderRadius: 0
      }}
    >
      <Block flex row space="between">
        <Text h5 bold style={{ marginBottom: 10, width: "70%" }}>
          {getTitle(address)}
        </Text>
        <TouchableOpacity
          onPress={navigateToUpdateAddress}
          style={{ marginRight: -15 }}
        >
          <Feather name="edit" size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={showDeleteConfirmationAlert}>
          <Feather name="x" size={28} />
        </TouchableOpacity>
      </Block>
      {address.buildingName ? <Text h5 style={{fontStyle: "italic"}}>{address.buildingName}</Text> : null}
      <Text h5>{address.line1}</Text>
      {address.line2 ? <Text h5>{address.line2}</Text> : null}
      <Text h5>{address.postalCode}</Text>
      {address.default ? (
        <Text h6 style={{ color: "grey", marginTop: 10 }}>
          This is your default shipping address
        </Text>
      ) : (
        <Block flex row style={{ alignItems: "center", marginTop: 10 }}>
          <Switch
            color={Theme.COLORS.PRIMARY}
            value={address.default}
            onValueChange={() => setAddrDefault()}
          />
          <Text h6>Set as default shipping address</Text>
        </Block>
      )}
      {address.billing ? (
        <Text h6 style={{ color: "grey" }}>
          This is your default billing address
        </Text>
      ) : (
        <Block flex row style={{ alignItems: "center" }}>
          <Switch
            color={Theme.COLORS.PRIMARY}
            value={address.billing}
            onValueChange={() => setAddrBilling()}
          />
          <Text h6>Set as default billing address</Text>
        </Block>
      )}
    </Block>
  );
}

export default AddressCard;
