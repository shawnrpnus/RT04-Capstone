import React, { useState } from "react";
import { Block, Text, Button, theme, Icon } from "galio-framework";
import {
  Image,
  Dimensions,
  StyleSheet,
  Picker,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import colourList from "assets/colours.json";
import Select from "src/components/Select";
import { updateInStoreShoppingCart } from "src/redux/actions/customerActions";
import materialTheme from "src/constants/Theme";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Divider, Menu, TextInput } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { render } from "react-native-web";

const _ = require("lodash");
const colours = _.keyBy(colourList, "hex");
const { width, height } = Dimensions.get("window");

function ShoppingCartItem(props) {
  const { shoppingCartItem, customer } = props;
  const { productVariant } = shoppingCartItem;
  const [qtyMenuOpen, setQtyMenuOpen] = useState(false);

  const dispatch = useDispatch();

  const handleQuantityChange = quantity => {
    dispatch(
      updateInStoreShoppingCart(
        quantity,
        productVariant.productVariantId,
        customer.customerId,
        customer.inStoreShoppingCart.store.storeId,
        null,
        null,
        setQtyMenuOpen
      )
    );
  };

  const showDeleteConfirmationAlert = () => {
    Alert.alert("Remove item", "Are you sure you want to remove this item?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Remove",
        onPress: () => handleQuantityChange(0)
      }
    ]);
  };

  const qtyOptions = Array.from({ length: 21 - 1 }, (v, k) => ({
    value: k + 1
  }));

  const renderPrices = () => {
    const hasDiscount = !!productVariant.product.discountedPrice;

    const price = productVariant.product.price.toFixed(2);
    if (hasDiscount) {
      const discountedPrice = productVariant.product.discountedPrice.toFixed(2);
      return (
        <>
          <Text h6 style={{ fontSize: 16 }}>
            ${discountedPrice}{" "}
            <Text
              h6
              style={{ textDecorationLine: "line-through", color: "grey" }}
            >
              ${price}
            </Text>
          </Text>
          <Text h6 style={{ fontSize: 16, fontWeight: "bold" }}>
            ${(discountedPrice * shoppingCartItem.quantity).toFixed(2)}
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text h6 style={{ fontSize: 16 }}>
            ${price}
          </Text>
          <Text h6 style={{ fontSize: 16,  fontWeight: "bold" }}>
            ${(price * shoppingCartItem.quantity).toFixed(2)}
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
        backgroundColor: "white",
        width: width,
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
            <Text h5 bold style={{ fontSize: 20, width: "80%" }}>
              {productVariant.product.productName}
            </Text>
            <TouchableOpacity onPress={showDeleteConfirmationAlert}>
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

          <Menu
            visible={qtyMenuOpen}
            onDismiss={() => setQtyMenuOpen(false)}
            style={{ width: 90 }}
            anchor={
              <TouchableOpacity
                onPress={() => setQtyMenuOpen(true)}
                activeOpacity={0.5}
              >
                <Block flex row>
                  <TextInput
                    mode="outlined"
                    label="Quantity"
                    editable={false}
                    value={shoppingCartItem.quantity.toString()}
                    style={{
                      width: 90,
                      height: 45,
                      backgroundColor: "white",
                      color: "white"
                    }}
                  />
                  <AntDesign
                    name="caretdown"
                    size={15}
                    style={{
                      position: "absolute",
                      left: 62,
                      top: 20,
                      color: "grey"
                    }}
                  />
                </Block>
              </TouchableOpacity>
            }
          >
            <ScrollView height={200}>
              {qtyOptions.map(option => (
                <Menu.Item
                  onPress={() => handleQuantityChange(option.value)}
                  title={option.value.toString()}
                  key={`${shoppingCartItem.shoppingCartItemId}- ${option.value}`}
                />
              ))}
            </ScrollView>
          </Menu>
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
        <Block flex row space="between" style={{ width: "100%", marginBottom: 5}}>
          <Text h6 style={{ color: "grey" }}>
            Per Piece
          </Text>
          <Text h6 style={{ color: "grey" }}>
            Total
          </Text>
        </Block>
        <Divider style={{height: 1}}/>
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
