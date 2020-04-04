import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions } from "react-native";
import { Button, Divider } from "react-native-paper";
import Theme from "src/constants/Theme";
import { set } from "react-native-reanimated";
import { render } from "react-native-web";

const { width, height } = Dimensions.get("window");

function PurchaseDetailsTotals(props) {
  const {
    transactionInitialTotal,
    transactionFinalTotal,
    promoCode,
  } = props;

  const renderPromoCodeName = () => {
    const baseName = promoCode.promoCodeName;
    if (promoCode.percentageDiscount) {
      const percent = promoCode.percentageDiscount;
      return `${baseName} (${percent}% off)`;
    } else if (promoCode.flatDiscount) {
      const flat = promoCode.flatDiscount;
      return `${baseName} ($${flat} off)`;
    }
  };

  const renderDiscountAmount = () => {
    let discount;
    if (promoCode.percentageDiscount) {
      discount = (
        (promoCode.percentageDiscount / 100) *
        transactionInitialTotal
      ).toFixed(2);
    } else if (promoCode.flatDiscount) {
      discount = promoCode.flatDiscount.toFixed(2);
    }
    return `-$${discount}`;
  };

  const renderFinalTotalAmount = () => {
    let finalTotal;
    if (promoCode.percentageDiscount) {
      finalTotal = (
        transactionInitialTotal -
        (promoCode.percentageDiscount / 100) * transactionInitialTotal
      ).toFixed(2);
    } else if (promoCode.flatDiscount) {
      finalTotal = (transactionFinalTotal - promoCode.flatDiscount).toFixed(2);
    }
    return `$${finalTotal}`;
  };

  const renderInitialTotalAmount = () => {
    let finalTotal = transactionInitialTotal.toFixed(2);
    return `$${finalTotal}`;
  };

  return (
    <Block
      flex
      card
      style={{
        backgroundColor: "white",
        width: width,
        marginTop: 5,
        padding: 12,
        borderRadius: 0
      }}
    >
      <Block flex row space="between" style={{ width: "100%" }}>
        <Text h5 bold>
          {promoCode ? "Initial Total" : "Final Total"}
        </Text>
        <Text
          h5
          bold={!promoCode}
          style={{ textDecorationLine: !promoCode ? "underline" : "none" }}
        >
          {renderInitialTotalAmount()}
        </Text>
      </Block>
      {promoCode && (
        <>
          <Block
            flex
            row
            space="between"
            style={{ width: "100%", marginTop: 5 }}
          >
            <Text h5 bold>
              {renderPromoCodeName()}
            </Text>
            <Text h5>{renderDiscountAmount()}</Text>
          </Block>
          <Divider style={{ height: 2, marginTop: 15 }} />
          <Block
            flex
            row
            space="between"
            style={{ width: "100%", marginTop: 3 }}
          >
            <Text h5 bold>
              Final Total
            </Text>
            <Text h5 bold style={{ textDecorationLine: "underline" }}>
              {renderFinalTotalAmount()}
            </Text>
          </Block>
        </>
      )}
    </Block>
  );
}

export default PurchaseDetailsTotals;
