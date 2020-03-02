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
import ReservationCartItem from "components/Reservation/ReservationCartItem";

const useStyles = makeStyles(wishlistStyle);

export default function WishlistPage(props) {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const { reservationCartItems } = customer;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const clearReservationCart = () => {
    dispatch(clearReservationCartAPI(customer.customerId, enqueueSnackbar));
    setPopoverOpen(false);
  };

  const clearConfirmation = e => {
    setAnchorEl(e.currentTarget);
    setPopoverOpen(true);
  };

  return (
    <div>
      <Parallax
        image={require("assets/img/examples/bg2.jpg")}
        filter="dark"
        small
      >
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={8}
              sm={8}
              className={classNames(
                classes.mlAuto,
                classes.mrAuto,
                classes.textCenter
              )}
            >
              <h2 className={classes.mainTitle}>My Reservation Cart</h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <Card plain>
            <CardBody plain>
              <GridContainer>
                <GridItem md={6}>
                  {reservationCartItems.length > 0 ? (
                    <React.Fragment>
                      <Button
                        color="primary"
                        style={{ float: "left", marginBottom: "20px" }}
                        onClick={clearConfirmation}
                      >
                        <DeleteSharp />
                        Clear reservation cart
                      </Button>
                      {reservationCartItems.map(productVariant => (
                        <React.Fragment>
                          <ReservationCartItem
                            productVariant={productVariant}
                          />
                          <Divider />
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ) : (
                    <h3 style={{ textAlign: "center" }}>
                      Your reservation cart is empty.
                    </h3>
                  )}
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </div>
      </div>
      <Popper
        open={popoverOpen}
        anchorEl={anchorEl}
        style={{ zIndex: "2000" }}
        placement="bottom"
      >
        <ClickAwayListener onClickAway={() => setPopoverOpen(false)}>
          <Paper style={{ padding: "5px" }}>
            <h5 style={{ textAlign: "center", marginBottom: "0" }}>Clear?</h5>
            <Button color="danger" onClick={clearReservationCart}>
              Yes
            </Button>
            <Button onClick={() => setPopoverOpen(false)}>No</Button>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
