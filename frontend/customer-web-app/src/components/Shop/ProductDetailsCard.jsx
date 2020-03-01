import React, { useState } from "react";
import classNames from "classnames";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import ImageGallery from "react-image-gallery";
import Accordion from "components/UI/Accordion/Accordion";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "components/UI/CustomButtons/Button";
import { ShoppingCart } from "@material-ui/icons";
import productStyle from "assets/jss/material-kit-pro-react/views/productStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import colours from "assets/colours";

const _ = require("lodash");
const useStyles = makeStyles(productStyle);

function ProductDetailsCard(props) {
  const colorNames = _.keyBy(colours, "hex");
  const classes = useStyles();
  const { productDetail } = props;

  const [activeColourIndex, setActiveColourIndex] = useState(0);

  const extractProductInformation = productDetail => {
    if (!productDetail) return {};
    const { product, colourToSizeImageMaps } = productDetail;

    // below used to link image set to colour clicked by mapping this list of objects to
    // colour boxes and the image set + size boxes
    const colourAndSizeToVariantAndStockMap = {};
    const colourToImageAndSizes = colourToSizeImageMaps.map(csiMap => {
      colourAndSizeToVariantAndStockMap[csiMap.colour] = _.keyBy(
        csiMap.sizeMaps,
        "size"
      );
      const imageSet = csiMap.productImages.map(prodImage => {
        return {
          original: prodImage.productImageUrl,
          thumbnail: prodImage.productImageUrl
        };
      });
      return {
        colour: csiMap.colour,
        imageSet: imageSet,
        sizes: csiMap.sizeMaps.map(sizeMap => sizeMap.size)
      };
    });
    return {
      product,
      colourToImageAndSizes,
      colourAndSizeToVariantAndStockMap
    };
  };

  const {
    product,
    colourToImageAndSizes,
    colourAndSizeToVariantAndStockMap
  } = extractProductInformation(productDetail);

  const [selectedColour, setSelectedColour] = React.useState(
    colourToImageAndSizes[activeColourIndex].colour
  );
  const [selectedSize, setSelectedSize] = React.useState(
    colourToImageAndSizes[activeColourIndex].sizes[0]
  );

  console.log(colourAndSizeToVariantAndStockMap);
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem md={6} sm={6}>
          <ImageGallery
            showFullscreenButton={false}
            showPlayButton={false}
            startIndex={3}
            items={colourToImageAndSizes[activeColourIndex].imageSet}
          />
        </GridItem>
        <GridItem md={6} sm={6}>
          <h2 className={classes.title}>{product.productName}</h2>
          <h3 className={classes.mainPrice}>${product.price}</h3>
          <Accordion
            active={0}
            activeColor="rose"
            collapses={[
              {
                title: "Description",
                content: <p>{product.description}</p>
              },
              {
                title: "Stock Information",
                content: (
                  <p>{`Stock: ${_.get(
                    colourAndSizeToVariantAndStockMap,
                    `${selectedColour}.${selectedSize}.productStock.quantity`
                  )}`}</p>
                )
              }
            ]}
          />
          <GridContainer className={classes.pickSize}>
            <GridItem md={6} sm={6}>
              <h5>Select color</h5>
              <h6>Selected: {colorNames[selectedColour].name}</h6>
              {colourToImageAndSizes.map((cis, index) => {
                return (
                  <svg
                    key={cis.colour + index}
                    width="40"
                    style={{ margin: "0 2px", cursor: "pointer" }}
                    height="40"
                    onClick={() => {
                      setSelectedColour(cis.colour);
                      setActiveColourIndex(index);
                    }}
                  >
                    <rect
                      width="40"
                      height="40"
                      style={{
                        fill: "white",
                        strokeWidth: activeColourIndex === index ? 4 : 1,
                        stroke: activeColourIndex === index ? "black" : "grey"
                      }}
                    />
                    <rect
                      x="4"
                      y="4"
                      width="32"
                      height="32"
                      style={{ fill: cis.colour }}
                    />
                  </svg>
                );
              })}
            </GridItem>
            <GridItem md={6} sm={6}>
              <h5>Select size</h5>
              <h6>Selected: {selectedSize}</h6>
              {colourToImageAndSizes[activeColourIndex].sizes.map(
                (size, index) => {
                  return (
                    <svg
                      key={size + index}
                      width="40"
                      style={{ margin: "0 2px", cursor: "pointer" }}
                      height="40"
                      onClick={() => setSelectedSize(size)}
                    >
                      <rect
                        width="40"
                        height="40"
                        style={{
                          fill: "white",
                          strokeWidth: selectedSize === size ? 4 : 1,
                          stroke: selectedSize === size ? "black" : "grey"
                        }}
                      />
                      <text
                        x="50%"
                        y="50%"
                        style={{
                          dominantBaseline: "middle",
                          textAnchor: "middle",
                          fontWeight: "bold"
                        }}
                      >
                        {size}
                      </text>
                    </svg>
                  );
                }
              )}
            </GridItem>
          </GridContainer>
          <GridContainer className={classes.pullRight}>
            <Button round color="rose">
              Add to Cart &nbsp; <ShoppingCart />
            </Button>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  );
}

export default ProductDetailsCard;
