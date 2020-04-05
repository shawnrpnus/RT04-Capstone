import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import {
  Dimensions,
  InteractionManager,
  ScrollView,
  StyleSheet
} from "react-native";
import { QRCode } from "react-native-custom-qr-codes-expo";
import AddressCardCheckout from "src/screens/Checkout/AddressCardCheckout";
import TransactionLineItem from "src/screens/Purchases/TransactionLineItem";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, TextInput } from "react-native-paper";
import PurchaseDetailsTotals from "src/screens/Purchases/PurchaseDetailsTotals";
import { renderStatus } from "src/screens/Shared/TransactionFunctions";
import { BarCodeScanner } from "expo-barcode-scanner";
import ReservationLineItem from "src/screens/Reservation/ReservationLineItem";
import { useFocusEffect } from "@react-navigation/native";
import Theme from "src/constants/Theme";
import { markReservationAttendance } from "src/redux/actions/reservationActions";
import Spinner from "react-native-loading-spinner-overlay";

const moment = require("moment");
const { width, height } = Dimensions.get("window");

function ReservationDetails(props) {
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const reservation = useSelector(state => state.reservation.viewedReservation);
  const [displayCamera, setDisplayCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQRScanned = ({ type, data }) => {
    if (Number(data) === reservation.store.storeId) {
      const nowPlus5Mins = moment().add(5, "m");
      const nowMinus5Mins = moment().subtract(5, "m");
      if (
        moment(reservation.reservationDateTime).isBetween(
          nowMinus5Mins,
          nowPlus5Mins,
          "minute"
        )
      ) {
        //allow +- 5mins
        //reservation - 5mins <= now <= reservation + 5mins
        //now + 5mins >= reservation && now - 5mins <= reservation
        //now - 5mins <= reservation <= now + 5mins
        setDisplayCamera(false);
        dispatch(
          markReservationAttendance(
            reservation.reservationId,
            setLoading,
            customer.customerId
          )
        );
      } else {
        alert("Please come only at your allocated time slot!");
        setDisplayCamera(false);
      }
    } else {
      alert("You are at the wrong store for your reservation");
      setDisplayCamera(false);
    }
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
      {reservation && (
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
              {moment(reservation.reservationDateTime).format(
                "D MMM YYYY h:mm A"
              )}
            </Text>
          </Block>
          {!reservation.attended &&
            moment(reservation.reservationDateTime).isAfter(moment()) && (
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
                  Scan the QR at the changing room entrance to mark your
                  attendance
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
                  color: reservation.attended ? "green" : "darkorange"
                }}
              >
                {reservation.attended ? "Attended" : "Not attended"}
              </Text>
            </Block>

            <Block flex style={{ marginTop: 4, marginBottom: 4 }}>
              <Text h5 bold style={{ fontSize: 18 }}>
                Store
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
                <Text h6 bold style={{ fontSize: 16 }}>
                  {reservation.store.storeName}
                </Text>
                <AddressCardCheckout
                  address={reservation.store.address}
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
              borderRadius: 0
            }}
          >
            <Text h5 bold>
              Items
            </Text>
            {reservation.productVariants.map(productVariant => (
              <ReservationLineItem
                productVariant={productVariant}
                key={productVariant.productVariantId}
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
    </Block>
  );
}

export default ReservationDetails;
