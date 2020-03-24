import React, { useState, useEffect } from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, ScrollView, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ReservationCard from "src/screens/Reservation/ReservationCard";
import { retrieveUpcomingReservations } from "src/redux/actions/reservationActions";

const { width, height } = Dimensions.get("window");

function Reservations(props) {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const reservations = useSelector(
    state => state.reservation.upcomingReservations
  );
  const staff = useSelector(state => state.staff.loggedInStaff);

  useEffect(() => {
    if (staff) {
      dispatch(retrieveUpcomingReservations(staff.store.storeId));
    }
  }, [staff]);

  const onRefresh = () => {
    setRefreshing(true);
    if (staff) {
      dispatch(retrieveUpcomingReservations(staff.store.storeId, setRefreshing));
    }
  };
  return (
    <Block flex={1} center>
      <ScrollView
        style={{ height: height }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reservations &&
          reservations.map(reservation => (
            <ReservationCard
              key={reservation.reservationId}
              reservation={reservation}
            />
          ))}
        {reservations && reservations.length === 0 && (
          <Text h4 style={{textAlign: "center", marginTop: 40}}>There are no upcoming reservations</Text>
        )}
      </ScrollView>
    </Block>
  );
}

export default Reservations;
