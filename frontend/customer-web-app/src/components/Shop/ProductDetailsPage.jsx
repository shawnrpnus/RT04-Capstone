import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Parallax from "components/UI/Parallax/Parallax";
import productStyle from "assets/jss/material-kit-pro-react/views/productStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import ProductDetailsCard from "components/Shop/ProductDetailsCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { retrieveProductById } from "redux/actions/productActions";
import GridItem from "components/Layout/components/Grid/GridItem";
import ImageGallery from "react-image-gallery";
import Accordion from "components/UI/Accordion/Accordion";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "components/UI/CustomButtons/Button";
import { ShoppingCart } from "@material-ui/icons";

const _ = require("lodash");
const useStyles = makeStyles(productStyle);

function ProductDetailsPage(props) {
  const classes = useStyles();
  const { productId } = useParams();

  const dispatch = useDispatch();
  const currentProductDetail = useSelector(
    state => state.product.currentProductDetail
  );

  //Make API call to retrieve single prod from url param
  useEffect(() => {
    dispatch(retrieveProductById(productId));
  }, [productId]);

  const [colorSelect, setColorSelect] = React.useState("0");
  const [sizeSelect, setSizeSelect] = React.useState("0");
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
  } = extractProductInformation(currentProductDetail);

  return (
    currentProductDetail && (
      <div className={classes.productPage}>
        <Parallax
          image={require("assets/img/bg6.jpg")}
          filter="rose"
          className={classes.pageHeader}
        />
        <div className={classNames(classes.section, classes.sectionGray)}>
          <div className={classes.container}>
            <div className={classNames(classes.main, classes.mainRaised)}>
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
                      }
                    ]}
                  />
                  <GridContainer className={classes.pickSize}>
                    <GridItem md={6} sm={6}>
                      <label>Select color</label>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={colorSelect}
                          onChange={event => setColorSelect(event.target.value)}
                          inputProps={{
                            name: "colorSelect",
                            id: "color-select"
                          }}
                        >
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="0"
                          >
                            Rose
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="1"
                          >
                            Gray
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="2"
                          >
                            White
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem md={6} sm={6}>
                      <label>Select size</label>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={sizeSelect}
                          onChange={event => setSizeSelect(event.target.value)}
                          inputProps={{
                            name: "sizeSelect",
                            id: "size-select"
                          }}
                        >
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="0"
                          >
                            Small
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="1"
                          >
                            Medium
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="2"
                          >
                            Large
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer className={classes.pullRight}>
                    <Button round color="rose">
                      Add to Cart &nbsp; <ShoppingCart />
                    </Button>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default ProductDetailsPage;
