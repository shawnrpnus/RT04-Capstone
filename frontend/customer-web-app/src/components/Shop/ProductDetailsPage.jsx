import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Parallax from "components/UI/Parallax/Parallax";
import productStyle from "assets/jss/material-kit-pro-react/views/productStyle.js";
import ProductDetailsCard from "components/Shop/ProductDetailsCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveProductById,
  getEligibleStoreForRecommendation,
} from "redux/actions/productActions";
import { makeStyles } from "@material-ui/core/styles";
import ReviewCard from "../Reviews/ReviewCard";
import ProductCard from "components/Shop/ProductCard";
import { retrieveAllReviewsByProductId } from "../../redux/actions/reviewAction";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { geolocated } from "react-geolocated";

const _ = require("lodash");
const useStyles = makeStyles(productStyle);

function ProductDetailsPage(props) {
  const classes = useStyles();
  const { productId } = useParams();

  const dispatch = useDispatch();
  const currentProductDetail = useSelector(
    (state) => state.product.currentProductDetail,
    _.isEqual
  );
  const storeForRecommendation = useSelector(
    (state) => state.product.storeForRecommendation,
    _.isEqual
  );

  useEffect(() => {
    if (!currentProductDetail) return;

    const productIds = currentProductDetail.recommendedProducts.map(
      (e) => e.product.productId
    );

    if (props.isGeolocationAvailable && props.coords) {
      const { latitude, longitude } = props.coords;
      setIsLoading(true);
      dispatch(
        getEligibleStoreForRecommendation(
          {
            productIds,
            lat: latitude,
            lng: longitude,
          },
          setIsLoading
        )
      );
    }
  }, [currentProductDetail]);

  const recommendedProducts = _.get(
    currentProductDetail,
    "recommendedProducts",
    []
  );

  let productDataList = [];
  if (recommendedProducts) {
    productDataList = recommendedProducts.map((productDetail) => {
      const { product, colourToSizeImageMaps, discountedPrice } = productDetail;
      const colourToImageAndSizes = colourToSizeImageMaps.map((csiMap) => {
        return {
          colour: csiMap.colour,
          image: _.get(csiMap, "productImages[0].productImageUrl"),
          sizes: csiMap.sizeMaps.map((sizeMap) => sizeMap.size),
        };
      });
      return {
        product,
        colourToImageAndSizes,
        discountedPrice,
      };
    });
  }

  const currentProductReviews = useSelector((state) => state.review.allReviews);

  const [isLoading, setIsLoading] = useState(true);
  //Make API call to retrieve single prod from url param
  useEffect(() => {
    setIsLoading(true);
    dispatch(retrieveProductById(productId, setIsLoading));
  }, [productId]);

  useEffect(() => {
    dispatch(retrieveAllReviewsByProductId(productId));
  }, [productId]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const getRandom = (dataList) => {
    let number = Math.floor(Math.random() * (productDataList.length - 3));

    if (number < 0) {
      number = 0;
    }
    return dataList.slice(number, number + 4);
  };

  return (
    <>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {currentProductDetail && (
        <div className={classes.productPage}>
          <Parallax
            image={require("assets/img/bg6.jpg")}
            filter="rose"
            className={classes.pageHeader}
          />
          <div className={classNames(classes.section, classes.sectionGray)}>
            <div className={classes.container}>
              <div className={classNames(classes.main, classes.mainRaised)}>
                <ProductDetailsCard
                  productDetail={currentProductDetail}
                  key={currentProductDetail.product.productId}
                />
                <ReviewCard reviews={currentProductReviews} />
                {productDataList.length > 0 && (
                  <>
                    <Typography
                      className={classes.title}
                      style={{ textAlign: "center" }}
                    >
                      You may also like
                    </Typography>
                    <Divider style={{ marginBottom: "5%" }} />
                    <Grid container>
                      {productDataList && productDataList.length < 4 ? (
                        <React.Fragment>
                          {productDataList.map((productDetail) => (
                            <ProductCard
                              productDetail={productDetail}
                              discountedPrice={productDetail.discountedPrice}
                              key={productDetail.product.productId}
                              storeForRecommendation={storeForRecommendation}
                            />
                          ))}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          {getRandom(productDataList).map((productDetail) => (
                            <ProductCard
                              productDetail={productDetail}
                              discountedPrice={productDetail.discountedPrice}
                              key={productDetail.product.productId}
                              storeForRecommendation={storeForRecommendation}
                            />
                          ))}
                        </React.Fragment>
                      )}
                    </Grid>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(ProductDetailsPage);
