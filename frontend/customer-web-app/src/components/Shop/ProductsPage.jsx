import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// plugin that creates slider
import Slider from "nouislider";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// @material-ui icons
import Cached from "@material-ui/icons/Cached";
import Check from "@material-ui/icons/Check";
// core components
import Accordion from "components/UI/Accordion/Accordion.js";
import GridContainer from "components/Layout/components/Grid/GridContainer.js";
import GridItem from "components/Layout/components/Grid/GridItem.js";
import Card from "components/UI/Card/Card.js";
import CardBody from "components/UI/Card/CardBody.js";
import Button from "components/UI/CustomButtons/Button.js";
import Clearfix from "components/UI/Clearfix/Clearfix.js";

import styles from "assets/jss/material-kit-pro-react/views/ecommerceSections/productsStyle.js";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "components/Shop/ProductCard";
import { retrieveProductsDetails } from "redux/actions/productActions";

const _ = require("lodash");

const useStyles = makeStyles(styles);

export default function ProductPage(props) {
  //Hooks
  const classes = useStyles();

  //Redux
  const dispatch = useDispatch();
  const productDetails = useSelector(
    state => state.product.displayedProductDetails
  );

  //State
  const [checked, setChecked] = React.useState([1, 9, 27]);
  const [priceRange, setPriceRange] = React.useState([101, 790]);

  //Effects
  useEffect(() => {
    if (
      !document
        .getElementById("sliderRegular")
        .classList.contains("noUi-target")
    ) {
      Slider.create(document.getElementById("sliderRegular"), {
        start: priceRange,
        connect: true,
        range: { min: 30, max: 900 },
        step: 1
      }).on("update", function(values) {
        setPriceRange([Math.round(values[0]), Math.round(values[1])]);
      });
    }
    return function cleanup() {};
  });

  useEffect(() => {
    dispatch(retrieveProductsDetails());
  }, []);

  const productDataList = productDetails
    ? productDetails.map(productDetail => {
        const { product, colourToSizeImageMaps } = productDetail;
        const colourToImageAndSizes = colourToSizeImageMaps.map(csiMap => {
          return {
            colour: csiMap.colour,
            image: _.get(csiMap, "productImages[0].productImageUrl"),
            sizes: csiMap.sizeMaps.map(sizeMap => sizeMap.size)
          };
        });
        return {
          product,
          colourToImageAndSizes
        };
      })
    : [];

  const handleToggle = value => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  return (
    <div className={classNames(classes.main, classes.mainRaised)}>
      <div className={classes.section}>
        <div className={classes.container}>
          <h2>Find what you need</h2>
          <GridContainer>
            <GridItem md={3} sm={3}>
              <Card plain>
                <CardBody className={classes.cardBodyRefine}>
                  <h4 className={classes.cardTitle + " " + classes.textLeft}>
                    Refine
                    <Tooltip
                      id="tooltip-top"
                      title="Reset Filter"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <Button
                        link
                        justIcon
                        size="sm"
                        className={
                          classes.pullRight + " " + classes.refineButton
                        }
                      >
                        <Cached />
                      </Button>
                    </Tooltip>
                    <Clearfix />
                  </h4>
                  <Accordion
                    active={[0, 2]}
                    activeColor="rose"
                    collapses={[
                      {
                        title: "Price Range",
                        content: (
                          <CardBody className={classes.cardBodyRefine}>
                            <span
                              className={classNames(
                                classes.pullLeft,
                                classes.priceSlider
                              )}
                            >
                              €{priceRange[0]}
                            </span>
                            <span
                              className={classNames(
                                classes.pullRight,
                                classes.priceSlider
                              )}
                            >
                              €{priceRange[1]}
                            </span>
                            <br />
                            <br />
                            <div id="sliderRegular" className="slider-rose" />
                          </CardBody>
                        )
                      },
                      {
                        title: "Clothing",
                        content: (
                          <div className={classes.customExpandPanel}>
                            <div
                              className={
                                classes.checkboxAndRadio +
                                " " +
                                classes.checkboxAndRadioHorizontal
                              }
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(1)}
                                    checked={
                                      checked.indexOf(1) !== -1 ? true : false
                                    }
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Blazers"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(2)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Casual Shirts"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(3)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Formal Shirts"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(4)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Jeans"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(5)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Polos"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(6)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Pyjamas"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(7)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Shorts"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(8)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Trousers"
                              />
                            </div>
                          </div>
                        )
                      },
                      {
                        title: "Designer",
                        content: (
                          <div className={classes.customExpandPanel}>
                            <div
                              className={
                                classes.checkboxAndRadio +
                                " " +
                                classes.checkboxAndRadioHorizontal
                              }
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(9)}
                                    checked={
                                      checked.indexOf(9) !== -1 ? true : false
                                    }
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="All"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(10)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Polo Ralph Lauren"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(11)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Wooyoungmi"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(12)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Alexander McQueen"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(13)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Tom Ford"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(14)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="AMI"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(15)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Berena"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(16)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Thom Sweeney"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(17)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Burberry Prorsum"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(18)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Calvin Klein"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(19)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Kingsman"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(20)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Club Monaco"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(21)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Dolce & Gabbana"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(22)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Gucci"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(23)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Biglioli"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(24)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Lanvin"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(25)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Loro Piana"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(26)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Massimo Alba"
                              />
                            </div>
                          </div>
                        )
                      },
                      {
                        title: "Colour",
                        content: (
                          <div className={classes.customExpandPanel}>
                            <div
                              className={
                                classes.checkboxAndRadio +
                                " " +
                                classes.checkboxAndRadioHorizontal
                              }
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(27)}
                                    checked={
                                      checked.indexOf(27) !== -1 ? true : false
                                    }
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="All"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(28)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Black"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(29)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Blue"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(30)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Brown"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(31)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Gray"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(32)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Green"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(33)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Neutrals"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    tabIndex={-1}
                                    onClick={() => handleToggle(34)}
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={
                                      <Check
                                        className={classes.uncheckedIcon}
                                      />
                                    }
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot
                                    }}
                                  />
                                }
                                classes={{ label: classes.label }}
                                label="Purple"
                              />
                            </div>
                          </div>
                        )
                      }
                    ]}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={9} sm={9}>
              <GridContainer>
                {productDataList &&
                  productDataList.map(productDetail => (
                    <ProductCard
                      productDetail={productDetail}
                      key={productDetail.product.productId}
                    />
                  ))}
              </GridContainer>
            </GridItem>
          </GridContainer>
          <br />
        </div>
      </div>
    </div>
  );
}
