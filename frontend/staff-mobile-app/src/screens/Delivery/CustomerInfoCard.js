import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions } from "react-native";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function CustomerInfoCard(props) {
  const { customer, border, padding } = props;

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
      {customer && (
        <>
          <Block flex row style={{ alignItems: "center", marginBottom: 4 }}>
            <Text h5 bold style={{ width: "20%", fontSize: 16 }}>
              Name
            </Text>
            <Text
              h5
              style={{
                width: "80%",
                fontSize: 16
              }}
            >
              {customer.firstName} {customer.lastName}
            </Text>
          </Block>

          <Block flex row style={{ alignItems: "center", marginBottom: 4 }}>
            <Text h5 bold style={{ width: "20%", fontSize: 16 }}>
              Email
            </Text>
            <Text
              h5
              style={{
                width: "80%",
                fontSize: 16
              }}
            >
              {customer.email}
            </Text>
          </Block>
        </>
      )}
    </Block>
  );
}

export default CustomerInfoCard;
