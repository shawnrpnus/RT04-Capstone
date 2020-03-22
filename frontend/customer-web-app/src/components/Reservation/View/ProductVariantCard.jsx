import React from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import Card from "components/UI/Card/Card";
import wishtlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle.js";
import makeStyles from "@material-ui/core/styles/makeStyles";
import colours from "assets/colours";

const _ = require("lodash");
const useStyles = makeStyles(wishtlistStyle);

function ProductVariantCard(props) {
  const colorNames = _.keyBy(colours, "hex");
  const classes = useStyles();
  const {
    productVariant,
    initialSubTotal,
    finalSubTotal,
    quantity,
    detail
  } = props;
  const { product } = productVariant;
  const { productName, discountedPrice, price } = product;

  return (
    <Card plain style={{ margin: "5px 0" }}>
      <GridContainer style={{ textAlign: "left", alignItems: "center" }}>
        {/* Photo */}
        <GridItem md={2} xs={6}>
          {/* Modified CSS */}
          <div className={classes.imgContainer} style={{ width: "90%" }}>
            <img
              className={classes.img}
              src={productVariant.productImages[0].productImageUrl}
              alt="ProdImg"
            />
          </div>
        </GridItem>
        <GridItem md={10} xs={6}>
          <GridContainer>
            <GridItem md={12}>
              <h5 className={classes.title}>
                {productName} {quantity && `(${quantity})`}
              </h5>
            </GridItem>
            <GridItem md={12}>
              {initialSubTotal ? (
                <h5 style={{ margin: "3px 0" }}>
                  {finalSubTotal && (
                    <span>
                      {detail
                        ? `${finalSubTotal / quantity}`
                        : `${finalSubTotal}`}
                    </span>
                  )}
                  <span className={finalSubTotal && classes.discountedPrice}>
                    {detail
                      ? `${initialSubTotal / quantity}`
                      : `${initialSubTotal}`}
                  </span>
                </h5>
              ) : (
                <h5 style={{ margin: "3px 0" }}>
                  {discountedPrice && <span>${discountedPrice}</span>}
                  <span className={discountedPrice && classes.discountedPrice}>
                    ${price}
                  </span>
                </h5>
              )}
            </GridItem>
            <GridItem md={12}>
              <h5 style={{ margin: "3px 0" }}>
                {colorNames[productVariant.colour].name},{" "}
                {productVariant.sizeDetails.productSize}
              </h5>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </Card>
  );
}

export default ProductVariantCard;
