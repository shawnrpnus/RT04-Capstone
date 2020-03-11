import React, { useState } from "react";
import { StyleSheet } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { Block, Text, Icon, theme } from "galio-framework";

import materialTheme from "src/constants/Theme";

export default function DropDown(props) {
  const [state, setState] = useState({
    value: 1
  });

  const { onSelect, style, ...rest } = props;
  const handleOnSelect = (index, value) => {


    setState(prevState => ({ ...prevState, value: value }));
    onSelect && onSelect(index, value);
  };


  return (
    <ModalDropdown
      style={[styles.qty, style]}
      onSelect={handleOnSelect}
      dropdownStyle={styles.dropdown}
      dropdownTextStyle={{ paddingLeft: theme.SIZES.BASE, fontSize: 12 }}
      {...rest}
    >
      <Block flex row middle space="between">
        <Text size={12}>{state.value}</Text>
        <Icon name="angle-down" family="font-awesome" size={11} />
      </Block>
    </ModalDropdown>
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
