import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, ScrollView } from "react-native";
import { QRCode } from "react-native-custom-qr-codes-expo";
import AddressCardCheckout from "src/screens/Checkout/AddressCardCheckout";
import TransactionLineItem from "src/screens/Purchases/TransactionLineItem";
import { useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import PurchaseDetailsTotals from "src/screens/Purchases/PurchaseDetailsTotals";

const moment = require("moment");
const { width, height } = Dimensions.get("window");

function PurchaseDetails(props) {
  const transaction = useSelector(state => state.transaction.viewedTransaction);

  const renderStatus = () => {
    if (transaction.deliveryStatus === "DELIVERED") {
      if (transaction.collectionMode === "DELIVERY") {
        return "Delivered";
      } else if (transaction.collectionMode === "IN_STORE") {
        return "Collected";
      }
    } else {
      if (transaction.collectionMode === "DELIVERY") {
        return "Pending delivery";
      } else if (transaction.collectionMode === "IN_STORE") {
        return "Pending collection";
      }
    }
  };

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
              Transaction {transaction.orderNumber.toUpperCase()}
            </Text>
          </Block>
          {transaction.deliveryStatus !== "DELIVERED" &&
            transaction.collectionMode === "IN_STORE" && (
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
                  Proceed to the cashier with this QR code to collect your items
                </Text>
                <QRCode
                  content={transaction.transactionId.toString()}
                  size={250}
                />
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
              <Text h5 bold style={{ width: "30%", fontSize: 16 }}>
                Date
              </Text>
              <Text h5 style={{ width: "70%", fontSize: 16 }}>
                {moment(transaction.createdDateTime).format(
                  "D MMM YYYY h:mm A"
                )}
              </Text>
            </Block>

            <Divider style={{ height: 1.5 }} />

            <Block
              flex
              row
              style={{ alignItems: "center", marginTop: 4, marginBottom: 4 }}
            >
              <Text h5 bold style={{ width: "30%", fontSize: 16 }}>
                Store
              </Text>
              <Text h5 style={{ width: "70%", fontSize: 16 }}>
                {transaction.store.storeName}
              </Text>
            </Block>

            <Divider style={{ height: 1.5 }} />

            <Block
              flex
              row
              style={{ alignItems: "center", marginTop: 4, marginBottom: 4 }}
            >
              <Text h5 bold style={{ width: "30%", fontSize: 16 }}>
                Collection Mode
              </Text>
              <Text h5 style={{ width: "70%", fontSize: 16 }}>
                {transaction.collectionMode === "DELIVERY"
                  ? "Delivery"
                  : "Collected in Store"}
              </Text>
            </Block>

            <Divider style={{ height: 1.5 }} />

            <Block
              flex
              row
              style={{ alignItems: "center", marginTop: 4, marginBottom: 4 }}
            >
              <Text h5 bold style={{ width: "30%", fontSize: 16 }}>
                Item(s)
              </Text>
              <Text h5 style={{ width: "70%", fontSize: 16 }}>
                {transaction.totalQuantity}
              </Text>
            </Block>

            <Divider style={{ height: 1.5 }} />

            <Block
              flex
              row
              style={{ alignItems: "center", marginTop: 4, marginBottom: 4 }}
            >
              <Text h5 bold style={{ width: "30%", fontSize: 16 }}>
                Payment
              </Text>
              <Text h5 style={{ width: "70%", fontSize: 16 }}>
                {transaction.cardIssuer} ending with {transaction.cardLast4}
              </Text>
            </Block>

            <Divider style={{ height: 1.5 }} />

            <Block
              flex
              row
              style={{ alignItems: "center", marginTop: 4, marginBottom: 4 }}
            >
              <Text h5 bold style={{ width: "30%", fontSize: 16 }}>
                Status
              </Text>
              <Text h5 style={{ width: "70%", fontSize: 16 }}>
                {renderStatus()}
              </Text>
            </Block>

            <Divider style={{ height: 1.5 }} />

            {transaction.deliveryAddress && (
              <>
                <Block flex style={{ marginTop: 4, marginBottom: 8 }}>
                  <Text h5 bold style={{ fontSize: 16 }}>
                    Delivery Address
                  </Text>
                  <AddressCardCheckout address={transaction.deliveryAddress} />
                </Block>
              </>
            )}

            <Block flex style={{ marginTop: 4, marginBottom: 4 }}>
              <Text h5 bold style={{ fontSize: 16 }}>
                Billing Address
              </Text>
              <AddressCardCheckout address={transaction.billingAddress} />
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
              borderRadius: 0
            }}
          >
            <Text h5 bold style={{ marginBottom: 5 }}>
              Items
            </Text>
            {transaction.transactionLineItems.map(tli => (
              <TransactionLineItem transactionLineItem={tli} />
            ))}
          </Block>
          <PurchaseDetailsTotals
            transactionInitialTotal={transaction.initialTotalPrice}
            transactionFinalTotal={transaction.finalTotalPrice}
            promoCode={transaction.promoCode}
          />
        </ScrollView>
      )}
    </Block>
  );
}

export default PurchaseDetails;
