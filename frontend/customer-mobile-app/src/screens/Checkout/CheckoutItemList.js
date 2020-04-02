import React, { useEffect } from "react";
import { Block, Text } from "galio-framework";
import { getShoppingCartItemsStock } from "src/redux/actions/customerActions";
import { useDispatch, useSelector } from "react-redux";
import LineItem from "src/screens/Checkout/LineItem";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

function CheckoutItemList(props) {
  const { useWarehouseStock, customer, setLoading } = props;
  const dispatch = useDispatch();
  const shoppingCartItemsStock = useSelector(
    state => state.customer.shoppingCartItemsStock
  );

  useEffect(() => {
    if (customer) {
      if (useWarehouseStock) {
        dispatch(getShoppingCartItemsStock(customer.customerId, true, setLoading));
      } else {
        dispatch(getShoppingCartItemsStock(customer.customerId, null, setLoading));
      }
    }
  }, [customer, useWarehouseStock]);
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
      <Text h5 bold style={{marginBottom: 5}}>
        Items
      </Text>
      {customer &&
        customer.inStoreShoppingCart.shoppingCartItems.map(shoppingCartItem => (
          <LineItem
            shoppingCartItem={shoppingCartItem}
            shoppingCartItemsStock={shoppingCartItemsStock}
          />
        ))}
    </Block>
  );
}

export default CheckoutItemList;
