import React, { useEffect, useState } from "react";
import { Block, Text } from "galio-framework";
import { Image, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, Animated, StyleSheet } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import colourList from "assets/colours.json";
import ProductVarAttributesCard from "src/screens/ProductVarAttributesCard";
import { retrieveStocksForProductVariant } from "src/redux/actions/productVariantActions";
import { Divider } from "react-native-paper";
import Theme from "src/constants/Theme";

const _ = require("lodash");
const colours = _.keyBy(colourList, "hex");
const { width, height } = Dimensions.get("window");

function ProductDetails(props) {
  const dispatch = useDispatch();
  const productVariant = useSelector(
    state => state.product.displayedProductVariant
  );
  const stocks = useSelector(state => state.product.stocks);
  const staff = useSelector(state => state.staff.loggedInStaff);
  const store = _.get(staff, "store");

  const scrollX = new Animated.Value(0);

  useEffect(() => {
    if (productVariant) {
      dispatch(
        retrieveStocksForProductVariant(productVariant.productVariantId)
      );
    }
  }, [productVariant]);

  return (
    <Block flex={1} center>
      <ScrollView
        style={{ height: height }}
        showsVerticalScrollIndicator={false}
      >
        {productVariant && (
          <>
            <Block
              flex
              center
              style={{ backgroundColor: "transparent", position: "relative" }}
            >
              <ScrollView
                horizontal={true}
                pagingEnabled={true}
                decelerationRate={"normal"}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                  {
                    nativeEvent: { contentOffset: { x: scrollX } }
                  }
                ])}
              >
                {productVariant.productImages.map(image => {
                  return (
                    <Image
                      key={image.productImageUrl}
                      style={{ width: width, height: height * 0.7 }}
                      resizeMethod="scale"
                      resizeMode="contain"
                      source={{
                        uri: image.productImageUrl
                      }}
                    />
                  );
                })}
              </ScrollView>
              <Block center style={styles.dotsContainer}>
                <Block row>
                  {productVariant.productImages.map((_, index) => {
                    const position = Animated.divide(scrollX, width);
                    const dotOpacity = position.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [0.5, 1, 0.5],
                      extrapolate: "clamp"
                    });

                    const dotWidth = position.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [10, 20, 10],
                      extrapolate: "clamp"
                    });

                    return (
                      <Animated.View
                        key={index}
                        style={[
                          styles.dots,
                          { opacity: dotOpacity, width: dotWidth }
                        ]}
                      />
                    );
                  })}
                </Block>
              </Block>
            </Block>
            <ProductVarAttributesCard productVariant={productVariant} />
            <Block
              flex
              card
              center
              style={{
                backgroundColor: "white",
                width: width,
                padding: 20,
                elevation: 0,
                borderRadius: 0
              }}
            >
              <Block flex={1} center>
                <Text h4 bold>
                  Stocks
                </Text>
                <Block flex row style={{ marginTop: 10, borderTop: "black" }}>
                  <Block flex={0.5} center>
                    <Text h5 bold>
                      Location
                    </Text>
                  </Block>
                  <Block flex={0.5} center>
                    <Text h5 bold>
                      Quantity
                    </Text>
                  </Block>
                </Block>
                {stocks &&
                  stocks.map(stock => {
                    return (
                      <Block flex row key={stock.storeName + stock.quantity}>
                        <Block flex={0.5} center>
                          <Text h5>
                            {stock.storeName}
                            {store &&
                              store.storeName === stock.storeName &&
                              " (Current)"}
                          </Text>
                        </Block>
                        <Block flex={0.5} center>
                          <Text h5>{stock.quantity}</Text>
                        </Block>
                      </Block>
                    );
                  })}
              </Block>
            </Block>
          </>
        )}
      </ScrollView>
    </Block>
  );
}

export default ProductDetails;

const styles = StyleSheet.create({
  dots: {
    height: 10,
    margin: 8,
    borderRadius: 4,
    backgroundColor: Theme.COLORS.ACCENT_LIGHTER
  },
  dotsContainer: {
    position: "absolute",
    width: width,
    bottom: 8,
    left: 0,
    right: 0,
  }
});
