import React from "react";
import { useSelector } from "react-redux";
import { Block, Text, Button, theme } from "galio-framework";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import ShoppingCartItem from "src/screens/ShoppingCart/ShoppingCartItem";
import materialTheme from "src/constants/Theme";

const { width, height } = Dimensions.get("window");

function ShoppingCart(props) {
  const customer = useSelector(state => state.customer.loggedInCustomer);

  const renderHeader = () => {
    // return <Text h4>Shopping Cart</Text>;
    return <></>;
  };

  const renderItem = ({ item }) => {
    return <ShoppingCartItem shoppingCartItem={item} customer={customer} />;
  };

  const renderFooter = () => {
    return (
      <Block flex style={styles.footer}>
        <Block style={{ marginHorizontal: theme.SIZES.BASE }}>
          <Block style={styles.divider} />
        </Block>
        <Block center style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Button
            flex
            center
            style={styles.checkout}
            color={materialTheme.COLORS.BUTTON_COLOR}
          >
            PROCEED TO CHECKOUT
          </Button>
        </Block>
      </Block>
    );
  };

  const renderEmpty = () => {
    return (
      <Text h5>
        Your shopping cart is empty. Scan a QR code to get started!
      </Text>
    );
  };

  return (
    <Block flex center style={styles.cart}>
      {customer && (
        <FlatList
          data={customer.inStoreShoppingCart.shoppingCartItems}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}-${item.shoppingCartItemId}`}
          ListEmptyComponent={renderEmpty()}
          ListHeaderComponent={renderHeader()}
          ListFooterComponent={renderFooter()}
        />
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
    shadowOpacity: 0.2
  },
  footer: {
    marginBottom: theme.SIZES.BASE * 2
  }
});

export default ShoppingCart;
