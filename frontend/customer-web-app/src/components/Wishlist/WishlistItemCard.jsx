import React from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import Card from "components/UI/Card/Card";
import shoppingCartStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle.js";
import makeStyles from "@material-ui/core/styles/makeStyles";
import colours from "assets/colours";
import { Button } from "components/UI/CustomButtons/Button";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import {
  CancelOutlined,
  DeleteSharp,
  AddShoppingCartSharp
} from "@material-ui/icons";

const _ = require("lodash");
const useStyles = makeStyles(shoppingCartStyle);

function WishlistItemCard(props) {
  const colorNames = _.keyBy(colours, "hex");
  const classes = useStyles();
  const { productVariant } = props;
  const { product } = productVariant;
  const hasStock = productVariant.productStocks[0].quantity > 0;
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
              <Button color="primary" disabled={!hasStock}>
                <AddShoppingCartSharp />
                Add to shopping cart
              </Button>
              <Button color="primary">
                <AddShoppingCartSharp />
                Add to reservation cart
              </Button>
              <Button color="danger">
                <DeleteSharp />
                Remove
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </Card>
  );
}

export default WishlistItemCard;
