import React, { useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { CancelOutlined, DeleteSharp, Edit } from "@material-ui/icons";
import { Button } from "components/UI/CustomButtons/Button";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Card from "components/UI/Card/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import wishlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle";
import ProductVariantCard from "components/Reservation/View/ProductVariantCard";
import Divider from "@material-ui/core/Divider";
import { useDispatch, useSelector } from "react-redux";
import { cancelReservation } from "redux/actions/reservationActions";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";

const _ = require("lodash");
const moment = require("moment");
const useStyles = makeStyles(wishlistStyle);

function ReservationItem(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { reservation, isPast } = props;

  const customer = useSelector(state => state.customer.loggedInCustomer);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const cancelConfirmation = e => {
    setAnchorEl(e.currentTarget);
    setPopoverOpen(true);
  };

  const handleCancelReservation = () => {
    dispatch(
      cancelReservation(
        reservation.reservationId,
        customer.customerId,
        enqueueSnackbar
      )
    );
    setPopoverOpen(false);
  };

  const { store } = reservation;
  const { address } = store;
  return (
    <Card plain>
      <GridContainer style={{ textAlign: "left", alignItems: "center" }}>
        <GridItem md={5} xs={12}>
          <GridContainer>
            <GridItem md={12}>
              <h3 className={classes.title}>
                {moment(reservation.reservationDateTime).format("D MMM h:mm A")}
              </h3>
            </GridItem>
            <GridItem md={12}>
              {/*<h3 style={{ marginTop: "10px" }}>Location</h3>*/}
              <h4>{store.storeName}</h4>
              <h4>{`${address.buildingName}, ${address.line1} ${address.line2} ${address.postalCode}`}</h4>
            </GridItem>
            <GridItem md={12}>
              {!isPast && (
                <React.Fragment>
                  <Link
                    to={`/account/reservation/update/${reservation.reservationId}`}
                  >
                    <Button color="primary">
                      <Edit />
                      Update
                    </Button>
                  </Link>
                  <Button color="danger" onClick={cancelConfirmation}>
                    <DeleteSharp />
                    Cancel
                  </Button>
                </React.Fragment>
              )}
              {isPast && (
                <React.Fragment>
                  <h4
                    style={
                      !reservation.attended
                        ? { color: "red" }
                        : { color: "green" }
                    }
                  >
                    Status: {reservation.attended ? "Attended" : "Unattended"}
                  </h4>
                  {!reservation.attended && (
                    <h6 style={{ color: "red" }}>
                      Warning: Multiple unattended reservations will result in a
                      temporary ban from the service.
                    </h6>
                  )}
                </React.Fragment>
              )}
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem
          md={7}
          xs={12}
          style={{ height: "200px", overflowY: "scroll" }}
        >
          {reservation.productVariants.map(productVariant => (
            <React.Fragment key={productVariant.productVariantId}>
              <ProductVariantCard productVariant={productVariant} />
              <Divider />
            </React.Fragment>
          ))}
        </GridItem>
        <Popper
          open={popoverOpen}
          anchorEl={anchorEl}
          style={{ zIndex: "1000" }}
          placement="top"
        >
          <ClickAwayListener onClickAway={() => setPopoverOpen(false)}>
            <Paper style={{ padding: "5px" }}>
              <h5 style={{ textAlign: "center", marginBottom: "0" }}>
                Cancel?
              </h5>
              <Button color="danger" onClick={handleCancelReservation}>
                Yes
              </Button>
              <Button onClick={() => setPopoverOpen(false)}>No</Button>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </GridContainer>
    </Card>
  );
}

export default ReservationItem;
