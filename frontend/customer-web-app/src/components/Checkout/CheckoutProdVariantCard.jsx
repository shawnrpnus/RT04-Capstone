import React from "react";
import Card from "components/UI/Card/Card";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Layout/components/Grid/GridItem";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import checkoutStyle from "assets/jss/material-kit-pro-react/views/checkoutStyle";
import colourList from "assets/colours.json";

const _ = require("lodash");
const jsonColorHexList = _.keyBy(colourList, "hex");

const useStyles = makeStyles(checkoutStyle);

function CheckoutProdVariantCard(props) {
  const classes = useStyles();

  const { cartItem, index, customer } = props;
  const {
    productImages,
    product,
    sizeDetails,
    colour,
    productVariantId
  } = cartItem.productVariant;
  const { productName, discountedPrice, price } = product;
  const { quantity } = cartItem;
  return (
    <div>
      <Card plain>
        <GridContainer alignItems="center" style={{ textAlign: "center" }}>
          {/* Photo */}
          <Grid item xs={12} md={2}>
            {/* Modified CSS */}
            <div className={classes.imgContainer}>
              <img
                className={classes.img}
                src={productImages[1].productImageUrl}
              />
            </div>
          </Grid>
          {/* Name */}
          <GridItem xs={12} container md={6} style={{ textAlign: "left" }}>
            <GridItem md={12}>
              <h3 className={classes.productName}>{productName}</h3>
            </GridItem>
            <GridItem xs={6} md={12}>
              <h3 style={{ marginTop: "10px" }}>
                {discountedPrice && <span>${discountedPrice}</span>}
                <span className={discountedPrice && classes.discountedPrice}>
                  ${price}
                </span>
              </h3>
            </GridItem>
            <GridItem md={12}>
              {jsonColorHexList[colour].name}, {sizeDetails.productSize}
            </GridItem>
          </GridItem>
          {/* Quantity */}
          <GridItem xs={6} md={1}>
            <h3>{quantity}</h3>
          </GridItem>
          {/* Amount */}
          <GridItem xs={6} md={3}>
            {discountedPrice && (
              <h3 style={{ marginBottom: discountedPrice ? 0 : "10px" }}>
                ${(discountedPrice * quantity).toFixed(2)}
              </h3>
            )}
            <h3
              className={discountedPrice && classes.discountedPrice}
              style={{ marginTop: discountedPrice ? 0 : "20px" }}
            >
              ${(price * quantity).toFixed(2)}
            </h3>
          </GridItem>
        </GridContainer>
      </Card>
      {index !== customer.onlineShoppingCart.shoppingCartItems.length - 1 && (
        <Divider style={{ margin: "0 5%" }} />
      )}
    </div>
  );
}

export default CheckoutProdVariantCard;
