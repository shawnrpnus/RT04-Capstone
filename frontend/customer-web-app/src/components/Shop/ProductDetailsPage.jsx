import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Parallax from "components/UI/Parallax/Parallax";
import productStyle from "assets/jss/material-kit-pro-react/views/productStyle.js";
import ProductDetailsCard from "components/Shop/ProductDetailsCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { retrieveProductById } from "redux/actions/productActions";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

const _ = require("lodash");
const useStyles = makeStyles(productStyle);

function ProductDetailsPage(props) {
  const classes = useStyles();
  const { productId } = useParams();

  const dispatch = useDispatch();
  const currentProductDetail = useSelector(
    state => state.product.currentProductDetail
  );

  const [isLoading, setIsLoading] = useState(true);
  //Make API call to retrieve single prod from url param
  useEffect(() => {
    setIsLoading(true);
    dispatch(retrieveProductById(productId, setIsLoading));
  }, [productId]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

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
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    )
  );
}

export default ProductDetailsPage;
