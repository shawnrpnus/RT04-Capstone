import { Text } from "galio-framework";
import React from "react";

export const renderPrices = (productVariant, shoppingCartItem) => {
  const hasDiscount = !!productVariant.product.discountedPrice;

  const price = productVariant.product.price.toFixed(2);
  if (hasDiscount) {
    const discountedPrice = productVariant.product.discountedPrice.toFixed(2);
    return (
      <>
        <Text h6 style={{ fontSize: 16 }}>
          ${discountedPrice}{" "}
          <Text
            h6
            style={{ textDecorationLine: "line-through", color: "grey" }}
          >
            ${price}
          </Text>
        </Text>
        <Text h6 style={{ fontSize: 16, fontWeight: "bold" }}>
          ${(discountedPrice * shoppingCartItem.quantity).toFixed(2)}
        </Text>
      </>
    );
  } else {
    return (
      <>
        <Text h6 style={{ fontSize: 16 }}>
          ${price}
        </Text>
        <Text h6 style={{ fontSize: 16, fontWeight: "bold" }}>
          ${(price * shoppingCartItem.quantity).toFixed(2)}
        </Text>
      </>
    );
  }
};
