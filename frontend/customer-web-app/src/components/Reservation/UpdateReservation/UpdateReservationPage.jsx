/*eslint-disable*/
import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// redux
import { useDispatch, useSelector } from "react-redux";
// core components
import Parallax from "components/UI/Parallax/Parallax.js";
import GridContainer from "components/Layout/components/Grid/GridContainer.js";
import GridItem from "components/Layout/components/Grid/GridItem.js";
import Card from "components/UI/Card/Card";
import CardBody from "components/UI/Card/CardBody";

import wishlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle.js";
import Divider from "@material-ui/core/Divider";
import { Button } from "components/UI/CustomButtons/Button";
import { DeleteSharp, ShoppingCart } from "@material-ui/icons";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { useSnackbar } from "notistack";
import { clearReservationCartAPI } from "redux/actions/customerActions";
import ReservationCartItem from "components/Reservation/ReservationCart/ReservationCartItem";
import ReservationBooking from "components/Reservation/ReservationBooking/ReservationBooking";
import {
  clearProductVariantStoreStockStatus,
  retrieveReservationById
} from "redux/actions/reservationActions";
import { useParams } from "react-router-dom";
import UpdateReservationBooking from "components/Reservation/UpdateReservation/UpdateReservationBooking";
import UpdateReservationItem from "components/Reservation/UpdateReservation/UpdateReservationItem";

const useStyles = makeStyles(wishlistStyle);

export default function UpdateReservationPage(props) {
  //Hooks
  const classes = useStyles();
  const { mode, reservationId } = useParams();

  //Redux
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const { reservationCartItems } = customer;
  const reservationToUpdate = useSelector(
    state => state.reservation.reservationToUpdate,
    _.isEqual
  );
  const productVariants = _.get(reservationToUpdate, "productVariants");

  //State
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(clearProductVariantStoreStockStatus());
  }, []);

  //For updating, get the reservation to update
  useEffect(() => {
    if (reservationId) {
      dispatch(retrieveReservationById(reservationId));
    }
  }, [reservationId]);

  return (
    <div>
      {/*<div className={classNames(classes.main, classes.mainRaised)}>*/}
      {/*  <div className={classes.container}>*/}
      <Card plain style={{ marginTop: 0 }}>
        <CardBody plain>
          <GridContainer>
            <GridItem md>
              {productVariants &&
                productVariants.length > 0 &&
                productVariants.map(productVariant => (
                  <React.Fragment>
                    <UpdateReservationItem productVariant={productVariant} />
                    {productVariants.length > 1 && <Divider />}
                  </React.Fragment>
                ))}
            </GridItem>
            <Divider orientation="vertical" flexItem />
            <GridItem md>
              {mode === "update" && <UpdateReservationBooking />}
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
