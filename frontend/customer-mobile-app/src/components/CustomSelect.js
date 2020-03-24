import React, { useState } from "react";
import {FlatList, StyleSheet} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { Block, Text, Icon, theme } from "galio-framework";

import materialTheme from "src/constants/Theme";

export default function Select(props) {
  const { selectedValue, options} = props;

  const { onSelect, style, ...rest } = props;

  const handleOnSelect = (value, index) => {
    onSelect(value, index);
  };

  const list = (
      <Block
          flex={1}
          row
          style={{
            position: "absolute",
            width: "100%",
            top: 65,
            maxHeight: height * 0.23
          }}
      >
        <FlatList
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
            persistentScrollbar
            data={options}
            renderItem={({ item }) => item}
            style={{
              ...styles.autocomplete,
              paddingTop: options.length > 0 ? 10 : 0
            }}
            contentContainerStyle={{ flex: 1 }}
        />
      </Block>
  );

  return (
    <Block flex row middle space="between">
      <Text size={12}>{state.value}</Text>
      <Icon name="angle-down" family="font-awesome" size={11} />
    </Block>
  );
}

const styles = StyleSheet.create({
  qty: {
    width: theme.SIZES.BASE * 6,
    backgroundColor: materialTheme.COLORS.DEFAULT,
    paddingHorizontal: theme.SIZES.BASE,
    paddingTop: 10,
    paddingBottom: 9.5,
    borderRadius: 3,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1
  },
  dropdown: {
    marginTop: theme.SIZES.BASE / 2,
    marginLeft: -theme.SIZES.BASE,
    width: theme.SIZES.BASE * 6
  }
});
