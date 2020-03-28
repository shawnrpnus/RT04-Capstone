import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Block, Text, Button, theme } from "galio-framework";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import ShoppingCartItem from "src/screens/ShoppingCart/ShoppingCartItem";
import materialTheme from "src/constants/Theme";
import {refreshCustomer} from "src/redux/actions/customerActions";

const { width, height } = Dimensions.get("window");

function ShoppingCart(props) {
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

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
    return <ShoppingCartItem shoppingCartItem={item} customer={customer} />;
  };

  const renderEmpty = () => {
    return (
      <Text h5 style={{ padding: 20 }}>
        Your shopping cart is empty. Scan a QR code to get started!
      </Text>
    );
  };

  return (
    <Block flex={1} center style={styles.cart}>
      {customer && (
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
          <Block
            flex={0.2}
            center
            style={{
              ...styles.footer,
              paddingHorizontal: theme.SIZES.BASE,
              width: "100%",
              padding: 20,
              borderTopColor: "lightgrey",
              borderTopWidth: 1
            }}
          >
            <Block flex row space="between" style={{ width: "100%" }}>
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
              color={materialTheme.COLORS.BUTTON_COLOR}
            >
              GO TO CHECKOUT
            </Button>
          </Block>
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
    marginBottom: 8
  },
  footer: {
    backgroundColor: "white"
  }
});

export default ShoppingCart;
