import React from "react";
import { Block, Text, Button, theme } from "galio-framework";
import {
  Image,
  Dimensions,
  StyleSheet,
  Picker,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import colourList from "assets/colours.json";
import Select from "src/components/Select";
import { updateInStoreShoppingCart } from "src/redux/actions/customerActions";
import materialTheme from "src/constants/Theme";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";

const _ = require("lodash");
const colours = _.keyBy(colourList, "hex");
const { width, height } = Dimensions.get("window");

function ShoppingCartItem(props) {
  const { shoppingCartItem, customer } = props;
  const { productVariant } = shoppingCartItem;

  const dispatch = useDispatch();

  const handleQuantityChange = quantity => {
    dispatch(
      updateInStoreShoppingCart(
        quantity,
        productVariant.productVariantId,
        customer.customerId,
        customer.inStoreShoppingCart.store.storeId
      )
    );
  };

  const qtyOptions = Array.from({ length: 21 - 1 }, (v, k) => k + 1);

  return (
    <Block
      flex
      card
      center
      style={{
        backgroundColor: "white",
        width: width * 0.98,
        marginTop: 4,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        paddingRight: 10,
        elevation: 0,
        borderRadius: 0
      }}
    >
      <Block flex row style={{ alignItems: "center" }}>
        <Block flex={0.3}>
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
        <Block flex={0.7} style={{ paddingLeft: 5 }}>
          <Block flex row space="between">
            <Text h5 bold style={{ fontSize: 20 }}>
              {productVariant.product.productName}
            </Text>
            <TouchableOpacity onPress={() => handleQuantityChange(0)}>
              <Feather name="x" size={28} />
            </TouchableOpacity>
          </Block>
          {/*<Text h6 style={{ marginBottom: 10 }}>*/}
          {/*  {productVariant.sku}*/}
          {/*</Text>*/}
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
          <Block flex row>
            <Block>
              <Select
                defaultIndex={shoppingCartItem.quantity}
                options={qtyOptions}
                onSelect={(index, value) => handleQuantityChange(value)}
              />
              {/*<Picker*/}
              {/*  selectedValue={shoppingCartItem.quantity}*/}
              {/*  onValueChange={(value, index) => handleQuantityChange(value)}*/}
              {/*  style={{ width: 100, height: 34, borderColor: "#040404" }}*/}
              {/*  mode="dropdown"*/}
              {/*>*/}
              {/*  <ScrollView style={{ height: 50 }}>*/}
              {/*    {qtyOptions.map(val => (*/}
              {/*      <Picker.Item*/}
              {/*        key={val}*/}
              {/*        label={val.toString()}*/}
              {/*        value={val}*/}
              {/*        style={{ width: 100 }}*/}
              {/*      />*/}
              {/*    ))}*/}
              {/*  </ScrollView>*/}
              {/*</Picker>*/}
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  optionsButtonText: {
    fontSize: theme.SIZES.BASE * 0.75,
    color: "#4a4a4a",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.29
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
    borderRadius: 3,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1
  }
});

export default ShoppingCartItem;
