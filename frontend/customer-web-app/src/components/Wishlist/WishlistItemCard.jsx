import React, { useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import Card from "components/UI/Card/Card";
import wishtlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle.js";
import makeStyles from "@material-ui/core/styles/makeStyles";
import colours from "assets/colours";
import { Button } from "components/UI/CustomButtons/Button";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import {
  CancelOutlined,
  DeleteSharp,
  AddShoppingCartSharp
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlistAPI } from "redux/actions/customerActions";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { useSnackbar } from "notistack";
import UpdateShoppingCartRequest from "models/shoppingCart/UpdateShoppingCartRequest";
import { updateShoppingCart } from "redux/actions/shoppingCartActions";

const _ = require("lodash");
const useStyles = makeStyles(wishtlistStyle);

function WishlistItemCard(props) {
  const colorNames = _.keyBy(colours, "hex");
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const { productVariant } = props;
  const { product } = productVariant;
  const hasStock = productVariant.productStocks[0].quantity > 0;

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const removeFromWishlist = () => {
    dispatch(
      removeFromWishlistAPI(
        customer.customerId,
        productVariant.productVariantId,
        enqueueSnackbar
      )
    );
    setPopoverOpen(false);
  };

  const deleteConfirmation = e => {
    setAnchorEl(e.currentTarget);
    setPopoverOpen(true);
  };

  const moveToShoppingCart = () => {
    const shoppingCartItems = customer.onlineShoppingCart.shoppingCartItems;
    const prodVariantIdToCartItem = _.keyBy(
      shoppingCartItems,
      "productVariant.productVariantId"
    );
    let quantity = 1;
    if (
      prodVariantIdToCartItem.hasOwnProperty(productVariant.productVariantId)
    ) {
      quantity =
        prodVariantIdToCartItem[productVariant.productVariantId].quantity + 1;
    }
    const customerId = customer.customerId;
    const cartType = "online";
    const req = new UpdateShoppingCartRequest(
      quantity,
      productVariant.productVariantId,
      customerId,
      cartType
    );
    dispatch(updateShoppingCart(req, enqueueSnackbar, removeFromWishlistAPI));
  };

  return (
    <Card plain>
      <GridContainer style={{ textAlign: "left", alignItems: "center" }}>
        {/* Photo */}
        <GridItem md={2}>
          {/* Modified CSS */}
          <div className={classes.imgContainer}>
            <img
              className={classes.img}
              src={productVariant.productImages[0].productImageUrl}
              alt="ProdImg"
            />
          </div>
        </GridItem>
        <GridItem md={10}>
          <GridContainer>
            <GridItem md={12}>
              <h3 className={classes.title}>{product.productName}</h3>
            </GridItem>
            <GridItem md={12}>
              <h3 style={{ marginTop: "10px" }}>${product.price}</h3>
            </GridItem>
            <GridItem md={12}>
              <h5>
                {colorNames[productVariant.colour].name},{" "}
                {productVariant.sizeDetails.productSize}
                {"  "}
              </h5>
            </GridItem>
            <GridItem md={12}>
              <h5
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {hasStock ? (
                  <React.Fragment>
                    <CheckCircleOutlineIcon style={{ fill: "green" }} /> In
                    stock
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <CancelOutlined style={{ fill: "red" }} /> Out of stock
                  </React.Fragment>
                )}
              </h5>
            </GridItem>
            <GridItem md={12}>
              <Button
                color="primary"
                disabled={!hasStock}
                onClick={moveToShoppingCart}
              >
                <AddShoppingCartSharp />
                Move to shopping cart
              </Button>
              <Button color="primary">
                <AddShoppingCartSharp />
                Add to reservation cart
              </Button>
              <Button color="danger" onClick={deleteConfirmation}>
                <DeleteSharp />
                Remove
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>

        <Popper
          open={popoverOpen}
          anchorEl={anchorEl}
          style={{ zIndex: "2000" }}
          placement="top"
        >
          <ClickAwayListener onClickAway={() => setPopoverOpen(false)}>
            <Paper style={{ padding: "5px" }}>
              <h5 style={{ textAlign: "center", marginBottom: "0" }}>
                Remove?
              </h5>
              <Button color="danger" onClick={removeFromWishlist}>
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

export default WishlistItemCard;
