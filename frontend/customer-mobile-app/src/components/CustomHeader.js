import React from "react";
import { Block, NavBar, theme } from "galio-framework";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import { useDispatch, useSelector } from "react-redux";
import materialTheme from "src/constants/Theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { clearShoppingCart } from "src/redux/actions/customerActions";

function CustomHeader(props) {
  const { back, transparent, navigation, title, atShoppingCartPage } = props;

  const customer = useSelector(state => state.customer.loggedInCustomer);
  const dispatch = useDispatch();

  const headerStyles = [
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null
  ];

  const BasketButton = ({ style, navigation }) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => navigation.navigate("Shopping Cart")}
    >
      <MaterialCommunityIcons
        name="cart-outline"
        size={22}
        color={theme.COLORS["ICON"]}
      />
      {customer && customer.inStoreShoppingCart.shoppingCartItems.length > 0 ? (
        <Block middle style={styles.notify} />
      ) : null}
    </TouchableOpacity>
  );

  const TrashButton = ({ style }) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => confirmClearCart()}
    >
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={22}
        color={theme.COLORS["ICON"]}
      />
    </TouchableOpacity>
  );

  const confirmClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to clear your cart?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Clear Cart",
        onPress: () => dispatch(clearShoppingCart(customer.customerId))
      }
    ]);
  };

  const handleLeftPress = () => {
    const { back } = props;
    return back ? navigation.goBack() : navigation.openDrawer();
  };

  return (
    <Block style={headerStyles}>
      <NavBar
        back={back}
        title={title}
        style={styles.navbar}
        right={
          atShoppingCartPage ? (
            <TrashButton key="clear-cart" />
          ) : (
            <BasketButton key="basket-product" navigation={navigation} />
          )
        }
        rightStyle={{ alignItems: "center" }}
        leftStyle={{ paddingTop: 3, flex: 0.3 }}
        leftIconName={back ? null : "navicon"}
        leftIconFamily="font-awesome"
        leftIconColor={theme.COLORS.ICON}
        titleStyle={[styles.title, { color: theme.COLORS["ICON"] }]}
        onLeftPress={handleLeftPress}
      />
    </Block>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: theme.SIZES.BASE * 4,
    zIndex: 5
  },
  title: {
    width: "100%",
    fontSize: 20,
    fontWeight: "bold"
  },
  button: {
    padding: 12,
    position: "relative",
    marginRight: -40
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: "absolute",
    top: 8,
    right: 8
  }
});

export default CustomHeader;
