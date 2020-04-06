import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, Image } from "react-native";
import Svg, { Rect } from "react-native-svg";
import colourList from "assets/colours.json";

const _ = require("lodash");
const colours = _.keyBy(colourList, "hex");
const { width, height } = Dimensions.get("window");

function LineItem(props) {
  const { productVariant, quantity, customWidth } = props;

  return (
    <Block
      flex
      card
      center
      style={{
        backgroundColor: "#fcfcfc",
        width: customWidth ? customWidth : width,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 10,
        paddingTop: 10,
        elevation: 0,
        borderRadius: 0,
        borderWidth: 0
      }}
    >
      <Block flex row style={{ alignItems: "center" }}>
        <Block flex={0.3} style={{marginRight: 15}}>
          <Image
            key={productVariant.productImages[0].productImageUrl}
            style={{ width: width * 0.3, height: height * 0.18 }}
            resizeMethod="scale"
            resizeMode="contain"
            source={{
              uri: productVariant.productImages[0].productImageUrl
            }}
          />
        </Block>
        <Block flex={0.7} style={{ paddingLeft: 0 }}>
          <Text h5 bold style={{ fontSize: 18 }}>
            {productVariant.product.productName}
          </Text>
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
            {quantity}
          </Text>
        </Block>
      </Block>
    </Block>
  );
}

export default LineItem;
