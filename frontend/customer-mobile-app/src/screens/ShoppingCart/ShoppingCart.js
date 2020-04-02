import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Block, Text, Button, theme } from "galio-framework";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import ShoppingCartItem from "src/screens/ShoppingCart/ShoppingCartItem";
import materialTheme from "src/constants/Theme";
import {
  getShoppingCartItemsStock,
  refreshCustomer
} from "src/redux/actions/customerActions";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function ShoppingCart(props) {
  const { navigation } = props;
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const shoppingCartItemsStock = useSelector(
    state => state.customer.shoppingCartItemsStock
  );
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (customer) {
      dispatch(getShoppingCartItemsStock(customer.customerId));
    }
  }, [customer]);

  const refresh = () => {
    if (customer) {
      setRefreshing(true);
      dispatch(refreshCustomer(customer.customerId, setRefreshing));
    }
  };

  const renderHeader = () => {
    // return <Text h4>Shopping Cart</Text>;
    return <></>;
  };

  const renderItem = ({ item }) => {
    return (
      <ShoppingCartItem
        shoppingCartItem={item}
        customer={customer}
        shoppingCartItemsStock={shoppingCartItemsStock}
      />
    );
  };

  const allInStock = shoppingCartItemsStock => {
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

  const renderEmpty = () => {
    return (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        Your shopping cart is empty.{"\n"}
        Scan a QR code to get started!
      </Text>
    );
  };

  return (
    <Block flex={1} center style={styles.cart}>
      {customer && shoppingCartItemsStock && (
        <>
          <Block flex>
            <FlatList
              data={customer.inStoreShoppingCart.shoppingCartItems}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) =>
                `${index}-${item.shoppingCartItemId}`
              }
              ListEmptyComponent={renderEmpty()}
              ListHeaderComponent={renderHeader()}
              onRefresh={refresh}
              refreshing={refreshing}
            />
          </Block>
          {customer.inStoreShoppingCart.shoppingCartItems.length > 0 && (
            <Block
              flex={0.3}
              center
              style={{
                ...styles.footer,
                paddingHorizontal: theme.SIZES.BASE,
                width: "100%",
                padding: 20,
                paddingTop: 10,
                paddingBottom: 10,
                borderTopColor: "lightgrey",
                borderTopWidth: 1
              }}
            >
              <Text h5 style={{ fontSize: 16, color: "grey" }}>
                You are shopping at{" "}
                {customer.inStoreShoppingCart.store.storeName}
              </Text>
              <Block
                flex
                row
                space="between"
                style={{ width: "100%", marginBottom: 5, alignItems: "center" }}
              >
                <Text h4 style={{ fontWeight: "bold", fontSize: 20 }}>
                  Total
                </Text>
                <Text h4 style={{ fontWeight: "bold", fontSize: 20 }}>
                  ${customer.inStoreShoppingCart.finalTotalAmount}
                </Text>
              </Block>
              <Button
                flex
                style={styles.checkout}
                color={
                  allInStock(shoppingCartItemsStock)
                    ? materialTheme.COLORS.BUTTON_COLOR
                    : "lightgrey"
                }
                disabled={!allInStock(shoppingCartItemsStock)}
                onPress={() => navigation.navigate("Checkout")}
              >
                GO TO CHECKOUT
              </Button>
              {!allInStock(shoppingCartItemsStock) && (
                <Text h6 style={{ color: "red" }}>
                  Some of your items are out of stock!
                </Text>
              )}
            </Block>
          )}
        </>
      )}
    </Block>
  );
}

const styles = StyleSheet.create({
  cart: {
    width: width
  },
  divider: {
    height: 1,
    backgroundColor: materialTheme.COLORS.INPUT,
    marginVertical: theme.SIZES.BASE
  },
  checkout: {
    height: theme.SIZES.BASE * 3,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    marginBottom: 5
  },
  footer: {
    backgroundColor: "white"
  }
});

export default ShoppingCart;
