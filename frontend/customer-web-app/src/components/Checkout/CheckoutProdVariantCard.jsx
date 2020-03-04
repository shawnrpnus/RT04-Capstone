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
  const { quantity } = cartItem;
  return (
    <div>
      <Card plain>
        <GridContainer alignItems="center" style={{ textAlign: "center" }}>
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
          <GridItem container md={6} style={{ textAlign: "left" }}>
            <GridItem md={12}>
              <h3 className={classes.productName}>{product.productName}</h3>
            </GridItem>
            <GridItem md={12}>
              <h3 style={{ marginTop: "10px" }}>${product.price}</h3>
            </GridItem>
            <GridItem md={12}>
              {jsonColorHexList[colour].name}, {sizeDetails.productSize}
            </GridItem>
          </GridItem>
          {/* Quantity */}
          <GridItem md={1}>
            <h3>{quantity}</h3>
          </GridItem>
          {/* Amount */}
          <GridItem md={3}>
            <h3>${(product.price * quantity).toFixed(2)}</h3>
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
