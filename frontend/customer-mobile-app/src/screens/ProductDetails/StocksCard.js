import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Theme from "src/constants/Theme";
import { FAB } from "react-native-paper";

const { width, height } = Dimensions.get("window");

function StocksCard(props) {
  const { stocks, store } = props;

  const renderStockStatusMessage = stock => {
    return stock === 0
      ? ["Out of stock", "red"]
      : stock < 10
      ? ["Low in stock", "darkorange"]
      : ["In stock", "green"];
  };

  const renderStockIcon = stockQuantity => (
    <MaterialCommunityIcons
      name={stockQuantity > 0 ? "check-circle-outline" : "close-circle-outline"}
      style={{
        color:
          stockQuantity === 0 ? "red" : stockQuantity < 10 ? "orange" : "green"
      }}
      size={20}
    />
  );

  return (
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
                  <Text
                    h5
                    style={{
                      fontWeight:
                        store && store.storeName === stock.storeName
                          ? "bold"
                          : "normal"
                    }}
                  >
                    {stock.storeName}
                  </Text>
                </Block>
                <Block
                  flex={0.5}
                  row
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  {renderStockIcon(stock.quantity)}
                  <Text
                    h5
                    style={{
                      color: renderStockStatusMessage(stock)[1],
                      marginLeft: 5
                    }}
                  >
                    {renderStockStatusMessage(stock)[0]}
                  </Text>
                </Block>
              </Block>
            );
          })}
      </Block>
    </Block>
  );
}

export default StocksCard;
