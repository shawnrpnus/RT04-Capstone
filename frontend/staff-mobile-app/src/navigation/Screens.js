import React from "react";
import { Easing, Dimensions, AsyncStorage } from "react-native";
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
import ReservationDetail from "src/screens/Reservation/ReservationDetail";
import CustomHeader from "src/components/CustomHeader";
import ProductDetails from "src/screens/ProductDetails/ProductDetails";
import Reservations from "src/screens/Reservation/Reservations";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import DrawerCustomItem from "src/components/DrawerCustomItem";
import DeliveryList from "src/screens/Delivery/DeliveryList";
import GroupedStoreOrderDetails from "src/screens/Delivery/GroupedStoreOrder/GroupedStoreOrderDetails";

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
  const staff = useSelector(state => state.staff.loggedInStaff);
  const getDepartmentName = () => {
    return staff.department.departmentName;
  };
  return (
    staff && (
      <Drawer.Navigator
        drawerContent={props => (
          <CustomDrawerContent
            {...props}
            baseNavigation={baseNavigation}
            department={getDepartmentName()}
          />
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
        initialRouteName={
          getDepartmentName().toLowerCase() === "delivery"
            ? "DeliveryStack"
            : "HomeStack"
        }
      >
        {getDepartmentName().toLowerCase() !== "delivery" && (
          <>
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
              drawerLabel="ReservationDetail"
              component={ReservationStack}
            />
          </>
        )}
        <Drawer.Screen
          name="DeliveryStack"
          drawerLabel={"Delivery"}
          component={DeliveryStack}
        />
      </Drawer.Navigator>
    )
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: props => <CustomHeader title="Home" {...props} />,
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
          header: props => <CustomHeader title="Product" {...props} />,
          headerStyle: { height: 100 }
        }}
      />
      <Stack.Screen
        name="Product Details"
        component={ProductDetails}
        options={{
          header: props => (
            <CustomHeader title="Product Details" back {...props} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function ReservationStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Reservations"
        component={Reservations}
        options={{
          header: props => <CustomHeader title="Reservations" {...props} />,
          headerStyle: { height: 100 }
        }}
      />
      <Stack.Screen
        name="Reservation Details"
        component={ReservationDetail}
        options={{
          header: props => (
            <CustomHeader title="Reservation Details" back {...props} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function DeliveryStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Deliveries"
        component={DeliveryList}
        options={{
          header: props => (
            <CustomHeader title="Today's Deliveries" {...props} />
          ),
          headerStyle: { height: 100 }
        }}
      />
      <Stack.Screen
        name="Grouped Store Order Details"
        component={GroupedStoreOrderDetails}
        options={{
          header: props => (
            <CustomHeader title="Store Order(s)" {...props} />
          ),
          headerStyle: { height: 100 }
        }}
      />
    </Stack.Navigator>
  );
}
