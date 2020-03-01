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
import { Favorite, FavoriteBorder, ShoppingCart } from "@material-ui/icons";
import productStyle from "assets/jss/material-kit-pro-react/views/productStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import colours from "assets/colours";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import { useDispatch, useSelector } from "react-redux";
import { updateShoppingCart } from "redux/actions/shoppingCartActions";
import UpdateShoppingCartRequest from "models/ShoppingCart/UpdateShoppingCartRequest";
import { useSnackbar } from "notistack";
import IconButton from "@material-ui/core/IconButton";

const _ = require("lodash");
const useStyles = makeStyles(productStyle);

function ProductDetailsCard(props) {
  const colorNames = _.keyBy(colours, "hex");
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { productDetail } = props;

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

  const [activeColourIndex, setActiveColourIndex] = useState(0);
  const [selectedColour, setSelectedColour] = React.useState(
    colourToImageAndSizes[activeColourIndex].colour
  );
  const [selectedSize, setSelectedSize] = React.useState("None");
  const [isHoverFavorite, setIsHoverFavorite] = useState(false);

  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);

  const addToShoppingCart = () => {
    if (selectedSize === "None") {
      enqueueSnackbar("Please select a size", {
        variant: "error",
        autoHideDuration: 1200
      });
      return;
    }
    const productVariantId = _.get(
      colourAndSizeToVariantAndStockMap,
      `${selectedColour}.${selectedSize}.productVariantId`
    );
    const shoppingCartItems = customer.onlineShoppingCart.shoppingCartItems;
    const prodVariantIdToCartItem = _.keyBy(
      shoppingCartItems,
      "productVariant.productVariantId"
    );
    let quantity = 1;
    if (prodVariantIdToCartItem.hasOwnProperty(productVariantId)) {
      quantity = prodVariantIdToCartItem[productVariantId].quantity + 1;
    }
    console.log(prodVariantIdToCartItem);
    console.log(quantity);
    const customerId = customer.customerId;
    const cartType = "online";
    const req = new UpdateShoppingCartRequest(
      quantity,
      productVariantId,
      customerId,
      cartType
    );
    dispatch(updateShoppingCart(req, enqueueSnackbar));
  };

  return (
    <React.Fragment>
      <GridContainer>
        <GridItem md={6} sm={6}>
          <ImageGallery
            showFullscreenButton={false}
            showPlayButton={false}
            startIndex={0}
            thumbnailPosition="left"
            items={colourToImageAndSizes[activeColourIndex].imageSet}
          />
        </GridItem>
        <GridItem md={6} sm={6}>
          <h2 className={classes.title}>
            {product.productName}
            <Tooltip
              id="tooltip-top"
              title="Add to Wishlist"
              placement="left"
              classes={{ tooltip: classes.tooltip }}
            >
              <IconButton
                className={classes.heartIconBtn}
                onMouseEnter={() => setIsHoverFavorite(true)}
                onMouseLeave={() => setIsHoverFavorite(false)}
              >
                {isHoverFavorite ? (
                  <Favorite style={{ color: "#e91e63", margin: "0" }} />
                ) : (
                  <FavoriteBorder style={{ color: "#e91e63", margin: "0" }} />
                )}
              </IconButton>
            </Tooltip>
          </h2>
          <h3 className={classes.mainPrice}>${product.price}</h3>
          <Accordion
            active={[0]}
            activeColor="rose"
            collapses={[
              {
                title: "Description",
                content: (
                  <p>
                    {product.description}
                    <br />
                    <br />
                    {product.tags.map(tag => (
                      <Chip label={tag.name} style={{ marginRight: "3px" }} />
                    ))}
                  </p>
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
                  const stock = _.get(
                    colourAndSizeToVariantAndStockMap,
                    `${selectedColour}.${size}.productStock.quantity`
                  );
                  const hasStock = stock > 0;
                  return (
                    <Tooltip title={hasStock ? "In stock" : "Out of stock"}>
                      <svg
                        key={size + index}
                        width="40"
                        style={{
                          margin: "0 2px",
                          cursor: hasStock ? "pointer" : "default"
                        }}
                        height="40"
                        onClick={
                          hasStock ? () => setSelectedSize(size) : () => {}
                        }
                      >
                        <rect
                          width="40"
                          height="40"
                          style={{
                            fill: hasStock ? "white" : "grey",
                            pointerEvents: hasStock ? "click" : "none",
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
                        {!hasStock && (
                          <React.Fragment>
                            {/*<line x1="0" y1="0" x2="40" y2="40" stroke="red" />*/}
                            <line
                              x1="0"
                              y1="40"
                              x2="40"
                              y2="0"
                              stroke="black"
                            />
                          </React.Fragment>
                        )}
                      </svg>
                    </Tooltip>
                  );
                }
              )}
            </GridItem>
            <GridItem md={12} sm={12} style={{ marginTop: "10px" }}>
              <Button
                color="primary"
                onClick={addToShoppingCart}
                style={{ float: "right", width: "245px" }}
              >
                Add to Shopping Cart &nbsp; <ShoppingCart />
              </Button>
            </GridItem>
            <GridItem md={12} sm={12}>
              <Button
                color="primary"
                onClick={addToShoppingCart}
                style={{ float: "right", width: "245px" }}
              >
                Add to Reservation Cart &nbsp; <ShoppingCart />
              </Button>
            </GridItem>
          </GridContainer>
          {/*<GridContainer className={classes.pullRight}>*/}
          {/*  <Button round color="rose" onClick={addToShoppingCart}>*/}
          {/*    Add to Cart &nbsp; <ShoppingCart />*/}
          {/*  </Button>*/}
          {/*</GridContainer>*/}
        </GridItem>
      </GridContainer>
    </React.Fragment>
  );
}

export default ProductDetailsCard;
