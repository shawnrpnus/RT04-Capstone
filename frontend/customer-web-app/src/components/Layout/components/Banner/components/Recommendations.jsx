import React, { useEffect } from "react";
import GridItem from "components/Layout/components/Grid/GridItem";
import { filterProducts } from "redux/actions/productActions";
import ProductCard from "components/Shop/ProductCard";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import { useDispatch, useSelector } from "react-redux";
import FilterProductRequest from "models/product/FilterProductRequest";
import Card from "components/UI/Card/Card";

const _ = require("lodash");

function Recommendations(props) {
  const { customer, classes } = props;
  const dispatch = useDispatch();
  const productDetails = useSelector(
    (state) => state.product.displayedProductDetails
  );

  useEffect(() => {
    if (customer) {
      const style = {
        styleId: customer.style.styleId,
        styleName: customer.style.styleName,
        stylePreference: customer.style.stylePreference,
        gender: customer.style.gender,
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
    ? productDetails.map((productDetail) => {
        const { product, colourToSizeImageMaps } = productDetail;
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
        };
      })
    : [];

  return (
    <GridItem
      xs={12}
      sm={12}
      md={12}
      style={{ backgroundColor: "white", paddingTop: "10px" }}
    >
      <h2
        className={classes.title}
        style={{ textAlign: "center", marginTop: "10px" }}
      >
        Recommended For You
      </h2>
      <Card plain>
        <GridContainer style={{ marginLeft: "42px", marginRight: "42px" }}>
          {productDataList &&
            productDataList
              .slice(0, 4)
              .map((productDetail) => (
                <ProductCard
                  productDetail={productDetail}
                  key={productDetail.product.productId}
                />
              ))}
        </GridContainer>
      </Card>
    </GridItem>
  );
}

export default Recommendations;
