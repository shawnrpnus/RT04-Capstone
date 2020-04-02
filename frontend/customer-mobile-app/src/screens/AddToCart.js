import React, { useEffect, useState } from "react";
import { Block, Text } from "galio-framework";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Alert, Dimensions, Modal, StyleSheet } from "react-native";
import { retrieveProductStockById } from "src/redux/actions/productVariantActions";
import { updateInStoreShoppingCart } from "src/redux/actions/customerActions";
import { useDispatch, useSelector } from "react-redux";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function AddToCart(props) {
  const [alertOpen, setAlertOpen] = useState(null);

  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status !== "granted") {
      // Alert.alert("Camera permission not granted", { cancelable: true });
      Alert.alert("Camera permission not granted", null, null, {
        cancelable: true
      });
    }
  };

  const showSuccessAlert = () =>
    Alert.alert(
      "Success",
      "Item has been added to shopping cart!",
      [{ text: "Ok", onPress: () => setAlertOpen(false) }],
      {
        cancelable: true
      }
    );

  const handleQRScanned = async ({ type, data }) => {
    console.log(alertOpen);
    if (!alertOpen) {
      setAlertOpen(true);
      const productStock = await retrieveProductStockById(data);
      if (productStock) {
        if (productStock.quantity === 0) {
          Alert.alert(
            "Out of Stock",
            "Product is out of stock! View details to search for stores with stock",
            [
              {
                text: "Ok",
                onPress: () => setAlertOpen(false)
              }
            ],
            { cancelable: false }
          );
        } else {
          const productVariantId = productStock.productVariant.productVariantId;
          const shoppingCartItems =
            customer.inStoreShoppingCart.shoppingCartItems;
          const prodVariantIdToCartItem = _.keyBy(
            shoppingCartItems,
            "productVariant.productVariantId"
          );
          let quantity = 1;
          if (prodVariantIdToCartItem.hasOwnProperty(productVariantId)) {
            quantity = prodVariantIdToCartItem[productVariantId].quantity + 1;
          }
          dispatch(
            updateInStoreShoppingCart(
              quantity,
              productVariantId,
              customer.customerId,
              productStock.store.storeId,
              setAlertOpen,
              showSuccessAlert
            )
          );
        }
      } else {
        Alert.alert(
          "Error",
          "Invalid QR Code!\nPlease scan QR codes from our stores.",
          [
            {
              text: "Ok",
              onPress: () => setAlertOpen(false)
            }
          ],
          { cancelable: false }
        );
      }
    }
  };

  return (
    <Block flex={1} center>
      <Block
        flex={1}
        card
        center
        style={{
          backgroundColor: "white",
          width: width,
          height: height,
          marginTop: 0,
          padding: 20,
          borderRadius: 0,
          zIndex: 1
        }}
      >
        <Block flex={0.1} center middle>
          <Text h3 bold style={{ textAlign: "center", marginTop: 30 }}>
            Scan QR
          </Text>
        </Block>
        <Block flex={0.75} style={{ width: width * 0.85, height: width * 0.85 }}>
          <BarCodeScanner
            onBarCodeScanned={handleQRScanned}
            style={{ ...StyleSheet.absoluteFillObject }}
            barCodeTypes={["qr"]}
          />
        </Block>
      </Block>
    </Block>
  );
}

export default AddToCart;
