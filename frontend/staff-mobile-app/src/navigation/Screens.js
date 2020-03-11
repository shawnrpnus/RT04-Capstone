import React from "react";
import { Easing, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Icon, Header } from "../components/";
import theme from "src/constants/Theme";

// screens

import LogIn from "src/screens/LogIn";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


export default function AppStack(props) {
    return (
        <Stack.Navigator
            initialRouteName="Login"
        >
            <Stack.Screen
                name="Login"
                component={LogIn}
                options={{
                    headerShown: false,
                    drawerIcon: ({ focused }) => (
                        <Icon
                            size={16}
                            name="ios-log-in"
                            family="ionicon"
                            color={focused ? "white" : theme.COLORS.MUTED}
                        />
                    )
                }}
            />
        </Stack.Navigator>
    );
}
