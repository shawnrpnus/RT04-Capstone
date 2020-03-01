import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Parallax from "components/UI/Parallax/Parallax";
import productStyle from "assets/jss/material-kit-pro-react/views/productStyle.js";
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
import { makeStyles } from "@material-ui/core/styles";
import colours from "assets/colours";

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
              <ProductDetailsCard productDetail={currentProductDetail} />
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default ProductDetailsPage;
