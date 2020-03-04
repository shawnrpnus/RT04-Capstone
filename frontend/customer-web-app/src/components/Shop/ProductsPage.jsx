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
import { retrieveAllTags } from "redux/actions/tagActions";
import { FilterList } from "@material-ui/icons";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  const allTags = useSelector(state => state.tag.allTags);

  //State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Effects
  useEffect(() => {
    if (rootCategories) {
      setIsLoading(true);
      dispatch(
        retrieveProductsDetails(
          null,
          getCategoryIdFromPath(
            rootCategoryName,
            subCategoryName,
            leafCategoryName
          ),
          setIsLoading
        )
      );
    }
  }, [rootCategories, rootCategoryName, subCategoryName, leafCategoryName]);

  useEffect(() => {
    dispatch(retrieveAllTags());
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, [rootCategoryName, subCategoryName, leafCategoryName]);

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

  const colours = []; //just used for filterBar
  const productDataList = productDetails
    ? productDetails.map(productDetail => {
        const { product, colourToSizeImageMaps } = productDetail;
        const colourToImageAndSizes = colourToSizeImageMaps.map(csiMap => {
          if (!colours.includes(csiMap.colour)) {
            colours.push(csiMap.colour);
          }
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
  console.log(colours);
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
        <FilterList />
        Refine
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
                {allTags && rootCategories && (
                  <FilterBar
                    allTags={allTags}
                    allColours={colours}
                    categoryId={getCategoryIdFromPath(
                      rootCategoryName,
                      subCategoryName,
                      leafCategoryName
                    )}
                    setFilterDrawerOpen={setFilterDrawerOpen}
                    setIsLoading={setIsLoading}
                  />
                )}
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
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
