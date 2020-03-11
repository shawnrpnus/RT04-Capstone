import React from "react";
import { Switch, Platform } from "react-native";

import materialTheme from "src/constants/Theme";

export default function MkSwitch(props) {
  const { value, ...rest } = props;
  const thumbColor =
    Platform.OS === "ios"
      ? null
      : Platform.OS === "android" && value
      ? materialTheme.COLORS.SWITCH_ON
      : materialTheme.COLORS.SWITCH_OFF;

  return (
    <Switch
      value={value}
      thumbColor={thumbColor}
      ios_backgroundColor={materialTheme.COLORS.SWITCH_OFF}
      trackColor={{
        false: materialTheme.COLORS.SWITCH_OFF,
        true: materialTheme.COLORS.SWITCH_ON
      }}
      {...rest}
    />
  );
}
