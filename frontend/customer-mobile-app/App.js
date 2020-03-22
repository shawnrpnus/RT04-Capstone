import React, {useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Notifications } from "expo";
import {Provider} from "react-redux";
import {GalioProvider} from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "src/navigation/Screens";
import store from "src/redux/store";
import theme from "src/constants/Theme";



export default function App() {
  useEffect(() => {
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
          <NavigationContainer>
            <Screens />
          </NavigationContainer>
        </GalioProvider>
      </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
