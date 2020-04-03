import React from "react";
import {Dimensions} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import theme from "src/constants/Theme";
import LogIn from "src/screens/LogIn";
import {useSelector} from "react-redux";
import CustomDrawerContent from "src/navigation/CustomDrawerContent";
import CustomHeader from "src/components/CustomHeader";
import ProductDetails from "src/screens/ProductDetails/ProductDetails";
import ShoppingCart from "src/screens/ShoppingCart/ShoppingCart";
import ViewAddresses from "src/screens/Profile/Address/ViewAddresses";
import ViewCreditCards from "src/screens/Profile/CreditCard/ViewCreditCards";
import {FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";
import CreateAddress from "src/screens/Profile/Address/CreateAddress";
import UpdateAddress from "src/screens/Profile/Address/UpdateAddress";
import Checkout from "src/screens/Checkout/Checkout";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import ViewDetails from "src/screens/ViewDetails";
import AddToCart from "src/screens/AddToCart";

// screens

const { width, height } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

export default function AppStack(props) {
  const customer = useSelector(state => state.customer.loggedInCustomer);
  return (
    <Stack.Navigator initialRouteName={customer ? "AppDrawer" : "Login"}>
      {!customer ? (
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
      initialRouteName="ShopStack"
    >
      <Drawer.Screen
        name="ShopStack"
        drawerLabel="Shop"
        component={ShopStack}
      />
      <Drawer.Screen
        name="ProfileStack"
        drawerLabel="Profile"
        component={ProfileStack}
      />
      {/*<Drawer.Screen name="TransactionStack" drawerLabel="Transactions" component={}/>*/}
    </Drawer.Navigator>
  );
}

function ProfileStack(props) {
  return (
    <Tab.Navigator
      initialRouteName="View Details"
      tabBarPosition="bottom"
      lazy
      tabBarOptions={{
        activeTintColor: theme.COLORS.PRIMARY,
        inactiveTintColor: "lightgrey",
        style: { backgroundColor: theme.COLORS.CAPTION },
        showIcon: true,
        indicatorStyle: { backgroundColor: theme.COLORS.PRIMARY }
      }}
    >
      <Tab.Screen
        name="Address"
        component={AddressStack}
        options={{
          tabBarLabel: "Address Book",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome name="address-book" color={color} size={20} />
          )
        }}
      />
      <Tab.Screen
        name="CreditCard"
        component={CreditCardsStack}
        options={{
          tabBarLabel: "Credit Cards",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome name="credit-card" color={color} size={20} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function AddressStack(props) {
  return (
    <Stack.Navigator
      mode="card"
      headerMode="screen"
      initialRouteName="View Addresses"
    >
      <Stack.Screen
        name="View Addresses"
        component={ViewAddresses}
        options={{
          header: props => <CustomHeader title="My Address Book" {...props} />,
          headerStyle: { height: 100 }
        }}
      />
      <Stack.Screen
        name="New Address"
        component={CreateAddress}
        options={{
          header: props => <CustomHeader title="New Address" back {...props} />,
          headerStyle: { height: 100 }
        }}
      />
      <Stack.Screen
        name="Update Address"
        component={UpdateAddress}
        options={{
          header: props => (
            <CustomHeader title="Update Address" back {...props} />
          ),
          headerStyle: { height: 100 }
        }}
      />
    </Stack.Navigator>
  );
}

function CreditCardsStack(props) {
  return (
    <Stack.Navigator
      mode="card"
      headerMode="screen"
      initialRouteName="View Credit Cards"
    >
      <Stack.Screen
        name="View Credit Cards"
        component={ViewCreditCards}
        options={{
          header: props => <CustomHeader title="My Credit Cards" {...props} />,
          headerStyle: { height: 100 }
        }}
      />
    </Stack.Navigator>
  );
}

function ShopStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen" initialRouteName="Shop">
      <Stack.Screen
        name="Shop"
        component={ProductScanTabs}
        options={{
          header: props => <CustomHeader title="Shop" {...props} />,
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
      <Stack.Screen
        name="Shopping Cart"
        component={ShoppingCart}
        options={{
          header: props => (
            <CustomHeader
              title="Shopping Cart"
              back
              atShoppingCartPage
              {...props}
            />
          )
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{
          header: props => <CustomHeader title="Checkout" back {...props} />
        }}
      />
    </Stack.Navigator>
  );
}

function ProductScanTabs(props) {
  return (
    <Tab.Navigator
      initialRouteName="View Details"
      tabBarPosition="bottom"
      tabBarOptions={{
        activeTintColor: theme.COLORS.PRIMARY,
        inactiveTintColor: "lightgrey",
        style: { backgroundColor: theme.COLORS.CAPTION },
        showIcon: true,
        indicatorStyle: { backgroundColor: theme.COLORS.PRIMARY }
      }}
    >
      <Tab.Screen
        name="View Details"
        component={ViewDetails}
        options={{
          tabBarLabel: "View Details",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={23} />
          )
        }}
      />
      <Tab.Screen
        name="Add to Cart"
        component={AddToCart}
        options={{
          tabBarLabel: "Add to Cart",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons name="cart-plus" color={color} size={23} />
          )
        }}
      />
    </Tab.Navigator>
  );
}
