import React from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, TouchableOpacity } from "react-native";
import { RadioButton } from "react-native-paper";
import AddressCardCheckout from "src/screens/Checkout/AddressCardCheckout";

const { width, height } = Dimensions.get("window");

function CollectionOptions(props) {
  const {
    collectionOption,
    setCollectionOption,
    deliveryAddress,
    setDeliveryAddress,
    customer
  } = props;

  const getDefaultShippingAddress = () => {
    if (deliveryAddress) return deliveryAddress;
    if (customer.shippingAddresses.length === 0) return null;

    const defaultShippingAddr = customer.shippingAddresses.find(
      item => item.default
    );
    if (!defaultShippingAddr) {
      setDeliveryAddress(customer.shippingAddresses[0]);
    } else {
      setDeliveryAddress(defaultShippingAddr);
    }
  };

  return (
    <Block
      flex
      card
      style={{
        backgroundColor: "white",
        width: width,
        marginTop: 4,
        padding: 12,
        borderRadius: 0
      }}
    >
      {customer && (
        <>
          <Text h5 bold>
            Collection
          </Text>
          <RadioButton.Group
            onValueChange={value => setCollectionOption(value)}
            value={collectionOption}
          >
            <Block flex row>
              <Block flex row style={{ alignItems: "center", width: "50%" }}>
                <RadioButton value="in-store" />
                <Text>Collect In Store</Text>
              </Block>
              <Block flex row style={{ alignItems: "center", marginBottom: 5 }}>
                <RadioButton value="delivery" />
                <Text>Deliver</Text>
              </Block>
            </Block>
          </RadioButton.Group>
          {collectionOption === "delivery" ? (
            <>
              <Block flex row space="between">
                <Text h6 bold style={{ fontSize: 16, color: "dimgray" }}>
                  Delivery Address
                </Text>
                <TouchableOpacity>
                  <Text
                    h6
                    bold
                    style={{
                      fontSize: 16,
                      textDecorationLine: "underline",
                      color: "mediumblue"
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              </Block>
              <AddressCardCheckout address={getDefaultShippingAddress()} />
            </>
          ) : (
            <>
              <Text h6 bold style={{ fontSize: 16, color: "dimgray" }}>
                Your Current Store
              </Text>
              <Block
                flex
                card
                style={{
                  backgroundColor: "white",
                  marginTop: 4,
                  padding: 12,
                  borderRadius: 0
                }}
              >
                <Text h6 bold style={{ fontSize: 16 }}>
                  {customer.inStoreShoppingCart.store.storeName}
                </Text>
                <AddressCardCheckout
                  address={customer.inStoreShoppingCart.store.address}
                  border={0}
                  padding={0}
                />
              </Block>
            </>
          )}
        </>
      )}
    </Block>
  );
}

export default CollectionOptions;
