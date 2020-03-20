import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, ScrollView, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ReservationItemCard from "src/screens/Reservation/ReservationItemCard";
import { Portal, Provider, FAB } from "react-native-paper";
import Theme from "src/constants/Theme";
import { updateReservationStatus } from "src/redux/actions/reservationActions";

const moment = require("moment");
const { width, height } = Dimensions.get("window");

function ReservationDetail(props) {
  const dispatch = useDispatch();
  const reservation = useSelector(
    state => state.reservation.displayedReservation
  );

  const [open, setOpen] = useState(false);

  const confirmationAttended = () => {
    Alert.alert(
      "Confirm Attendance",
      "Please confirm that the customer has attended the reservation",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () =>
            dispatch(
              updateReservationStatus(
                reservation.reservationId,
                null,
                true,
                reservation.store.storeId
              )
            )
        }
      ],
      { cancelable: false }
    );
  };

  const confirmationHandle = () => {
    Alert.alert(
      "Confirm Handling",
      "Please confirm that you will be fetching the required items and placing them in a changing room",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () =>
            dispatch(
              updateReservationStatus(
                reservation.reservationId,
                true,
                null,
                reservation.store.storeId
              )
            )
        }
      ],
      { cancelable: false }
    );
  };

  let showFAB = true;

  if (reservation && reservation.handled && reservation.attended) {
    showFAB = false;
  }

  let FABactions = [];

  if (reservation && !reservation.attended) {
    FABactions.push({
      icon: "account-check",
      label: "Mark as attended",
      onPress: () => confirmationAttended()
    });
  }

  if (reservation && !reservation.handled) {
    FABactions.push({
      icon: "hand-okay",
      label: "Mark as handled",
      onPress: () => confirmationHandle()
    });
  }

  return (
    <Provider>
      <Block flex={1}>
        <ScrollView
          style={{ height: height }}
          showsVerticalScrollIndicator={false}
        >
          {reservation && (
            <>
              <Block
                flex={1}
                card
                style={{
                  backgroundColor: "white",
                  width: width,
                  marginTop: 3,
                  marginBottom: 3,
                  padding: 20,
                  elevation: 0,
                  borderRadius: 0
                }}
              >
                <Text h5 bold>
                  Reservation Date/Time
                </Text>
                <Text h5 style={{ marginBottom: 7 }}>
                  {moment(reservation.reservationDateTime).format(
                    "D MMM YYYY h:mm A"
                  )}
                </Text>
                <Text h5 bold>
                  Customer Information
                </Text>
                <Text h5>
                  Name: {reservation.customer.firstName}{" "}
                  {reservation.customer.lastName}
                </Text>
                <Text h5 style={{ marginBottom: 7 }}>
                  Email: {reservation.customer.email}
                </Text>
                <Text h5 style={{ marginBottom: 7 }}>
                  <Text h5 bold>
                    Attendance:
                  </Text>
                  <Text h5>
                    {reservation.attended ? " Attended" : " Not attended"}
                  </Text>
                </Text>
                <Text h5 style={{ marginBottom: 7 }}>
                  <Text h5 bold>
                    Handled:
                  </Text>
                  <Text h5>{reservation.handled ? " Yes" : " No"}</Text>
                </Text>
              </Block>
              {reservation.productVariants.map(productVariant => (
                <ReservationItemCard
                  key={productVariant.productVariantId}
                  productVariant={productVariant}
                />
              ))}
            </>
          )}
        </ScrollView>
      </Block>
      <Portal>
        {showFAB && (
          <FAB.Group
            open={open}
            fabStyle={{ backgroundColor: Theme.COLORS.PRIMARY }}
            icon="gesture-tap"
            actions={FABactions}
            onStateChange={({ open }) => setOpen(open)}
          />
        )}
      </Portal>
    </Provider>
  );
}

export default ReservationDetail;
