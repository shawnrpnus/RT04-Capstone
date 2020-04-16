import React, { useState } from "react";
import * as PropTypes from "prop-types";
import GridItem from "components/Layout/components/Grid/GridItem";
import Card from "components/UI/Card/Card";
import CardHeader from "components/UI/Card/CardHeader";
import CardBody from "components/UI/Card/CardBody";

import styles from "assets/jss/material-kit-pro-react/views/ecommerceSections/productsStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import colourList from "assets/colours.json";
import Chip from "@material-ui/core/Chip";
import GridContainer from "components/Layout/components/Grid/GridContainer";

const _ = require("lodash");
const useStyles = makeStyles(styles);

function ProductCard(props) {
  const classes = useStyles();
  const product = _.get(props, "productDetail.product");
  const colourToImageAndSizes = _.get(
    props,
    "productDetail.colourToImageAndSizes"
  );
  const [activeColourIndex, setActiveColourIndex] = useState(0);
  const [isHoverFavorite, setIsHoverFavorite] = useState(false);
  const { discountedPrice } = props;
  const storeForRecommendation = props.storeForRecommendation;

  return (
    <GridItem md={3} sm={6} xs={6}>
      <Card plain product style={{ marginBottom: "50px" }}>
        <CardHeader noShadow image>
          <Link to={`/shop/product/${product.productId}`}>
            <img
              src={_.get(colourToImageAndSizes[activeColourIndex], "image", "")}
              alt="productImage"
              style={{ height: "auto", width: "100%", objectFit: "cover" }}
            />
          </Link>
          {/*<Tooltip*/}
          {/*  id="tooltip-top"*/}
          {/*  title="Add to Wishlist"*/}
          {/*  placement="left"*/}
          {/*  classes={{ tooltip: classes.tooltip }}*/}
          {/*>*/}
          {/*  <IconButton*/}
          {/*    className={classes.heartIconBtn}*/}
          {/*    onMouseEnter={() => setIsHoverFavorite(true)}*/}
          {/*    onMouseLeave={() => setIsHoverFavorite(false)}*/}
          {/*  >*/}
          {/*    {isHoverFavorite ? (*/}
          {/*      <Favorite style={{ color: "#e91e63", margin: "0" }} />*/}
          {/*    ) : (*/}
          {/*      <FavoriteBorder style={{ color: "#e91e63", margin: "0" }} />*/}
          {/*    )}*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}
        </CardHeader>
        <CardBody className={classes.cardBodyPlain}>
          <Link to={`/shop/product/${product.productId}`}>
            <GridContainer justify="space-between" style={{ height: "90px" }}>
              <GridItem xs={7}>
                <h6 className={classes.cardTitle}>{product.productName}</h6>
              </GridItem>
              <GridItem xs>
                <h6 className={classes.price}>
                  {discountedPrice && (
                    <span>${props.discountedPrice.toFixed(2)}</span>
                  )}
                  <span className={discountedPrice && classes.discountedPrice}>
                    ${product.price.toFixed(2)}
                  </span>
                </h6>
              </GridItem>
            </GridContainer>
          </Link>
          <div className={classes.textLeft}>
            <GridContainer justify="space-between">
              <GridItem xs={12}>
                {colourToImageAndSizes.map((cis, index) => {
                  return (
                    <svg
                      key={cis.colour + index}
                      width="30"
                      height="20"
                      style={{ marginRight: "3px" }}
                      onMouseEnter={() => setActiveColourIndex(index)}
                    >
                      <rect
                        width="30"
                        height="20"
                        style={{
                          fill: cis.colour,
                          strokeWidth: cis.colour === "#FFFFFF" ? 2 : 0,
                          stroke: cis.colour === "#FFFFFF" ? "black" : "none",
                        }}
                      />
                    </svg>
                  );
                })}
              </GridItem>
              <GridItem md={12}>
                {_.get(
                  colourToImageAndSizes[activeColourIndex],
                  "sizes",
                  []
                ).map((size, index) => {
                  return (
                    <Chip
                      className={classes.sizeChip}
                      key={product.productId + size}
                      variant="outlined"
                      size="small"
                      label={size}
                      style={{ marginRight: "3px" }}
                    />
                  );
                })}
              </GridItem>
            </GridContainer>
            {storeForRecommendation &&
              storeForRecommendation.map((e) => {
                if (product.productId === e.productId)
                  return (
                    <h6
                      className={classes.cardTitle}
                      style={{ color: "#4C9A2A" }}
                      key={e.productId}
                    >
                      {e.numOfAvailableColour} colour(s) is in stock at{" "}
                      {e.store.storeName}{" "}
                    </h6>
                  );
              })}
          </div>
        </CardBody>
      </Card>
    </GridItem>
  );
}

ProductCard.propTypes = {
  productDetail: PropTypes.object.isRequired,
};

export default ProductCard;
