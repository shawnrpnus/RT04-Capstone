import React, { useEffect } from "react";
import { Block } from "galio-framework";
import {Alert, Dimensions, InteractionManager, ScrollView} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ProductVarAttributesCard from "src/screens/ProductDetails/ProductVarAttributesCard";
import {
  retrieveProductStockById,
  retrieveStocksForProductVariant
} from "src/redux/actions/productVariantActions";
import ImageCarousel from "src/components/ImageCarousel";
import StocksCard from "src/screens/ProductDetails/StocksCard";
import Theme from "src/constants/Theme";
import { FAB } from "react-native-paper";
import { updateInStoreShoppingCart } from "src/redux/actions/customerActions";
import {useFocusEffect} from "@react-navigation/native";
import {RESET_CURRENT_STORE_AND_PSID} from "src/redux/actions/types";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function ProductDetails(props) {
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const productVariant = useSelector(
    state => state.product.displayedProductVariant
  );
  const stocks = useSelector(state => state.product.stocks);
  const store = useSelector(state => state.customer.currentStore);
  const currentProductStockId = useSelector(
    state => state.customer.currentProductStockId
  );

  useEffect(() => {
    if (productVariant) {
      dispatch(
        retrieveStocksForProductVariant(productVariant.productVariantId)
      );
    }
  }, [productVariant]);

  useFocusEffect(
      React.useCallback(() => {
        return () => {
          dispatch({type: RESET_CURRENT_STORE_AND_PSID})
        };
      }, [])
  );

  const handleAddToCart = async () => {
    const productStock = await retrieveProductStockById(currentProductStockId);
    if (productStock) {
      if (productStock.quantity === 0) {
        Alert.alert(
          "Out of Stock",
          "Product is out of stock!",
          [
            {
              text: "Ok",
              onPress: () => setAlertOpen(false)
            }
          ],
          { cancelable: false }
        );
      } else {
        const productVariantId = productStock.productVariant.productVariantId;
        const shoppingCartItems =
          customer.inStoreShoppingCart.shoppingCartItems;
        const prodVariantIdToCartItem = _.keyBy(
          shoppingCartItems,
          "productVariant.productVariantId"
        );
        let quantity = 1;
        if (prodVariantIdToCartItem.hasOwnProperty(productVariantId)) {
          quantity = prodVariantIdToCartItem[productVariantId].quantity + 1;
        }
        dispatch(
          updateInStoreShoppingCart(
            quantity,
            productVariantId,
            customer.customerId,
            productStock.store.storeId,
            null,
            alert("Added to cart!")
          )
        );
      }
    }
  };

  return (
    <Block flex={1} center>
      <ScrollView
        style={{ height: height }}
        showsVerticalScrollIndicator={false}
      >
        {productVariant && (
          <>
            <ImageCarousel productVariant={productVariant} />
            <ProductVarAttributesCard productVariant={productVariant} />
            {store && <StocksCard stocks={stocks} store={store} />}
          </>
        )}
      </ScrollView>
      {store && (
        <FAB
          style={{
            position: "absolute",
            margin: 10,
            right: 0,
            bottom: 0,
            backgroundColor: Theme.COLORS.PRIMARY,
            backgroundOpacity: 0.5,
            opacity: 0.8
          }}
          icon="plus"
          onPress={() => handleAddToCart()}
        />
      )}
    </Block>
  );
}

export default ProductDetails;
