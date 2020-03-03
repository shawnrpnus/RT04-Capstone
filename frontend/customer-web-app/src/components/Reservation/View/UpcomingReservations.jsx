import React, { useEffect } from "react";
import CardBody from "components/UI/Card/CardBody";
import Card from "components/UI/Card/Card";
import WishlistItemCard from "components/Wishlist/WishlistItemCard";
import Divider from "@material-ui/core/Divider";
import { useDispatch, useSelector } from "react-redux";
import { getUpcomingReservations } from "redux/actions/reservationActions";
import ReservationItem from "components/Reservation/View/ReservationItem";

const _ = require("lodash");

function UpcomingReservations(props) {
  const dispatch = useDispatch();
  const upcomingReservations = useSelector(
    state => state.reservation.upcomingReservations,
    _.isEqual
  );
  const customer = useSelector(state => state.customer.loggedInCustomer);

  useEffect(() => {
    dispatch(getUpcomingReservations(customer.customerId));
  }, [upcomingReservations]);

  return (
    <Card plain style={{ marginTop: "-10px" }}>
      <CardBody plain style={{ paddingTop: "0" }}>
        {upcomingReservations &&
          upcomingReservations.map(reservation => (
            <React.Fragment>
              <ReservationItem reservation={reservation} />
              <Divider />
            </React.Fragment>
          ))}
      </CardBody>
    </Card>
  );
}

export default UpcomingReservations;
