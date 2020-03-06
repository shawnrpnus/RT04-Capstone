import React, { useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import ImageGallery from "react-image-gallery";
import Accordion from "components/UI/Accordion/Accordion";
import Button from "components/UI/CustomButtons/Button";
import { Favorite, FavoriteBorder, ShoppingCart } from "@material-ui/icons";
import productStyle from "assets/jss/material-kit-pro-react/views/productStyle.js";
import makeStyles from "@material-ui/core/styles/makeStyles";
import colours from "assets/colours";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import { useDispatch, useSelector } from "react-redux";
import { updateShoppingCart } from "redux/actions/shoppingCartActions";
import UpdateShoppingCartRequest from "models/shoppingCart/UpdateShoppingCartRequest";
import { useSnackbar } from "notistack";
import IconButton from "@material-ui/core/IconButton";
import { isProductVariantInList } from "services/customerService";
import {
  addToReservationCartAPI,
  addToWishlistAPI
} from "redux/actions/customerActions";

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
    const productVariantId = getCurrentProductVariantId();
    const shoppingCartItems = customer.onlineShoppingCart.shoppingCartItems;
    const prodVariantIdToCartItem = _.keyBy(
      shoppingCartItems,
      "productVariant.productVariantId"
    );
    let quantity = 1;
    if (prodVariantIdToCartItem.hasOwnProperty(productVariantId)) {
      quantity = prodVariantIdToCartItem[productVariantId].quantity + 1;
    }
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

  const addToWishlist = () => {
    if (!customer) {
      enqueueSnackbar("Please login to add to your wishlist!", {
        variant: "error",
        autoHideDuration: 1200
      });
      return;
    }
    if (selectedSize === "None") {
      enqueueSnackbar("Please select a size", {
        variant: "error",
        autoHideDuration: 1200
      });
      return;
    }
    const productVariantId = getCurrentProductVariantId();
    const currentWishlist = customer.wishlistItems;
    if (isProductVariantInList(productVariantId, currentWishlist)) {
      enqueueSnackbar("Already in wishlist!", {
        variant: "error",
        autoHideDuration: 1200
      });
      return;
    }
    const customerId = customer.customerId;
    dispatch(addToWishlistAPI(customerId, productVariantId, enqueueSnackbar));
  };

  const getCurrentProductVariantId = () => {
    return _.get(
      colourAndSizeToVariantAndStockMap,
      `${selectedColour}.${selectedSize}.productVariantId`
    );
  };

  const addToReservationCart = () => {
    if (selectedSize === "None") {
      enqueueSnackbar("Please select a size", {
        variant: "error",
        autoHideDuration: 1200
      });
      return;
    }
    const productVariantId = getCurrentProductVariantId();
    const currentReservationCart = customer.reservationCartItems;
    if (isProductVariantInList(productVariantId, currentReservationCart)) {
      enqueueSnackbar("Already in reservation cart!", {
        variant: "error",
        autoHideDuration: 1200
      });
      return;
    }
    const customerId = customer.customerId;
    dispatch(
      addToReservationCartAPI(customerId, productVariantId, enqueueSnackbar)
    );
  };

  const selectedStock = _.get(
    colourAndSizeToVariantAndStockMap,
    `${selectedColour}.${selectedSize}.productStock.quantity`
  );

  console.log(colourAndSizeToVariantAndStockMap);
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
              title={
                customer &&
                isProductVariantInList(
                  getCurrentProductVariantId(),
                  customer.wishlistItems
                )
                  ? "In wishlist"
                  : "Add to Wishlist"
              }
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            >
              <IconButton
                className={classes.heartIconBtn}
                onMouseEnter={() => setIsHoverFavorite(true)}
                onMouseLeave={() => setIsHoverFavorite(false)}
                onClick={addToWishlist}
              >
                {customer &&
                isProductVariantInList(
                  getCurrentProductVariantId(),
                  customer.wishlistItems
                ) ? (
                  <Favorite style={{ color: "#e91e63", margin: "0" }} />
                ) : isHoverFavorite ? (
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
                      style={{
                        fill: cis.colour,
                        strokeWidth: cis.colour == "#FFFFFF" ? 0.5 : 0,
                        stroke: cis.colour == "#FFFFFF" ? "black" : "none"
                      }}
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
                  console.log(selectedColour);
                  console.log(size);
                  console.log(stock);
                  const hasStock = stock > 0;
                  return (
                    <Tooltip title={hasStock ? "In stock" : "Out of stock"}>
                      <svg
                        key={size + index}
                        width="40"
                        style={{
                          margin: "0 2px",
                          cursor: "pointer"
                        }}
                        height="40"
                        onClick={() => setSelectedSize(size)}
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
                disabled={
                  selectedStock <= 0 || selectedSize === "None" || !customer
                }
              >
                Add to Shopping Cart &nbsp; <ShoppingCart />
              </Button>
            </GridItem>
            <GridItem md={12} sm={12}>
              <Button
                color="primary"
                onClick={addToReservationCart}
                style={{ float: "right", width: "245px" }}
                disabled={selectedSize === "None" || !customer}
              >
                Add to Reservation Cart &nbsp; <ShoppingCart />
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  );
}

export default ProductDetailsCard;
