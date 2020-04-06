import React, { useRef, useState } from "react";
import { Block, Text } from "galio-framework";
import {
  Dimensions,
  InteractionManager,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import AddressCard from "src/screens/Delivery/AddressCard";
import LineItem from "src/screens/Delivery/LineItem";
import Signature from "react-native-signature-canvas";
import CustomerInfoCard from "src/screens/Delivery/CustomerInfoCard";
import { Button } from "react-native-paper";
import Modal from "react-native-modal";
import { Feather } from "@expo/vector-icons";
import { confirmCustomerDirectDelivery } from "src/redux/actions/deliveryActions";

const moment = require("moment");
const { width, height } = Dimensions.get("window");

const deliveryStatusMap = {
  IN_TRANSIT: ["In Transit", "darkorange"],
  DELIVERED: ["Delivered", "green"],
  PARTIALLY_IN_TRANSIT: ["In Transit (Partial)", "darkorange"],
  PARTIALLY_FULFILLED: ["Delivered (Partial)", "green"]
};

function TransactionDetails(props) {
  const dispatch = useDispatch();
  const staff = useSelector(state => state.staff.loggedInStaff);
  const transaction = useSelector(state => state.delivery.viewedTransaction);
  const [displayCamera, setDisplayCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);

  const signatureCanvas = useRef();

  const handleSubmit = img => {
    if (img) {
      dispatch(
        confirmCustomerDirectDelivery(
          [transaction.transactionId],
          staff.staffId,
          setLoading
        )
      );
      setSignatureModalVisible(false);
    }
  };

  const clearCanvas = () => {
    signatureCanvas.current.clear();
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

  const style = `.m-signature-pad--footer
    .button {
      background-color: #3f51b5;
      color: #FFF;
    }
    `;

  return (
    <>
      <Block
        flex={1}
        center
        style={{
          width: width,
          marginTop: 0,
          padding: 0
        }}
      >
        {transaction && (
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
                Order {transaction.orderNumber.toUpperCase()}
              </Text>
            </Block>
            {transaction.deliveryStatus !== "DELIVERED" && (
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
                  Customer Signature
                </Text>
                <Block flex row>
                  <Button onPress={() => setSignatureModalVisible(true)}>
                    Open
                  </Button>
                </Block>
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
                    color: deliveryStatusMap[transaction.deliveryStatus][1]
                  }}
                >
                  {deliveryStatusMap[transaction.deliveryStatus][0]}
                </Text>
              </Block>

              <Block flex style={{ marginTop: 4, marginBottom: 4 }}>
                <Text h5 bold style={{ fontSize: 18 }}>
                  Address
                </Text>
                <AddressCard
                  address={transaction.deliveryAddress}
                  border={1}
                  padding={12}
                />
              </Block>

              <Block flex style={{ marginTop: 4, marginBottom: 4 }}>
                <Text h5 bold style={{ fontSize: 18 }}>
                  Customer Information
                </Text>
                <CustomerInfoCard
                  customer={transaction.customer}
                  border={1}
                  padding={12}
                />
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
                paddingBottom: 12,
                borderRadius: 0
              }}
            >
              <Block flex row style={{ alignItems: "center" }} space="between">
                <Text h5 bold>
                  Items
                </Text>
              </Block>
              {transaction.transactionLineItems.map(item => (
                <LineItem
                  productVariant={item.productVariant}
                  quantity={item.quantity}
                  key={item.transactionLineItemId}
                />
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
        <Modal
          isVisible={signatureModalVisible}
          onModalWillHide={() => setSignatureModalVisible(false)}
          onBackdropPress={() => setSignatureModalVisible(false)}
          animationIn="fadeInUpBig"
          animationInTiming={300}
          animationOut="fadeOutDownBig"
          animationOutTiming={300}
          useNativeDriver={true}
          hideModalContentWhileAnimating
        >
          <Block
            flex={0}
            center
            style={{
              height: height * 0.6,
              width: width * 0.95,
              borderRadius: 10,
              backgroundColor: "white",
              padding: 10
            }}
          >
            <Text h5 bold style={{ marginBottom: 10 }}>
              Confirm Delivery
            </Text>
            <TouchableOpacity
              onPress={() => setSignatureModalVisible(false)}
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <Feather name="x" size={28} />
            </TouchableOpacity>
            <Signature
              // handle when you click save button
              onOK={img => handleSubmit(img)}
              onEmpty={() => {}}
              webStyle={style}
              autoClear={true}
            />
          </Block>
        </Modal>
      </Block>
    </>
  );
}

export default TransactionDetails;
