import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import { useSelector } from "react-redux";
import { Dimensions, FlatList } from "react-native";
import AddressCard from "src/screens/Profile/Address/AddressCard";
import { FAB, Portal } from "react-native-paper";
import Theme from "src/constants/Theme";
import Spinner from "react-native-loading-spinner-overlay";

const { width, height } = Dimensions.get("window");

function ViewAddresses(props) {
  const { navigation, route } = props;
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const [loading, setLoading] = useState(false);

  const getSortedShippingAddresses = customer => {
    const unsortedShippingAddresses = customer.shippingAddresses;
    return unsortedShippingAddresses.sort((a, b) => {
      const result = b.default - a.default + b.billing - a.billing;
      if (b.default) return 1;
      if (a.default) return -1;
      if (result === 0 && b.default && !a.default) {
        return 1;
      } else {
        return result;
      }
    });
  };

  const renderItem = ({ item }) => {
    return (
      <AddressCard
        customer={customer}
        address={item}
        setLoading={setLoading}
        navigation={navigation}
      />
    );
  };

  const renderEmpty = () => {
    return (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        Your address book is empty.{"\n"}
        Press the + below to get started!
      </Text>
    );
  };

  return (
    <Block flex={1} center style={{ width: width }}>
      {customer && (
        <>
          <FlatList
            data={getSortedShippingAddresses(customer)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.addressId.toString()}
            ListEmptyComponent={renderEmpty()}
          />
          {route.name === "View Addresses" && (
            <FAB
              style={{
                position: "absolute",
                margin: 10,
                right: 0,
                bottom: 0,
                backgroundColor: Theme.COLORS.PRIMARY
              }}
              icon="plus"
              onPress={() => navigation.navigate("New Address")}
            />
          )}
        </>
      )}
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={{ color: "white" }}
        overlayColor="rgba(0,0,0,0.75)"
      />
    </Block>
  );
}

export default ViewAddresses;
