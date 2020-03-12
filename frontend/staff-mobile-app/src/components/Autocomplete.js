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

const { width, height } = Dimensions.get("window");

export default function Autocomplete(props) {
  const { value, setValue, label, array, helperText, error } = props;

  const [focused, setFocused] = useState(false);

  const filteredOptions = array
    .filter(
      sku =>
        sku.toLowerCase().includes(value.toLowerCase()) &&
        value.trim().length > 0
    )
    .map(sku => {
      return (
        <TouchableOpacity
          key={sku}
          onPress={() => {
            setFocused(false);
            setValue(sku);
            console.log(sku)
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
      <Block flex={1}>
        <TextInput
          label={label}
          // mode="outlined"
          onFocus={() => setFocused(true)}
          onKeyPress={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={value}
          error={error}
          onChangeText={text => {
            setValue(text);
          }}
          theme={{
            colors: { primary: materialTheme.COLORS.ACCENT_DARKER }
          }}
          style={{ backgroundColor: "transparent", width: "100%" }}
        />
        {helperText}
      </Block>
      {focused ? list : null}
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
