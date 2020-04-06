import React from "react";
import { Dimensions, Image, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { Block, Text } from "galio-framework";
import { setViewedTransaction } from "src/redux/actions/deliveryActions";
import { MaterialIcons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import AddressCard from "src/screens/Delivery/AddressCard";

const { width, height } = Dimensions.get("window");

const deliveryStatusMap = {
  IN_TRANSIT: ["In Transit", "darkorange"],
  DELIVERED: ["Delivered", "green"]
};

function TransactionCard(props) {
  const { transaction, navigation, setLoading } = props;
  const dispatch = useDispatch();

  const viewTransactionDetails = () => {
    dispatch(
      setViewedTransaction(
        transaction.transactionId,
        () => navigation.navigate("Purchase Details"),
        setLoading
      )
    );
  };

  return (
    <Block
      flex
      card
      style={{
        backgroundColor: "white",
        width: width,
        marginTop: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 0,
        borderRadius: 0
      }}
    >
      <TouchableOpacity onPress={viewTransactionDetails}>
        <Block
          flex
          row
          style={{ alignItems: "center", marginBottom: 5 }}
          space={"between"}
        >
          <Block>
            <Text h5 bold>
              Customer Order {transaction.orderNumber.toUpperCase()}
            </Text>
            <Text
              h6
              style={{
                fontSize: 15,
                color: deliveryStatusMap[transaction.deliveryStatus][1],
                fontStyle: "italic"
              }}
            >
              {deliveryStatusMap[transaction.deliveryStatus][0]}
            </Text>
          </Block>
          <MaterialIcons
            name={"keyboard-arrow-right"}
            color={"grey"}
            size={40}
          />
        </Block>
      </TouchableOpacity>
      <Text h6 style={{marginBottom: 5}}>{transaction.transactionLineItems.length} item(s)</Text>
      <AddressCard address={transaction.deliveryAddress} />
    </Block>
  );
}

export default TransactionCard;
