import React from "react";
import { Easing, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Icon, Header } from "../components/";
import theme from "src/constants/Theme";

// screens

import LogIn from "src/screens/LogIn";
import Home from "src/screens/Home";
import { useSelector } from "react-redux";
import CustomDrawerContent from "src/navigation/CustomDrawerContent";
import Product from "src/screens/Product";
import Reservation from "src/screens/Reservation";
import CustomHeader from "src/components/CustomHeader";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function AppStack(props) {
  const staff = useSelector(state => state.staff.loggedInStaff);
  return (
    <Stack.Navigator initialRouteName={staff ? "AppDrawer" : "Login"}>
      {!staff ? (
        <Stack.Screen
          name="Login"
          component={LogIn}
          options={{
            headerShown: false
          }}
        />
      ) : (
        <Stack.Screen
          name="AppDrawer"
          component={AppDrawer}
          options={{
            headerShown: false
          }}
        />
      )}
    </Stack.Navigator>
  );
}

function AppDrawer(props) {
  const { navigation: baseNavigation } = props;
  return (
    <Drawer.Navigator
      drawerContent={props => (
        <CustomDrawerContent {...props} baseNavigation={baseNavigation} />
      )}
      drawerContentOptions={{
        activeTintColor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: theme.COLORS.ACTIVE,
        inactiveBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          // paddingVertical: 4,
          justifyContent: "center",
          alignContent: "center",
          // alignItems: 'center',
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: "normal"
        }
      }}
      initialRouteName="HomeStack"
    >
      <Drawer.Screen
        name="HomeStack"
        drawerLabel="Home"
        component={HomeStack}
      />
      <Drawer.Screen
        name="ProductStack"
        drawerLabel="Product"
        component={ProductStack}
      />
      <Drawer.Screen
        name="ReservationStack"
        drawerLabel="Reservation"
        component={Reservation}
      />
    </Drawer.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: props => (
            <CustomHeader title="Home" {...props} />
          ),
          headerStyle: { height: 100 }
        }}
      />
    </Stack.Navigator>
  );
}

function ProductStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Product"
        component={Product}
        options={{
          header: props => (
            <CustomHeader title="Product" {...props} />
          ),
          headerStyle: { height: 100 }
        }}
      />
    </Stack.Navigator>
  );
}
