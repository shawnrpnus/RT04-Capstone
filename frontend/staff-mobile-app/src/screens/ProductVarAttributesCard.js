import React from "react";
import { Block, Text } from "galio-framework";
import Svg, { Rect } from "react-native-svg";
import colourList from "assets/colours.json";
import { Dimensions } from "react-native";

const _ = require("lodash");
const colours = _.keyBy(colourList, "hex");

const { width, height } = Dimensions.get("window");

function ProductVarAttributesCard(props) {
  const { productVariant } = props;
  return (
    <Block
      flex={1}
      card
      center
      style={{
        backgroundColor: "white",
        width: width,
        marginTop: 3,
        marginBottom: 3,
        padding: 20,
        elevation: 0,
        borderRadius: 0
      }}
    >
      <Block flex={1} style={{ width: "100%" }}>
        <Block flex row space="between">
          <Text h4 bold>
            {productVariant.product.productName}
          </Text>
          <Text h4 style={{ marginBottom: 10 }}>
            ${productVariant.product.price}
          </Text>
        </Block>
        <Text h6 style={{ marginBottom: 10 }}>
          {productVariant.sku}
        </Text>

        <Block flex row style={{ alignItems: "center" }}>
          <Text h5 bold>
            Colour:{" "}
          </Text>
          <Svg height={15} width={25} style={{ marginRight: 5, marginLeft: 5 }}>
            <Rect
              height={15}
              width={25}
              stroke={"black"}
              strokeWidth={1}
              fill={productVariant.colour}
            />
          </Svg>
          <Text h5>{colours[productVariant.colour].name}</Text>
        </Block>
        <Text h5>
          <Text h5 bold>
            Size:
          </Text>{" "}
          {productVariant.sizeDetails.productSize}
        </Text>
      </Block>
    </Block>
  );
}

export default ProductVarAttributesCard;
