import React from "react";
import { Block, Text, theme } from "galio-framework";
import { useSelector } from "react-redux";
import { ScrollView, StyleSheet } from "react-native";
import DrawerCustomItem from "src/components/DrawerCustomItem";
import materialTheme from "src/constants/Theme";

const screens = [
  "ShopStack",
  "ProfileStack",
  "PurchasesStack",
  "CollectionsStack",
  "ReservationsStack"
];

function CustomDrawerContent(props) {
  const { navigation, state } = props;

  const customer = useSelector(state => state.customer.loggedInCustomer);
  return (
    <Block style={styles.container}>
      <Block flex={0.1} style={styles.header}>
        <Block style={styles.profile}>
          {customer && (
            <>
              <Text h4 color={"white"}>
                {customer.firstName} {customer.lastName}
              </Text>
              <Text h6 color={"white"}>
                {customer.email}
              </Text>
            </>
          )}
        </Block>
      </Block>
      <Block flex style={{ paddingLeft: 7, paddingRight: 14 }}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingTop: 10
            }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index} //is the index of the routes in the drawer
              />
            );
          })}
        </ScrollView>
      </Block>
      <Block flex={0.1} style={{ paddingLeft: 7, paddingRight: 14 }}>
        <DrawerCustomItem
          title="Log Out"
          navigation={navigation}
          focused={state.index === 4}
        />
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: materialTheme.COLORS.ACCENT_LIGHTER,
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: "center"
  },
  profile: {
    marginBottom: -10
  }
});
export default CustomDrawerContent;
