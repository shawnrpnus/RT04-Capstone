import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions} from "react-native";

const { width, height } = Dimensions.get("window");

function StocksCard(props) {
  const { stocks, store } = props;
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
  );
}

export default StocksCard;
