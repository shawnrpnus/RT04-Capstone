import React, { useEffect } from "react";
import { Block, Text } from "galio-framework";
import { Image, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import colourList from "assets/colours.json";
import ProductVarAttributesCard from "src/screens/ProductVarAttributesCard";
import { retrieveStocksForProductVariant } from "src/redux/actions/productVariantActions";
import { Divider } from "react-native-paper";

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
            <Block flex style={{ backgroundColor: "transparent" }}>
              <Image
                style={{ width: width, height: height * 0.7 }}
                resizeMethod="scale"
                resizeMode="contain"
                source={{
                  uri: productVariant.productImages[0].productImageUrl
                }}
              />
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
                      <Block flex row>
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
