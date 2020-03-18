import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { retrieveReservation } from "src/redux/actions/reservationActions";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

const moment = require("moment");
const { width, height } = Dimensions.get("window");

function ReservationCard(props) {
  const { reservation } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const viewReservationDetails = () => {
    if (reservation) {
      dispatch(retrieveReservation(reservation.reservationId, navigation));
    }
  };

  return (
    <TouchableOpacity onPress={viewReservationDetails}>
      <Block
        flex={1}
        card
        style={{
          backgroundColor: "white",
          width: width * 0.95,
          marginTop: 3,
          marginBottom: 3,
          padding: 10,
          elevation: 2,
          borderRadius: 5
        }}
      >
        <Text h5 bold>
          Reservation Date/Time
        </Text>
        <Text h5 style={{ marginBottom: 7 }}>
          {moment(reservation.reservationDateTime).format("D MMM YYYY h:mm A")}
        </Text>
        <Text h5 bold>
          Customer Information
        </Text>
        <Text h5>
          Name: {reservation.customer.firstName} {reservation.customer.lastName}
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
        <Text h5>
          <Text h5 bold>
            {reservation.productVariants.length}
          </Text>{" "}
          {reservation.productVariants.length > 1 ? "items" : "item"} reserved
        </Text>
      </Block>
    </TouchableOpacity>
  );
}

export default ReservationCard;
