import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import materialTheme from "src/constants/Theme";
import {useDispatch} from "react-redux";
import {staffLogout} from "src/redux/actions/staffActions";
import { StackActions } from '@react-navigation/native';

function DrawerCustomItem(props) {
  const { title, focused, navigation } = props;
  const dispatch = useDispatch();

  const renderIcon = () => {
    const { title, focused } = props;
    switch (title) {
      case "Product":
        return (
          <Icon
            size={14}
            name="shop"
            family="entypo"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Reservation":
        return (
          <Icon
            size={16}
            name="calendar"
            family="entypo"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "HomeStack":
        return (
          <Icon
            size={16}
            name="home"
            family="entypo"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Log Out":
        return (
          <Icon
            size={16}
            name="log-out"
            family="entypo"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      default:
        return null;
    }
  };

  const logout = () => {
    dispatch(staffLogout);
  }


  return (
    <TouchableOpacity
      style={{ height: 55 }}
      onPress={title === "Log Out" ? () => logout() : () => navigation.navigate(title)}
    >
      <Block
        flex
        row
        style={[
          styles.defaultStyle,
          focused ? [styles.activeStyle, styles.shadow] : null
        ]}
      >
        <Block middle flex={0.1} style={{ marginRight: 28 }}>
          {renderIcon()}
        </Block>
        <Block flex={0.9}>
          <Text size={15} color={focused ? "white" : "black"}>
            {title === "HomeStack"
              ? "Home"
              : title === "Product"
              ? "Product"
              : title === "Reservation"
              ? "Reservation"
              : title}
          </Text>
        </Block>
      </Block>
    </TouchableOpacity>
  );
}

export default DrawerCustomItem;

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 6
  },
  activeStyle: {
    backgroundColor: materialTheme.COLORS.APRICOT_DARKER,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2
  }
});
