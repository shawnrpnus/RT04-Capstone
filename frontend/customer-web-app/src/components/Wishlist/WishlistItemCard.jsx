import React from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Layout/components/Grid/GridItem";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import Card from "components/UI/Card/Card";
import shoppingCartStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle.js";
import makeStyles from "@material-ui/core/styles/makeStyles";
import colours from "assets/colours";
import CardHeader from "components/UI/Card/CardHeader";
import { DeleteSharp } from "@material-ui/icons";

const _ = require("lodash");
const useStyles = makeStyles(shoppingCartStyle);

function WishlistItemCard(props) {
  const colorNames = _.keyBy(colours, "hex");
  const classes = useStyles();
  const { productVariant } = props;
  const { product } = productVariant;

  return (
    <Card plain>
      <GridContainer style={{ textAlign: "left" }}>
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
        <GridItem md={8}>
          <h3 className={classes.title}>
            {product.productName}
            <DeleteSharp />
          </h3>
          <h3 style={{ marginTop: "10px" }}>${product.price}</h3>
          <h5>{colorNames[productVariant.colour].name}</h5>
          <h5>{productVariant.sizeDetails.productSize}</h5>
        </GridItem>
        <GridItem md={2}>
          <IconButton style={{ marginTop: "-15%" }}>
            <CancelIcon style={{ color: "red" }} />
          </IconButton>
        </GridItem>
      </GridContainer>
    </Card>
  );
}

export default WishlistItemCard;
