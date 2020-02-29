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
import { useParams } from "react-router-dom";
import FilterBar from "components/Shop/FilterBar";

const _ = require("lodash");

const useStyles = makeStyles(styles);

export default function ProductPage(props) {
  //Hooks
  const classes = useStyles();
  const { rootCategoryName, subCategoryName, leafCategoryName } = useParams();

  //Redux
  const dispatch = useDispatch();
  const productDetails = useSelector(
    state => state.product.displayedProductDetails
  );
  const rootCategories = useSelector(state => state.category.rootCategories);

  //State

  //Effects
  useEffect(() => {
    if (rootCategories) {
      dispatch(
        retrieveProductsDetails(
          null,
          getCategoryIdFromPath(
            rootCategoryName,
            subCategoryName,
            leafCategoryName
          )
        )
      );
    }
  }, [rootCategories, rootCategoryName, subCategoryName, leafCategoryName]);

  const getCategoryIdFromPath = (
    rootCategoryName,
    subCategoryName,
    leafCategoryName
  ) => {
    if (rootCategoryName && subCategoryName) {
      const rc = _.find(rootCategories, { categoryName: rootCategoryName });
      const sc = _.find(rc.childCategories, { categoryName: subCategoryName });
      if (leafCategoryName) {
        return _.find(sc.childCategories, {
          categoryName: leafCategoryName
        }).categoryId;
      } else {
        return sc.categoryId;
      }
    }
  };

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

  return (
    <div className={classNames(classes.main, classes.mainRaised)}>
      <div className={classes.section}>
        <div className={classes.container}>
          <h2>Find what you need</h2>
          <GridContainer>
            <GridItem md={3} sm={3}>
              <FilterBar />
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
