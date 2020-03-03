import React, { useEffect } from "react";
import CardBody from "components/UI/Card/CardBody";
import Card from "components/UI/Card/Card";
import Divider from "@material-ui/core/Divider";
import { useDispatch, useSelector } from "react-redux";
import { getPastReservations } from "redux/actions/reservationActions";
import ReservationItem from "components/Reservation/View/ReservationItem";

const _ = require("lodash");

function PastReservations(props) {
  const dispatch = useDispatch();
  const pastReservations = useSelector(
    state => state.reservation.pastReservations,
    _.isEqual
  );
  const customer = useSelector(state => state.customer.loggedInCustomer);

  useEffect(() => {
    dispatch(getPastReservations(customer.customerId));
  }, [pastReservations]);

  return (
    <Card plain style={{ marginTop: "-10px" }}>
      <CardBody plain style={{ paddingTop: "0" }}>
        {pastReservations && pastReservations.length > 0 ? (
          pastReservations.map(reservation => (
            <React.Fragment>
              <ReservationItem reservation={reservation} isPast={true} />
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <h3 style={{ textAlign: "center" }}>
            You do not have any past reservations.
          </h3>
        )}
      </CardBody>
    </Card>
  );
}

export default PastReservations;
