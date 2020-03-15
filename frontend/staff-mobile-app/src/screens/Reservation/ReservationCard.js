import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";

const moment = require("moment");
const { width, height } = Dimensions.get("window");

function ReservationCard(props) {
  const { reservation } = props;
  return (
    <TouchableOpacity>
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
