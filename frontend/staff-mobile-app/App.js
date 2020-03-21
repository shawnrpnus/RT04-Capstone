import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "src/redux/store";
import { GalioProvider } from "galio-framework";
import theme from "src/constants/Theme";
import Screens from "src/navigation/Screens";
import { NavigationContainer } from "@react-navigation/native";
import { Notifications } from "expo";
import {
  retrieveReservation,
  retrieveUpcomingReservations
} from "src/redux/actions/reservationActions";
import { useNavigation } from "@react-navigation/native";

const jsog = require("jsog");

export default function App(props) {
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("reservation", {
        name: "Reservation",
        sound: true,
        vibrate: [0, 250, 250, 250]
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <GalioProvider theme={theme}>
        <NavigationContainer>
          {/*<PushNotificationHandler />*/}
          <Screens />
        </NavigationContainer>
      </GalioProvider>
    </Provider>
  );
}

// export function PushNotificationHandler(props) {
//   const dispatch = useDispatch();
//   // const navigation = useNavigation();
//   const displayedReservation = useSelector(
//     state => state.reservation.displayedReservation
//   );
//   const staff = useSelector(state => state.staff.loggedInStaff);
//   useEffect(() => {
//     const notificationSubscription = Notifications.addListener(
//       handleNotification
//     );
//   },[]);
//
//   const handleNotification = notification => {
//       //sync reservation data w new / updated reservations
//       /*Cases:
//        1. Customer creates new reservation
//        2. Customer updates reservation
//        3. Customer cancels reservation
//        4. Staff updates status of reservation
//         */
//       // if (data.type === "newOrUpdatedReservation"){
//       //   const reservationId = data.reservationId;
//       //   if (Number(data.reservationId) === Number(displayedReservation.reservationId)){
//       //     dispatch(retrieveReservation(reservationId, null))
//       //   }
//       //   dispatch(retrieveUpcomingReservations(staff.store, null))
//   };
//
//   return <></>;
// }
