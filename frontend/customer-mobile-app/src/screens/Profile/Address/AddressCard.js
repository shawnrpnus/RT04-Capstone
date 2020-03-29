import React from "react";
import { Block, Checkbox, Text } from "galio-framework";
import { useDispatch } from "react-redux";
import { updateShippingAddress } from "src/redux/actions/customerActions";
import { Dimensions } from "react-native";
import { Switch } from "react-native-paper";
import Theme from "src/constants/Theme";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function AddressCard(props) {
  const { address, customer } = props;

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
    dispatch(updateShippingAddress(customer.customerId, updatedAddress));
  };

  const setAddrBilling = () => {
    const updatedAddress = _.clone(address);
    updatedAddress.billing = true;
    dispatch(updateShippingAddress(customer.customerId, updatedAddress));
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
      <Text h5 bold style={{marginBottom: 10}}>
        {getTitle(address)}
      </Text>
      {address.buildingName ? <Text h5>{address.buildingName}</Text> : null}
      <Text h5>{address.line1}</Text>
      {address.line2 ? <Text h5>{address.line2}</Text> : null}
      <Text h5>{address.postalCode}</Text>
      {address.default ? (
        <Text h6 style={{color: "grey", marginTop: 10}}>This is your default shipping address</Text>
      ) : (
        <Block flex row style={{alignItems: "center", marginTop: 10}}>
          <Switch
            color={Theme.COLORS.PRIMARY}
            value={address.default}
            onValueChange={() => setAddrDefault()}
          />
          <Text h6>Set as default shipping address</Text>
        </Block>
      )}
      {address.billing ? (
        <Text h6 style={{color: "grey"}}>This is your default billing address</Text>
      ) : (
        <Block flex row style={{alignItems: "center"}}>
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
