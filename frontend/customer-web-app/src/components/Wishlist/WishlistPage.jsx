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
import WishlistItemCard from "components/Wishlist/WishlistItemCard";
import Divider from "@material-ui/core/Divider";
import { Button } from "components/UI/CustomButtons/Button";
import { DeleteSharp, ShoppingCart } from "@material-ui/icons";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { useSnackbar } from "notistack";
import {
  clearWishlistAPI,
  moveWishlistToShoppingCartAPI
} from "redux/actions/customerActions";

const useStyles = makeStyles(wishlistStyle);

export default function WishlistPage(props) {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // Redux dispatch to call actions
  const dispatch = useDispatch();
  // Redux mapping state to props
  const errors = useSelector(state => state.errors);
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const { wishlistItems } = customer;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const clearWishlist = () => {
    dispatch(clearWishlistAPI(customer.customerId, enqueueSnackbar));
    setPopoverOpen(false);
  };

  const clearConfirmation = e => {
    setAnchorEl(e.currentTarget);
    setPopoverOpen(true);
  };

  const isSomeNoStock = () => {
    return wishlistItems.some(productVariant => {
      const hasStock = productVariant.productStocks[0].quantity > 0;
      if (!hasStock) return true;
    });
  };

  const moveWishlistToShoppingCart = () => {
    const someNoStock = isSomeNoStock();
    if (someNoStock) {
      enqueueSnackbar("Some wishlist items are out of stock", {
        variant: "error",
        autoHideDuration: 1200
      });
      return;
    }
    dispatch(
      moveWishlistToShoppingCartAPI(customer.customerId, enqueueSnackbar)
    );
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
              <h2 className={classes.mainTitle}>My Wishlist</h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <Card plain>
            <CardBody plain>
              {wishlistItems.length > 0 ? (
                <React.Fragment>
                  <Button
                    color="primary"
                    style={{ float: "right" }}
                    disabled={isSomeNoStock()}
                    onClick={moveWishlistToShoppingCart}
                  >
                    <ShoppingCart />
                    Move all to shopping cart
                  </Button>
                  <Button
                    color="primary"
                    style={{ float: "right" }}
                    onClick={clearConfirmation}
                  >
                    <DeleteSharp />
                    Clear wishlist
                  </Button>
                  {wishlistItems.map(productVariant => (
                    <React.Fragment>
                      <WishlistItemCard productVariant={productVariant} />
                      <Divider />
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ) : (
                <h3 style={{ textAlign: "center" }}>Your wishlist is empty.</h3>
              )}
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
            <Button color="danger" onClick={clearWishlist}>
              Yes
            </Button>
            <Button onClick={() => setPopoverOpen(false)}>No</Button>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
