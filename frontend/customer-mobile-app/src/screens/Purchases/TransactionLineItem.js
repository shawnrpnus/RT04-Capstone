import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, Image } from "react-native";
import Svg, { Rect } from "react-native-svg";
import colourList from "assets/colours.json";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { renderPrices } from "src/screens/Shared/LineItemPrices";
import { renderLineItemStock } from "src/screens/Shared/LineItemStock";

const _ = require("lodash");
const colours = _.keyBy(colourList, "hex");
const { width, height } = Dimensions.get("window");

function TransactionLineItem(props) {
  const { transactionLineItem } = props;
  const { productVariant } = transactionLineItem;

  const renderPrices = () => {
    const hasDiscount = !!transactionLineItem.finalSubTotal;

    const perPieceInitial = transactionLineItem.productVariant.product.price.toFixed(2);
    if (hasDiscount) {
      const perPieceDiscounted = (
        transactionLineItem.finalSubTotal / transactionLineItem.quantity
      ).toFixed(2);
      return (
        <>
          <Text h6 style={{ fontSize: 16 }}>
            ${perPieceDiscounted}{" "}
            <Text
              h6
              style={{ textDecorationLine: "line-through", color: "grey" }}
            >
              ${perPieceInitial}
            </Text>
          </Text>
          <Text h6 style={{ fontSize: 16, fontWeight: "bold" }}>
            ${transactionLineItem.finalSubTotal.toFixed(2)}
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text h6 style={{ fontSize: 16 }}>
            ${perPieceInitial}
          </Text>
          <Text h6 style={{ fontSize: 16, fontWeight: "bold" }}>
            ${transactionLineItem.initialSubTotal.toFixed(2)}
          </Text>
        </>
      );
    }
  };
  return (
    <Block
      flex
      card
      center
      style={{
        backgroundColor: "#fcfcfc",
        width: width,
        marginTop: 7.5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        paddingRight: 10,
        elevation: 0,
        borderRadius: 0,
          borderWidth: 0
      }}
    >
      <Block flex row style={{ alignItems: "center" }}>
        <Block flex={0.3}>
          <Image
            key={productVariant?.productImages[0]?.productImageUrl}
            style={{ width: width * 0.3, height: height * 0.18 }}
            resizeMethod="scale"
            resizeMode="contain"
            source={{
              uri: productVariant?.productImages[0]?.productImageUrl
            }}
          />
        </Block>
        <Block flex={0.7} style={{ paddingLeft: 5 }}>
          <Block flex row space="between">
            <Text h5 bold style={{ fontSize: 20, width: "100%" }}>
              {productVariant?.product?.productName}
            </Text>
          </Block>
          <Block flex row style={{ alignItems: "center", marginBottom: 0 }}>
            <Text h6 bold>
              Colour:{" "}
            </Text>
            <Svg
              height={12}
              width={20}
              style={{ marginRight: 3, marginLeft: 2 }}
            >
              <Rect
                height={12}
                width={20}
                stroke={"black"}
                strokeWidth={1}
                fill={productVariant.colour}
              />
            </Svg>
            <Text h6>{colours[productVariant.colour].name}</Text>
          </Block>
          <Text h6 style={{ marginBottom: 10 }}>
            <Text h6 bold>
              Size:
            </Text>{" "}
            {productVariant.sizeDetails.productSize}
          </Text>
          <Text h6 style={{ marginBottom: 10 }}>
            <Text h6 bold>
              Quantity:
            </Text>{" "}
            {transactionLineItem.quantity}
          </Text>
        </Block>
      </Block>
      <Block
        flex
        style={{
          width: "100%",
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10
        }}
      >
        <Block
          flex
          row
          space="between"
          style={{ width: "100%", marginBottom: 5 }}
        >
          <Text h6 style={{ color: "grey" }}>
            Per Piece
          </Text>
          <Text h6 style={{ color: "grey" }}>
            Total
          </Text>
        </Block>
        <Divider style={{ height: 1 }} />
        <Block
          flex
          row
          space="between"
          style={{ width: "100%", paddingTop: 5 }}
        >
          {renderPrices()}
        </Block>
      </Block>
    </Block>
  );
}

export default TransactionLineItem;
