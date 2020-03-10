import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import store from "src/redux/store";
import { GalioProvider } from "galio-framework";
import theme from "src/constants/Theme";
import Screens from "src/navigation/Screens";
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <Provider store={store}>
      <GalioProvider theme={theme}>
        <NavigationContainer>
        <Screens/>
        </NavigationContainer>
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
