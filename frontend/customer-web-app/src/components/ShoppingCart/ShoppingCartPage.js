/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
// redux
import { useDispatch, useSelector } from "react-redux";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import MinusBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// core components
import Parallax from "components/UI/Parallax/Parallax.js";
import GridContainer from "components/Layout/components/Grid/GridContainer.js";
import GridItem from "components/Layout/components/Grid/GridItem.js";
import Button from "components/UI/CustomButtons/Button.js";
import Card from "components/UI/Card/Card";
import CardBody from "components/UI/Card/CardBody";
import shoppingCartStyle from "assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";

import {
  updateShoppingCart,
  clearShoppingCart
} from "./../../redux/actions/shoppingCartActions";
import UpdateShoppingCartRequest from "../../models/shoppingCart/UpdateShoppingCartRequest.js";
import colourList from "assets/colours.json";
//popper
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";

const jsonColorHexList = _.keyBy(colourList, "hex");

const useStyles = makeStyles(shoppingCartStyle);

export default function ShoppingCartPage() {
  const classes = useStyles();
  const history = useHistory();
  // Redux dispatch to call actions
  const dispatch = useDispatch();
  // Redux mapping state to props
  const customer = useSelector(state => state.customer.loggedInCustomer);

  //popper
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Updating shopping cart information
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    _.get(customer, "onlineShoppingCart.shoppingCartItems", []).map(item => {
      const request = new UpdateShoppingCartRequest(
        -1,
        item.productVariant.productVariantId,
        customer.customerId,
        "online"
      );
      console.log("updating ");
      console.log(request);
      dispatch(updateShoppingCart(request));
    });
  }, []);

  useEffect(() => {
    setShoppingCartItems(
      _.get(customer, "onlineShoppingCart.shoppingCartItems", [])
    );
  }, [customer]);

  const [shoppingCartItems, setShoppingCartItems] = useState(
    _.get(customer, "onlineShoppingCart.shoppingCartItems", [])
  );

  const handleUpdateQuantity = (quantity, productVariantId, isDelete) => {
    if (isDelete) {
      quantity = 0;
    }
    const request = new UpdateShoppingCartRequest(
      quantity,
      productVariantId,
      customer.customerId,
      "online"
    );
    dispatch(updateShoppingCart(request));
  };

  const handleCheckout = () => {
    history.push("/account/checkout");
  };

  const handleClearShoppingCart = () => {
    dispatch(clearShoppingCart(customer.customerId));
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
              <h2 className={classes.title}>Shopping Cart</h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <Card plain>
            {shoppingCartItems.length > 0 ? (
              <CardBody plain>
                <h3 className={classes.cardTitle}>Shopping Cart</h3>

                <Grid container spacing={3}>
                  <Grid item md={9}>
                    {shoppingCartItems.map((cartItem, index) => {
                      const {
                        productImages,
                        product,
                        sizeDetails,
                        colour,
                        productVariantId
                      } = cartItem.productVariant;
                      const { productName, discountedPrice, price } = product;
                      console.log(product);

                      const { quantity } = cartItem;
                      return (
                        <div key={index}>
                          <Card plain>
                            <GridContainer
                              alignItems="center"
                              style={{ textAlign: "center" }}
                            >
                              {/* Photo */}
                              <Grid item md={2}>
                                {/* Modified CSS */}
                                <div className={classes.imgContainer}>
                                  <img
                                    className={classes.img}
                                    src={productImages[1].productImageUrl}
                                  />
                                </div>
                              </Grid>
                              {/* Name */}
                              <GridItem
                                container
                                md={3}
                                style={{ textAlign: "left" }}
                              >
                                <GridItem md={12}>
                                  <h3 className={classes.productName}>
                                    {productName}
                                  </h3>
                                </GridItem>
                                <GridItem md={12}>
                                  <h3 style={{ marginTop: "10px" }}>
                                    {discountedPrice && (
                                      <span>${discountedPrice}</span>
                                    )}
                                    <span
                                      className={
                                        discountedPrice &&
                                        classes.discountedPrice
                                      }
                                    >
                                      ${price}
                                    </span>
                                  </h3>
                                </GridItem>
                                <GridItem md={12}>
                                  {jsonColorHexList[colour].name},{" "}
                                  {sizeDetails.productSize}
                                </GridItem>
                              </GridItem>
                              {/* Quantity */}
                              <GridItem
                                xs={4}
                                md={1}
                                style={{ textAlign: "right" }}
                              >
                                <IconButton
                                  className={classes.buttonTopMargin}
                                  onClick={e =>
                                    handleUpdateQuantity(
                                      quantity - 1,
                                      productVariantId
                                    )
                                  }
                                >
                                  <MinusBoxIcon />
                                </IconButton>
                              </GridItem>
                              <GridItem xs={4} md={1}>
                                <h3>{quantity}</h3>
                              </GridItem>
                              <GridItem
                                xs={4}
                                md={1}
                                style={{ textAlign: "left" }}
                              >
                                <IconButton
                                  className={classes.buttonTopMargin}
                                  onClick={e =>
                                    handleUpdateQuantity(
                                      quantity + 1,
                                      productVariantId
                                    )
                                  }
                                >
                                  <AddBoxIcon />
                                </IconButton>
                              </GridItem>
                              {/* Amount */}
                              <GridItem md={2}>
                                {discountedPrice && (
                                  <h3
                                    style={{
                                      marginBottom: discountedPrice ? 0 : "10px"
                                    }}
                                  >
                                    ${(discountedPrice * quantity).toFixed(2)}
                                  </h3>
                                )}
                                <h3
                                  className={
                                    discountedPrice && classes.discountedPrice
                                  }
                                  style={{
                                    marginTop: discountedPrice ? 0 : "20px"
                                  }}
                                >
                                  ${(price * quantity).toFixed(2)}
                                </h3>
                              </GridItem>
                              {/* Action */}
                              <GridItem md={1}>
                                <IconButton
                                  className={classes.buttonTopMargin}
                                  onClick={e =>
                                    handleUpdateQuantity(
                                      e,
                                      productVariantId,
                                      true
                                    )
                                  }
                                >
                                  <CancelIcon style={{ color: "red" }} />
                                </IconButton>
                              </GridItem>
                            </GridContainer>
                          </Card>
                          <Divider style={{ margin: "0 5%" }} />
                        </div>
                      );
                    })}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      color="danger"
                      fullWidth
                      onClick={clearConfirmation}
                      style={{
                        margin: "5% 0",
                        fontSize: "20px"
                      }}
                    >
                      Clear Shopping Cart
                    </Button>
                    <Card style={{ margin: 0 }}>
                      <CardContent>
                        <Typography variant="h4" gutterBottom>
                          Total <Divider style={{ margin: "1% 0" }} />
                        </Typography>

                        <Grid container>
                          <Grid item xs={6}>
                            <Typography variant="h6" component="h2">
                              Sub-total
                            </Typography>
                          </Grid>
                          <Grid item xs={6} style={{ textAlign: "right" }}>
                            <Typography variant="h6" component="h2">
                              {customer.onlineShoppingCart.finalTotalAmount.toFixed(
                                2
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button
                          color="success"
                          fullWidth
                          onClick={handleCheckout}
                          style={{
                            margin: "5% 2%",
                            fontSize: "20px"
                          }}
                        >
                          Checkout
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              </CardBody>
            ) : (
              <h3 style={{ textAlign: "center", margin: "2%" }}>
                Your shopping cart is empty.
              </h3>
            )}
            <Popper
              open={popoverOpen}
              anchorEl={anchorEl}
              style={{ zIndex: "2000" }}
              placement="bottom"
            >
              <ClickAwayListener onClickAway={() => setPopoverOpen(false)}>
                <Paper style={{ padding: "5px" }}>
                  <h5 style={{ textAlign: "center", marginBottom: "0" }}>
                    Clear?
                  </h5>
                  <Button color="danger" onClick={handleClearShoppingCart}>
                    Yes
                  </Button>
                  <Button onClick={() => setPopoverOpen(false)}>No</Button>
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Card>
        </div>
      </div>
    </div>
  );
}
