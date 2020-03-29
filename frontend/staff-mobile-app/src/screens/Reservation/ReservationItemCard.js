import React from "react";
import { Block, Text } from "galio-framework";
import { Image, Dimensions } from "react-native";
import Svg, { Rect } from "react-native-svg";
import colourList from "assets/colours.json";

const _ = require("lodash");
const colours = _.keyBy(colourList, "hex");
const { width, height } = Dimensions.get("window");


function ReservationItemCard(props) {
  const { productVariant } = props;
  return (
    <Block
      flex
      card
      center
      style={{
        backgroundColor: "white",
        width: width,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 5,
        paddingRight: 5,
        elevation: 0,
        borderRadius: 0
      }}
    >
      <Block flex row style={{alignItems: "center"}}>
        <Block flex={0.3}>
          <Image
            key={productVariant.productImages[0].productImageUrl}
            style={{ width: width*0.3, height: height*0.18 }}
            resizeMethod="scale"
            resizeMode="contain"
            source={{
              uri: productVariant.productImages[0].productImageUrl
            }}
          />
        </Block>
        <Block flex={0.7} style={{paddingLeft: 5}}>
          <Text h5 bold style={{fontSize: 20}}>
            {productVariant.product.productName}
          </Text>
          <Text h6 style={{ marginBottom: 10 }}>
            {productVariant.sku}
          </Text>
          <Block flex row style={{ alignItems: "center", marginBottom: 10 }}>
            <Text h5 bold>
              Colour:{" "}
            </Text>
            <Svg
              height={15}
              width={25}
              style={{ marginRight: 5, marginLeft: 5 }}
            >
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
          <Text h5 style={{ marginBottom: 10 }}>
            <Text h5 bold>
              Size:
            </Text>{" "}
            {productVariant.sizeDetails.productSize}
          </Text>
        </Block>
      </Block>
    </Block>
  );
}

export default ReservationItemCard;
