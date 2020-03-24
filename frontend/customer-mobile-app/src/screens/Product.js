import React, { useState, useEffect } from "react";
import { Block, Button, Text } from "galio-framework";
import { HelperText, TextInput } from "react-native-paper";
import { clearErrors } from "src/redux/actions";
import { Dimensions, Modal, Alert, StyleSheet } from "react-native";
import materialTheme from "src/constants/Theme";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveAllSKUs,
  retrieveProductStockById,
  retrieveProductVariantBySKU,
  retrieveStocksForProductVariant
} from "src/redux/actions/productVariantActions";
import Autocomplete from "src/components/Autocomplete";
import { Portal } from "react-native-paper";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRoute } from "@react-navigation/native";
import { SplashScreen } from "expo";
import {
  dispatchUpdatedCustomer,
  registerForPushNotifications,
  updateInStoreShoppingCart
} from "src/redux/actions/customerActions";
import ViewDetails from "src/screens/ViewDetails";
import AddToCart from "src/screens/AddToCart";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function Product(props) {
  const [pushNotifGenerated, setPushNotifGenerated] = useState(false);
  const route = useRoute();
  const { navigation } = props;
  const dispatch = useDispatch();

  const customer = useSelector(state => state.customer.loggedInCustomer);

  useEffect(() => {
    const registerPushNotificationToken = async () => {
      if (customer && !pushNotifGenerated) {
        SplashScreen.hide();
        let response = await registerForPushNotifications(customer.customerId);
        if (response != null) {
          dispatchUpdatedCustomer(response.data, dispatch);
        }
        setPushNotifGenerated(true);
      }
    };
    registerPushNotificationToken();
    // const notificationSubscription = Notifications.addListener(
    //   handleNotification
    // );
  }, [customer]);


  return (
    <Block flex={1} center>
      {route.name === "View Details" ? (
        <ViewDetails navigation={navigation} />
      ) : route.name === "Add to Cart" ? (
        <AddToCart navigation={navigation} />
      ) : null}
    </Block>
  );
}

export default Product;
