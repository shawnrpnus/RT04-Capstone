import React, { useEffect } from "react";
import { Block, Text } from "galio-framework";
import { getShoppingCartItemsStock } from "src/redux/actions/customerActions";
import { useDispatch, useSelector } from "react-redux";
import LineItem from "src/screens/Checkout/LineItem";
import { Dimensions } from "react-native";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function CheckoutItemList(props) {
  const { useWarehouseStock, customer, setLoading,setOutOfStock } = props;
  const dispatch = useDispatch();
  const shoppingCartItemsStock = useSelector(
    state => state.customer.shoppingCartItemsStock
  );

  useEffect(() => {
    if (customer) {
      if (useWarehouseStock) {
        dispatch(
          getShoppingCartItemsStock(customer.customerId, true, setLoading)
        );
      } else {
        dispatch(
          getShoppingCartItemsStock(customer.customerId, null, setLoading)
        );
      }
    }
  }, [customer, useWarehouseStock]);

  useEffect(() => {
    if (shoppingCartItemsStock){
      setOutOfStock(!allInStock());
    }
  }, [shoppingCartItemsStock]);

  const allInStock = () => {
    let hasNoStock = false;
    _.forOwn(shoppingCartItemsStock, (value, key) => {
      if (value.quantity === 0) hasNoStock = true;
    });
    customer.inStoreShoppingCart.shoppingCartItems.forEach(shoppingCartItem => {
      const stock = _.get(
          shoppingCartItemsStock,
          `${shoppingCartItem.shoppingCartItemId}.quantity`
      );
      if (stock && shoppingCartItem.quantity > stock) {
        hasNoStock = true;
      }
    });
    return !hasNoStock;
  };

  return (
    <Block
      flex
      card
      style={{
        backgroundColor: "white",
        width: width,
        marginTop: 8,
        padding: 12,
        borderRadius: 0
      }}
    >
      <Text h5 bold style={{ marginBottom: 5 }}>
        Items
      </Text>
      {customer &&
        customer.inStoreShoppingCart.shoppingCartItems.map(shoppingCartItem => (
          <LineItem
            shoppingCartItem={shoppingCartItem}
            shoppingCartItemsStock={shoppingCartItemsStock}
            key={shoppingCartItem.shoppingCartItemId}
          />
        ))}
    </Block>
  );
}

export default CheckoutItemList;
