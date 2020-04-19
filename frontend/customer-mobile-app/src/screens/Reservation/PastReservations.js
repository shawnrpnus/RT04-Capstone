import React, {useEffect, useState} from "react";
import {Text} from "galio-framework";
import {Dimensions} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import {retrievePastReservations} from "src/redux/actions/reservationActions";
import ReservationList from "src/screens/Reservation/ReservationList";

const { width, height } = Dimensions.get("window");

function PastReservations(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const reservations = useSelector(state => state.reservation.pastReservations);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (customer) {
      dispatch(retrievePastReservations(customer.customerId, setLoading));
    }
  }, [customer.customerId]);

  const onRefresh = () => {
    if (customer) {
      dispatch(retrievePastReservations(customer.customerId, setRefreshing));
    }
  };

  const renderEmpty = () => {
    return (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        You do not have any past reservations.
      </Text>
    );
  };

  return (
    <>
      <ReservationList
        reservations={reservations}
        setLoading={setLoading}
        navigation={navigation}
        onRefresh={onRefresh}
        renderEmpty={renderEmpty}
        refreshing={refreshing}
      />
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={{ color: "white" }}
        overlayColor="rgba(0,0,0,0.75)"
      />
    </>
  );
}

export default PastReservations;
