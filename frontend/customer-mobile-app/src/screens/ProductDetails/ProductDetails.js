import React, {useEffect} from "react";
import {Block} from "galio-framework";
import {Dimensions, ScrollView} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import ProductVarAttributesCard from "src/screens/ProductDetails/ProductVarAttributesCard";
import {retrieveStocksForProductVariant} from "src/redux/actions/productVariantActions";
import ImageCarousel from "src/components/ImageCarousel";
import StocksCard from "src/screens/ProductDetails/StocksCard";

const { width, height } = Dimensions.get("window");

function ProductDetails(props) {
  const dispatch = useDispatch();
  const productVariant = useSelector(
    state => state.product.displayedProductVariant
  );
  // const stocks = useSelector(state => state.product.stocks);
  // const staff = useSelector(state => state.staff.loggedInStaff);

  useEffect(() => {
    if (productVariant) {
      dispatch(
        retrieveStocksForProductVariant(productVariant.productVariantId)
      );
    }
  }, [productVariant]);

  return (
    <Block flex={1} center>
      <ScrollView
        style={{ height: height }}
        showsVerticalScrollIndicator={false}
      >
        {productVariant && (
          <>
            <ImageCarousel productVariant={productVariant}/>
            <ProductVarAttributesCard productVariant={productVariant} />
            {/*<StocksCard stocks={stocks} store={staff.store}/>*/}
          </>
        )}
      </ScrollView>
    </Block>
  );
}

export default ProductDetails;


