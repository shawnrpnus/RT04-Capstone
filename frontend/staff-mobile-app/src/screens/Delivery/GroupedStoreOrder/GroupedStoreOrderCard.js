import React from "react";
import { Dimensions, Image, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { Block, Text } from "galio-framework";
import {setViewedTransaction, updateViewedGroupStoreOrder} from "src/redux/actions/deliveryActions";
import { MaterialIcons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import AddressCard from "src/screens/Delivery/AddressCard";
import store from "src/redux/store";

const { width, height } = Dimensions.get("window");

const deliveryStatusMap = {
  IN_TRANSIT: ["In Transit", "darkorange"],
  DELIVERED: ["Delivered", "green"],
  PARTIALLY_IN_TRANSIT: ["In Transit (Partial)", "darkorange"],
  PARTIALLY_FULFILLED: ["Delivered (Partial)", "green"]
};

function GroupedStoreOrderCard(props) {
  const { groupedStoreOrder, navigation, setLoading } = props;
  const dispatch = useDispatch();

  const viewGroupedStoreOrderDetails = () => {
    dispatch(updateViewedGroupStoreOrder(groupedStoreOrder));
    navigation.navigate("Grouped Store Order Details");
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
      <TouchableOpacity onPress={viewGroupedStoreOrderDetails}>
        <Block
          flex
          row
          style={{ alignItems: "center", marginBottom: 5 }}
          space={"between"}
        >
          <Block>
            <Text h5 bold>
              Store: {groupedStoreOrder.store.storeName}
            </Text>
            <Text
              h6
              style={{
                fontSize: 15,
                color: deliveryStatusMap[groupedStoreOrder.deliveryStatus][1],
                fontStyle: "italic"
              }}
            >
              {deliveryStatusMap[groupedStoreOrder.deliveryStatus][0]}
            </Text>
          </Block>
          <MaterialIcons
            name={"keyboard-arrow-right"}
            color={"grey"}
            size={40}
          />
        </Block>
      </TouchableOpacity>
      <Block style={{ marginBottom: 5 }}>
        {groupedStoreOrder.transactions &&
          groupedStoreOrder.transactions.length > 0 && (
            <Text h6>
              {groupedStoreOrder.transactions.length} customer order(s)
            </Text>
          )}
        {groupedStoreOrder.inStoreRestockOrderItems &&
          groupedStoreOrder.inStoreRestockOrderItems.length > 0 && (
            <Text h6>
              {groupedStoreOrder.inStoreRestockOrderItems.length} restock
              order(s)
            </Text>
          )}
      </Block>
      <AddressCard address={groupedStoreOrder.store.address} />
    </Block>
  );
}

export default GroupedStoreOrderCard;
