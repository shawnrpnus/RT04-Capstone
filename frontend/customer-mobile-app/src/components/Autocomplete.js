import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";
import { Portal, TextInput } from "react-native-paper";
import { Block } from "galio-framework";
import materialTheme from "src/constants/Theme";
import { Dimensions } from "react-native";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "src/redux/actions";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

export default function Autocomplete(props) {
  const dispatch = useDispatch();
  const { value, setValue, label, array, helperText, error } = props;
  const errors = useSelector(state => state.errors);

  const [focused, setFocused] = useState(true);

  const filteredOptions = array
    .filter(sku => sku.toLowerCase().includes(value.toLowerCase()))
    .map(sku => {
      return (
        <TouchableOpacity
          key={sku}
          onPress={() => {
            setFocused(false);
            setValue(sku);
          }}
        >
          <Text style={styles.autocompleteText}>{sku}</Text>
        </TouchableOpacity>
      );
    });

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
        data={filteredOptions}
        renderItem={({ item }) => item}
        style={{
          ...styles.autocomplete,
          paddingTop: filteredOptions.length > 0 ? 10 : 0
        }}
        contentContainerStyle={{ flex: 1 }}
      />
    </Block>
  );

  return (
    <>
      <Block flex={1} style={{width: "100%"}}>
        <TextInput
          label={label}
          // mode="outlined"
          onFocus={() => {
            setFocused(true);
          }}
          onKeyPress={() => {
            setFocused(true);
          }}
          // onBlur={() => setFocused(false)}
          value={value}
          error={error}
          onChangeText={text => {
            setValue(text);
            if (!_.isEmpty(errors)) dispatch(clearErrors());
            console.log(_.isEmpty(errors));
          }}
          theme={{
            colors: { primary: materialTheme.COLORS.ACCENT_DARKER }
          }}
          style={{ backgroundColor: "transparent", width: "100%" }}
        />
        {helperText}
      </Block>
      {focused && _.isEmpty(errors) && list}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  autocomplete: {
    backgroundColor: "white",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  autocompleteText: {
    zIndex: 1,
    flex: 1,
    padding: 10,
    paddingTop: 0,
    fontSize: 17,
    fontWeight: "bold"
  }
});
