import React from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import Card from "components/UI/Card/Card";
import wishlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle.js";
import makeStyles from "@material-ui/core/styles/makeStyles";
import colours from "assets/colours";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { CancelOutlined } from "@material-ui/icons";
import { useSelector } from "react-redux";

const _ = require("lodash");
const useStyles = makeStyles(wishlistStyle);

function UpdateReservationItem(props) {
  const colorNames = _.keyBy(colours, "hex");
  const classes = useStyles();

  //Redux
  const prodVariantToStoreStock = useSelector(
    state => state.reservation.prodVariantToStoreStock
  );
  const { productVariant } = props;
  const { product } = productVariant;
  const { productName, discountedPrice, price } = product;
  const storeStockandName =
    prodVariantToStoreStock[productVariant.productVariantId];
  return (
    <Card plain>
      <GridContainer style={{ textAlign: "left", alignItems: "center" }}>
        {/* Photo */}
        <GridItem md={4} xs={4}>
          {/* Modified CSS */}
          <div className={classes.imgContainer}>
            <img
              className={classes.img}
              src={productVariant.productImages[0].productImageUrl}
              alt="ProdImg"
            />
          </div>
        </GridItem>
        <GridItem md={8} xs={8}>
          <GridContainer>
            <GridItem md={12}>
              <h3 className={classes.title}>{productName}</h3>
            </GridItem>
            <GridItem md={12}>
              <h3 style={{ marginTop: "10px" }}>
                {discountedPrice && <span>${discountedPrice}</span>}
                <span className={discountedPrice && classes.discountedPrice}>
                  ${price}
                </span>
              </h3>
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
                {storeStockandName &&
                  (storeStockandName.quantity > 0 ? (
                    <React.Fragment>
                      <CheckCircleOutlineIcon style={{ fill: "green" }} /> In
                      stock at {storeStockandName.storeName}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <CancelOutlined style={{ fill: "red" }} /> Out of stock at{" "}
                      {storeStockandName.storeName}
                    </React.Fragment>
                  ))}
              </h5>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </Card>
  );
}

export default UpdateReservationItem;
