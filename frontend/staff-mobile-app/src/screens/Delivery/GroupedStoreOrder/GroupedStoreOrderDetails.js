import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, InteractionManager, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-native-paper";

import { BarCodeScanner } from "expo-barcode-scanner";
import { useFocusEffect } from "@react-navigation/native";
import Theme from "src/constants/Theme";
import Spinner from "react-native-loading-spinner-overlay";
import AddressCard from "src/screens/Delivery/AddressCard";
import LineItem from "src/screens/Delivery/LineItem";
import ExpandableTransactionItem from "src/screens/Delivery/GroupedStoreOrder/ExpandableTransactionItem";

const moment = require("moment");
const { width, height } = Dimensions.get("window");

const deliveryStatusMap = {
  IN_TRANSIT: ["In Transit", "darkorange"],
  DELIVERED: ["Delivered", "green"],
  PARTIALLY_IN_TRANSIT: ["In Transit (Partial)", "darkorange"],
  PARTIALLY_FULFILLED: ["Delivered (Partial)", "green"]
};

function GroupedStoreOrderDetails(props) {
  const dispatch = useDispatch();
  const staff = useSelector(state => state.staff.loggedInStaff);
  const groupedStoreOrder = useSelector(
    state => state.delivery.viewedGroupedStoreOrder
  );
  const [displayCamera, setDisplayCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRestockOrderItems, setShowRestockOrderItems] = useState(false);
  const [showCustomerOrders, setShowCustomerOrders] = useState(false);

  const handleQRScanned = ({ type, data }) => {
    //check qr storeid
  };

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setDisplayCamera(false);
      });
      return () => {
        task.cancel();
        setDisplayCamera(false);
      };
    }, [])
  );

  return (
    <Block
      flex={1}
      center
      style={{
        width: width,
        marginTop: 0,
        padding: 0
      }}
    >
      {groupedStoreOrder && (
        <ScrollView>
          <Block
            flex
            card
            center
            style={{
              backgroundColor: "white",
              width: width,
              marginTop: 6,
              padding: 12,
              borderRadius: 0
            }}
          >
            <Text h4 bold style={{ fontSize: 22 }}>
              {groupedStoreOrder.store.storeName.toUpperCase()}
            </Text>
          </Block>
          {groupedStoreOrder.deliveryStatus !== "DELIVERED" && (
            <Block
              flex
              card
              center
              style={{
                backgroundColor: "white",
                width: width,
                marginTop: 5,
                padding: 15,
                borderRadius: 0
              }}
            >
              <Text h5 bold style={{ marginBottom: 5, textAlign: "center" }}>
                Scan a staff's QR to confirm delivery
              </Text>
              {displayCamera ? (
                <>
                  <BarCodeScanner
                    onBarCodeScanned={handleQRScanned}
                    style={{
                      width: width * 0.85,
                      height: width * 0.85
                    }}
                    barCodeTypes={["qr"]}
                  />
                  <Button
                    icon="camera-off"
                    mode="outlined"
                    onPress={() => setDisplayCamera(false)}
                    style={{ marginTop: 10 }}
                    theme={{
                      colors: { primary: Theme.COLORS.ACCENT_DARKER }
                    }}
                  >
                    Hide Camera
                  </Button>
                </>
              ) : (
                <Button
                  icon="camera"
                  mode="outlined"
                  onPress={() => setDisplayCamera(true)}
                  theme={{
                    colors: { primary: Theme.COLORS.ACCENT_DARKER }
                  }}
                >
                  Show Camera
                </Button>
              )}
            </Block>
          )}
          <Block
            flex
            card
            style={{
              backgroundColor: "white",
              marginTop: 5,
              padding: 12,
              borderRadius: 0
            }}
          >
            <Block flex row style={{ alignItems: "center", marginBottom: 4 }}>
              <Text h5 bold style={{ width: "20%", fontSize: 18 }}>
                Status
              </Text>
              <Text
                h5
                style={{
                  width: "80%",
                  fontSize: 18,
                  color: deliveryStatusMap[groupedStoreOrder.deliveryStatus][1]
                }}
              >
                {deliveryStatusMap[groupedStoreOrder.deliveryStatus][0]}
              </Text>
            </Block>

            <Block flex style={{ marginTop: 4, marginBottom: 4 }}>
              <Text h5 bold style={{ fontSize: 18 }}>
                Address
              </Text>
              <Block
                flex
                card
                style={{
                  backgroundColor: "white",
                  marginTop: 4,
                  padding: 12,
                  borderRadius: 0
                }}
              >
                <AddressCard
                  address={groupedStoreOrder.store.address}
                  border={0}
                  padding={0}
                />
              </Block>
            </Block>
          </Block>

          <Block
            flex
            card
            style={{
              backgroundColor: "white",
              width: width,
              marginTop: 5,
              padding: 12,
              paddingTop: 5,
              paddingBottom: showRestockOrderItems ? 12 : 0,
              borderRadius: 0
            }}
          >
            <Block flex row style={{ alignItems: "center" }} space="between">
              <Text h5 bold>
                Restock Order Items
              </Text>
              <Button
                mode="outlined"
                style={{ marginBottom: 5 }}
                onPress={() =>
                  setShowRestockOrderItems(prevState => !prevState)
                }
                color="blue"
              >
                {showRestockOrderItems ? "Hide" : "Show"}
              </Button>
            </Block>
            {showRestockOrderItems &&
              groupedStoreOrder.inStoreRestockOrderItems.map(item => (
                <LineItem
                  productVariant={item.productStock.productVariant}
                  quantity={item.quantity}
                  key={item.inStoreRestockItemId}
                />
              ))}
          </Block>

          <Block
            flex
            card
            style={{
              backgroundColor: "white",
              width: width,
              marginTop: 5,
              padding: 12,
              paddingTop: 5,
              paddingBottom: showCustomerOrders ? 12 : 0,
              borderRadius: 0
            }}
          >
            <Block flex row style={{ alignItems: "center" }} space="between">
              <Text h5 bold>
                Customer Orders
              </Text>
              <Button
                mode="outlined"
                style={{ marginBottom: 5 }}
                onPress={() => setShowCustomerOrders(prevState => !prevState)}
                color="blue"
              >
                {showCustomerOrders ? "Hide" : "Show"}
              </Button>
            </Block>
            {showCustomerOrders &&
              groupedStoreOrder.transactions.map(item => (
                <ExpandableTransactionItem transaction={item} />
              ))}
          </Block>
        </ScrollView>
      )}
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={{ color: "white" }}
        overlayColor="rgba(0,0,0,0.75)"
      />
    </Block>
  );
}

export default GroupedStoreOrderDetails;
