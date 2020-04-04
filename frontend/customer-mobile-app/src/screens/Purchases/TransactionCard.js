import React from "react";
import { Block, Text } from "galio-framework";
import { Divider } from "react-native-paper";
import { Dimensions, Image, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setViewedTransaction } from "src/redux/actions/transactionActions";

const moment = require("moment");
const { width, height } = Dimensions.get("window");

function TransactionCard(props) {
  const { transaction, navigation, setLoading } = props;
  const dispatch = useDispatch();

  const viewPurchaseDetails = () => {
    dispatch(
      setViewedTransaction(
        transaction.transactionId,
        () => navigation.navigate("Purchase Details"),
        setLoading
      )
    );
  };

  const renderStatus = () => {
    if (transaction.deliveryStatus === "DELIVERED") {
      if (transaction.collectionMode === "DELIVERY") {
        return ["Delivered", "green"];
      } else if (transaction.collectionMode === "IN_STORE") {
        return ["Collected", "green"];
      }
    } else {
      if (transaction.collectionMode === "DELIVERY") {
        return ["Pending delivery", "darkorange"];
      } else if (transaction.collectionMode === "IN_STORE") {
        return ["Pending collection", "darkorange"];
      }
    }
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
        paddingBottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 0,
        borderRadius: 0
      }}
    >
      <TouchableOpacity onPress={viewPurchaseDetails}>
        <Block
          flex
          row
          style={{ alignItems: "center", marginBottom: 5 }}
          space={"between"}
        >
          <Block>
            <Text h5 bold>
              Purchase {transaction.orderNumber.toUpperCase()}
            </Text>
            <Text h5 style={{ color: "grey" }}>
              {moment(transaction.createdDateTime).format("D MMM YYYY h:mm A")}
            </Text>
            <Text
              h6
              style={{ fontSize: 15, color: renderStatus()[1], fontStyle: "italic" }}
            >
              {renderStatus()[0]}
            </Text>
          </Block>
          <MaterialIcons
            name={"keyboard-arrow-right"}
            color={"grey"}
            size={40}
          />
        </Block>
      </TouchableOpacity>
      <Divider style={{ height: 1.5 }} />
      <Text h6 bold style={{ marginBottom: 8, marginTop: 5}}>
        {transaction.transactionLineItems.length} item(s)
      </Text>
      <ScrollView
        horizontal={true}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        fadingEdgeLength={100}
        style={{ marginBottom: 10 }}
      >
        {transaction.transactionLineItems.map(tli => (
          <Image
            key={tli.transactionLineItemId}
            style={{ width: width * 0.3, height: 150, marginRight: 10 }}
            resizeMethod="resize"
            resizeMode="contain"
            source={{
              uri: tli.productVariant.productImages[0].productImageUrl
            }}
          />
        ))}
      </ScrollView>
    </Block>
  );
}

export default TransactionCard;
