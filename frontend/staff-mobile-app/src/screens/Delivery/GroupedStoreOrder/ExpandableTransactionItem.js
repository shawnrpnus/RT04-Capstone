import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, TouchableOpacity } from "react-native";
import { Button, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import LineItem from "src/screens/Delivery/LineItem";

const { width, height } = Dimensions.get("window");

function ExpandableTransactionItem(props) {
  const { transaction } = props;
  const [showLineItems, setShowLineItems] = useState(
    transaction.transactionLineItems.length < 3
  );

  return (
    <Block
      flex
      card
      center
      style={{
        backgroundColor: "white",
        width: width * 0.98,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        elevation: 0,
        borderRadius: 0,
        borderWidth: 1
      }}
    >
      <Block flex style={{ width: "100%" }}>
        <Text h5 bold style={{ marginBottom: 3 }}>
          Order {transaction.orderNumber.toUpperCase()}
        </Text>
        <Divider style={{ height: 1.2, marginTop: 5, marginBottom: 5 }} />
        <Block flex row space="between" style={{ alignItems: "center" }}>
          <Text h6 bold style={{ fontSize: 16 }}>
            {transaction.transactionLineItems.length} item(s)
          </Text>
          <TouchableOpacity
            onPress={() => setShowLineItems(prevState => !prevState)}
            hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
          >
            <MaterialIcons
              name={showLineItems ? "expand-less" : "expand-more"}
              size={30}
            />
          </TouchableOpacity>
        </Block>
        {showLineItems &&
          transaction.transactionLineItems.map(tli => (
            <LineItem
              productVariant={tli.productVariant}
              quantity={tli.quantity}
              key={tli.transactionLineItemId}
              customWidth={"100%"}
            />
          ))}
      </Block>
    </Block>
  );
}

export default ExpandableTransactionItem;
