import React, { useEffect, useState } from "react";
import { Block, Card, Text } from "galio-framework";
import { useDispatch, useSelector } from "react-redux";
import { Dimensions, Platform } from "react-native";
import Theme from "src/constants/Theme";
import { Divider } from "react-native-paper";
import {
  dispatchUpdatedStaff,
  registerForPushNotifications
} from "src/redux/actions/staffActions";
import {Notifications} from "expo";
import {retrieveUpcomingReservations} from "src/redux/actions/reservationActions";
import {not} from "react-native-reanimated";

const _ = require("lodash");
const moment = require("moment");
const { width, height } = Dimensions.get("window");

function Home(props) {
  const {navigation} = props;
  const dispatch = useDispatch();
  const staff = useSelector(state => state.staff.loggedInStaff);
  const store = _.get(staff, "store");
  const address = _.get(staff, "store.address");
  const [pushNotifGenerated, setPushNotifGenerated] = useState(false);

  useEffect(() => {
    const registerPushNotificationToken = async () => {
      if (staff && !pushNotifGenerated) {
        let response = await registerForPushNotifications(staff.staffId);
        if (response != null) {
          dispatchUpdatedStaff(response.data, dispatch);
        }
        setPushNotifGenerated(true);
      }
    };
    registerPushNotificationToken();
    const notificationSubscription = Notifications.addListener(
        handleNotification
    );
  }, [staff]);

  const handleNotification = notification => {
    console.log("home notif")
    if (staff && notification.data.type === "reservationReminder") {
      dispatch(retrieveUpcomingReservations(staff.store.storeId, null));
    }
    if (notification.origin === "selected"){
      navigation.navigate("ReservationStack");
    }
  }

  return (
    <Block flex>
      {staff && (
        <>
          <Block flex={0.04} />
          <Block
            flex={0.2}
            center
            middle
            card
            shadow
            style={{
              backgroundColor: Theme.COLORS.SECONDARY,
              width: width * 0.9,
              marginBottom: 20
            }}
          >
            <Text h4 bold>
              Welcome,
            </Text>
            <Text h4>
              {staff.firstName} {staff.lastName}
            </Text>
          </Block>
          <Block
            flex={0.6}
            center
            card
            shadow
            style={{
              backgroundColor: "rgba(255, 255, 255, 1)",
              width: width * 0.9,
              marginBottom: 20,
              padding: 20
            }}
          >
            <Block flex={0.15} center>
              <Text h4 bold>
                {store.storeName}
              </Text>
            </Block>
            <Block flex={0.2} top>
              <Text h5 bold>
                Opening Hours
              </Text>
              <Text h5>
                {moment(store.openingTime, "HH:mm:ss").format("h:mm A")}
                {" - "}
                {moment(store.closingTime, "HH:mm:ss").format("h:mm A")}
              </Text>
            </Block>
            <Block flex={0.12} row top>
              <Text h5 bold>
                Total Changing Rooms:{" "}
              </Text>
              <Text h5>{store.numChangingRooms}</Text>
            </Block>
            <Block flex={0.12} row top>
              <Text h5 bold>
                Reserved Changing Rooms:{" "}
              </Text>
              <Text h5>{store.numReservedChangingRooms}</Text>
            </Block>
            <Block flex={0.3} top>
              <Text h5 bold>
                Address
              </Text>
              <Text
                h5
              >{`${address.buildingName}, \n${address.line1} ${address.line2} \n${address.postalCode}`}</Text>
            </Block>
          </Block>
        </>
      )}
    </Block>
  );
}

export default Home;
