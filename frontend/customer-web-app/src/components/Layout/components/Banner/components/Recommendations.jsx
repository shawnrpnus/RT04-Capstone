import React, { useEffect } from "react";
import classNames from "classnames";
import GridItem from "components/Layout/components/Grid/GridItem";
import {
  filterProducts,
  retrieveProductsDetails
} from "redux/actions/productActions";
import ProductCard from "components/Shop/ProductCard";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import { useDispatch, useSelector } from "react-redux";
import FilterProductRequest from "models/product/FilterProductRequest";

const _ = require("lodash");

function Recommendations(props) {
  const { customer, classes } = props;
  const dispatch = useDispatch();
  const productDetails = useSelector(
    state => state.product.displayedProductDetails
  );

  console.log(customer);
  useEffect(() => {
    if (customer) {
      const style = {
        styleId: customer.style.styleId,
        styleName: customer.style.styleName
      };
      const req = new FilterProductRequest(
        null,
        [],
        [],
        [],
        0,
        200,
        "LATEST_ARRIVAL",
        style
      );

      dispatch(filterProducts(req));
    }
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

  return (
    <GridItem xs={12} sm={12} md={12}>
      <h2 className={classes.title} style={{ textAlign: "center" }}>
        Recommended For You
      </h2>
      <GridContainer>
        {productDataList &&
          productDataList
            .slice(0, 5)
            .map(productDetail => (
              <ProductCard
                productDetail={productDetail}
                key={productDetail.product.productId}
              />
            ))}
      </GridContainer>
    </GridItem>
  );
}

export default Recommendations;
