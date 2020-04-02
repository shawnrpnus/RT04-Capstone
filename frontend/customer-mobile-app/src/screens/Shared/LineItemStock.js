import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Block, Text } from "galio-framework";
import React from "react";

const _ = require("lodash");

export const renderLineItemStock = (shoppingCartItemsStock, shoppingCartItem) => {
  const stock = _.get(
    shoppingCartItemsStock,
    `${shoppingCartItem.shoppingCartItemId}.quantity`
  );
  const stockStatus =
    stock === 0
      ? "Out of stock"
      : stock === 0 || shoppingCartItem.quantity > stock
      ? "Insufficient Stock"
      : stock < 10
      ? "Low in stock"
      : "In stock";
  const stockIcon = (
    <MaterialCommunityIcons
      name={
        stock > 0 && shoppingCartItem.quantity <= stock
          ? "check-circle-outline"
          : "close-circle-outline"
      }
      style={{
        color:
          stock === 0 || shoppingCartItem.quantity > stock
            ? "red"
            : stock < 10
            ? "orange"
            : "green"
      }}
      size={20}
    />
  );
  return (
    <Block flex row style={{ marginLeft: 10, alignItems: "center" }}>
      {stockIcon}
      <Text
        h6
        style={{
          marginLeft: 2,
          color:
            stock === 0 || shoppingCartItem.quantity > stock
              ? "red"
              : stock < 10
              ? "orange"
              : "green"
        }}
      >
        {stockStatus}
      </Text>
    </Block>
  );

};
