import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions } from "react-native";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function AddressCard(props) {
  const { address, border, padding } = props;

  return (
    <Block
      flex
      card
      style={{
        backgroundColor: "white",
        marginTop: 4,
        padding: padding !== undefined ? padding : 12,
        borderRadius: 0,
        borderWidth: border !== undefined ? border : 1
      }}
    >
      {address && (
        <>
          {address.buildingName ? (
            <Text h5 style={{ fontSize: 16 }}>
              {address.buildingName}
            </Text>
          ) : null}
          <Text h6 style={{ fontSize: 16 }}>
            {address.line1}
          </Text>
          {address.line2 ? (
            <Text h5 style={{ fontSize: 16 }}>
              {address.line2}
            </Text>
          ) : null}
          <Text h6 style={{ fontSize: 16 }}>
            {address.postalCode}
          </Text>
        </>
      )}
    </Block>
  );
}

export default AddressCard;
