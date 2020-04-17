import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Notifications, SplashScreen } from "expo";
import { Provider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "src/navigation/Screens";
import store from "src/redux/store";
import theme from "src/constants/Theme";
import {PaymentsStripe as stripe} from "expo-payments-stripe";
import { enableScreens } from 'react-native-screens';

enableScreens();

const STRIPE_PUBLISHABLE_KEY = "pk_test_ZmdBnDvGqXb5mo5QFHaP0NI000bsSGDp5k";

export default function App() {
  useEffect(() => {
    stripe.setOptionsAsync({
      publishableKey: STRIPE_PUBLISHABLE_KEY
    });
  }, []);

  useEffect(() => {
    SplashScreen.preventAutoHide();
    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("reservation", {
        name: "Reservation",
        sound: true,
        vibrate: [0, 250, 250, 250]
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <GalioProvider theme={theme}>
        <PaperProvider>
          <NavigationContainer>
            <Screens />
          </NavigationContainer>
        </PaperProvider>
      </GalioProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
