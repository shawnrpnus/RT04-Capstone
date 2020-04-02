import React, { useState } from "react";
import { Block } from "galio-framework";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Text } from "galio-framework";
import Theme from "src/constants/Theme";
import { Dimensions } from "react-native";
import { applyPromoCode } from "src/redux/actions/promoCodeActions";

const { width, height } = Dimensions.get("window");

function PromoCode(props) {
  const { promoCode, setPromoCode, customer, setLoading } = props;
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleApply = async () => {
    const promoCode = await applyPromoCode(
      customer.customerId,
      text,
      customer.inStoreShoppingCart.finalTotalAmount,
      setLoading,
      setErrorMessage
    );
    setPromoCode(promoCode);
  };

  const handleRemove = () => {
    setText("");
    setPromoCode(null);
  };

  return (
    <Block
      flex
      card
      style={{
        backgroundColor: "white",
        width: width,
        marginTop: 8,
        padding: 12,
        borderRadius: 0
      }}
    >
      <Text h5 bold style={{ marginBottom: 5 }}>
        Promo Code
      </Text>
      <Block flex row right space="between">
        <TextInput
          value={text}
          mode="outlined"
          placeholder="Enter a promo code..."
          onChangeText={text => {
            if (errorMessage) setErrorMessage(null);
            setText(text);
          }}
          style={{ width: "68%", height: 48, paddingVertical: 0 }}
          autoCapitalize="characters"
          dense
          theme={{
            colors: { primary: Theme.COLORS.ACCENT_DARKER }
          }}
          error={!!errorMessage}
        />
        <Button
          mode="contained"
          onPress={!promoCode ? handleApply : handleRemove}
          style={{
            backgroundColor: Theme.COLORS.BUTTON_COLOR,
            width: "30%",
            height: 50
          }}
          contentStyle={{ height: 50 }}
        >
          {!promoCode ? "Apply" : "Remove"}
        </Button>
      </Block>
      <HelperText
        type="error"
        visible={!!errorMessage}
        style={{ marginLeft: -10 }}
      >
        {errorMessage}
      </HelperText>
    </Block>
  );
}

export default PromoCode;
