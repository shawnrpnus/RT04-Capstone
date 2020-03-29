import React, { useState } from "react";
import { Block, Button, Text } from "galio-framework";
import { HelperText, Switch, TextInput } from "react-native-paper";
import { clearErrors } from "src/redux/actions";
import materialTheme from "src/constants/Theme";
import { useDispatch, useSelector } from "react-redux";
import { createShippingAddress } from "src/redux/actions/customerActions";
import { Dimensions } from "react-native";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function AddressForm(props) {
  const { inputState, onChange, handleSubmit, errors } = props;

  return (
    <Block flex={1} center style={{ backgroundColor: "white", width: width }}>
      <Block flex={1} style={{ width: width * 0.9 }}>
        <TextInput
          label="Line 1"
          value={inputState.line1}
          onChangeText={text => {
            onChange("line1", text);
          }}
          theme={{
            colors: { primary: materialTheme.COLORS.ACCENT_DARKER }
          }}
          style={{ backgroundColor: "transparent" }}
          error={!!_.get(errors, "line1")}
        />
        <HelperText type="error" visible={!!_.get(errors, "line1")}>
          {errors.line1}
        </HelperText>
      </Block>
      <Block flex={1} style={{ width: width * 0.9 }}>
        <TextInput
          label="Line 2"
          value={inputState.line2}
          onChangeText={text => {
            onChange("line2", text);
          }}
          theme={{
            colors: { primary: materialTheme.COLORS.ACCENT_DARKER }
          }}
          style={{ backgroundColor: "transparent" }}
          error={!!_.get(errors, "line2")}
        />
        <HelperText type="error" visible={!!_.get(errors, "line2")}>
          {errors.line2}
        </HelperText>
      </Block>
      <Block flex={1} style={{ width: width * 0.9 }}>
        <TextInput
          label="Postal Code"
          value={inputState.postalCode}
          onChangeText={text => {
            if (!isNaN(text)) {
              onChange("postalCode", text);
            }
          }}
          theme={{
            colors: { primary: materialTheme.COLORS.ACCENT_DARKER }
          }}
          style={{ backgroundColor: "transparent" }}
          error={!!_.get(errors, "postalCode")}
        />
        <HelperText type="error" visible={!!_.get(errors, "postalCode")}>
          {errors.postalCode}
        </HelperText>
      </Block>
      <Block flex={1} style={{ width: width * 0.9 }}>
        <TextInput
          label="Building Name"
          value={inputState.buildingName}
          onChangeText={text => {
            onChange("buildingName", text);
          }}
          theme={{
            colors: { primary: materialTheme.COLORS.ACCENT_DARKER }
          }}
          style={{ backgroundColor: "transparent" }}
          error={!!_.get(errors, "buildingName")}
        />
        <HelperText type="error" visible={!!_.get(errors, "buildingName")}>
          {errors.buildingName}
        </HelperText>
      </Block>
      <Block flex row style={{ width: width * 0.9, alignItems: "center" }}>
        <Switch
          color={materialTheme.COLORS.PRIMARY}
          value={inputState.default}
          onValueChange={() => onChange("default", !inputState.default)}
        />
        <Text h6>Set as default shipping address</Text>
      </Block>
      <Block flex row style={{ width: width * 0.9, alignItems: "center" }}>
        <Switch
          color={materialTheme.COLORS.PRIMARY}
          value={inputState.billing}
          onValueChange={() => onChange("billing", !inputState.billing)}
        />
        <Text h6>Set as default billing address</Text>
      </Block>
      <Block flex={1} style={{ width: width * 0.9 }}>
        <Button
          shadowless
          color={materialTheme.COLORS.BUTTON_COLOR}
          style={{ marginTop: 0, height: 50, width: width * 0.9 }}
          onPress={handleSubmit}
        >
          CREATE
        </Button>
      </Block>
    </Block>
  );
}

export default AddressForm;
