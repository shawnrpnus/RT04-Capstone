import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// plugin that creates slider
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui icons
// core components
import GridContainer from "components/Layout/components/Grid/GridContainer.js";
import GridItem from "components/Layout/components/Grid/GridItem.js";

import styles from "assets/jss/material-kit-pro-react/views/ecommerceSections/productsStyle.js";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "components/Shop/ProductCard";
import { retrieveProductsDetails } from "redux/actions/productActions";
import { useParams } from "react-router-dom";
import Parallax from "components/UI/Parallax/Parallax";
import fashionImg from "assets/img/examples/clark-street-merc.jpg";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import Drawer from "@material-ui/core/Drawer";
import FilterBar from "components/Shop/FilterBar";
import { SwipeableDrawer } from "@material-ui/core";

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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

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

  const secondWord = leafCategoryName ? leafCategoryName : subCategoryName;
  return (
    <div>
      <Parallax image={fashionImg} filter="dark" small>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={8}
              sm={8}
              className={classNames(
                classes.mlAuto,
                classes.mrAuto,
                classes.textCenter
              )}
            >
              <div className={classes.brand}>
                <h1 className={classes.title}>
                  {`${rootCategoryName}'s ${secondWord}`}
                </h1>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <Fab
        color="secondary"
        variant="extended"
        className={classes.floatingFilter}
        onClick={() => setFilterDrawerOpen(true)}
      >
        <EditIcon />
        Filter
      </Fab>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.section}>
          <div className={classes.container}>
            <GridContainer>
              {/*<GridItem md={3} sm={3}>*/}
              {/*  <FilterBar />*/}
              {/*</GridItem>*/}
              <Drawer
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                className={classes.filterDrawer}
                classes={{ paper: classes.filterDrawer }}
              >
                <FilterBar />
              </Drawer>
              <GridItem md={12} sm={9}>
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
    </div>
  );
}
