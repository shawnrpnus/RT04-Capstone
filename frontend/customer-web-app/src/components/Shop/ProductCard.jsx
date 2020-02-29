import React, { useState } from "react";
import * as PropTypes from "prop-types";
import suit1 from "assets/img/examples/suit-1.jpg";
import Tooltip from "@material-ui/core/Tooltip";
import Favorite from "@material-ui/icons/Favorite";
import GridItem from "components/Layout/components/Grid/GridItem";
import Card from "components/UI/Card/Card";
import CardHeader from "components/UI/Card/CardHeader";
import CardBody from "components/UI/Card/CardBody";

import styles from "assets/jss/material-kit-pro-react/views/ecommerceSections/productsStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import CardFooter from "components/UI/Card/CardFooter";
import Button from "components/UI/CustomButtons/Button";
import { Link } from "react-router-dom";
import colourList from "assets/colours.json";
import Crop75Icon from "@material-ui/icons/Crop75";
import Chip from "@material-ui/core/Chip";
import GridContainer from "components/Layout/components/Grid/GridContainer";

const _ = require("lodash");
const useStyles = makeStyles(styles);
const jsonColorHexList = _.keyBy(colourList, "hex");

function ProductCard(props) {
  const classes = useStyles();
  const product = _.get(props, "productDetail.product");
  const colourToImageAndSizes = _.get(
    props,
    "productDetail.colourToImageAndSizes"
  );
  const [activeColourIndex, setActiveColourIndex] = useState(0);
  return (
    <GridItem md={4} sm={6} xs={12}>
      <Card plain product>
        <CardHeader noShadow image>
          <Link to={`/product${product.productId}`}>
            <img
              src={colourToImageAndSizes[activeColourIndex].image}
              alt="productImage"
            />
          </Link>
        </CardHeader>
        <CardBody className={classes.cardBodyPlain}>
          <Link to={`/product${product.productId}`}>
            <GridContainer justify="space-between">
              <GridItem xs={8} style={{ marginBottom: "15px" }}>
                <h4 className={classes.cardTitle}>{product.productName}</h4>
              </GridItem>
              <GridItem xs>
                <h4 className={classes.price}>${product.price}</h4>
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
                      width="25"
                      height="15"
                      style={{ marginRight: "3px" }}
                      onMouseEnter={() => setActiveColourIndex(index)}
                    >
                      <rect
                        width="25"
                        height="15"
                        style={{ fill: cis.colour }}
                      />
                    </svg>
                  );
                })}
              </GridItem>
              <GridItem xs>
                {colourToImageAndSizes[activeColourIndex].sizes.map(
                  (size, index) => {
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
                  }
                )}
              </GridItem>
              <GridItem xs={4} style={{ float: "right" }}>
                <Tooltip
                  id="tooltip-top"
                  title="Add to Wishlist"
                  placement="left"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Chip
                    className={classes.heartChip}
                    icon={<Favorite style={{ color: "#e91e63" }} />}
                    size="small"
                  />
                </Tooltip>
              </GridItem>
            </GridContainer>
          </div>
        </CardBody>
      </Card>
    </GridItem>
  );
}

ProductCard.propTypes = {
  productDetail: PropTypes.object.isRequired
};

export default ProductCard;
