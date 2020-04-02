import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, FlatList } from "react-native";
import { FAB } from "react-native-paper";
import Theme from "src/constants/Theme";
import Spinner from "react-native-loading-spinner-overlay";
import { useDispatch, useSelector } from "react-redux";
import { CardView } from "react-native-credit-card-input";
import { PaymentsStripe as stripe } from "expo-payments-stripe";
import { addCreditCard } from "src/redux/actions/customerActions";

const { width, height } = Dimensions.get("window");

function ViewCreditCards(props) {
  const { navigation, route } = props;
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const [loading, setLoading] = useState(false);

  const renderEmpty = () => {
    return (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        You do not have any saved credit cards.{"\n"}
        Press the + below to get started!
      </Text>
    );
  };

  const renderItem = ({ item }) => {
    let month = item.expiryMonth;
    month = ("0" + month).slice(-2);
    return (
      <Block style={{ marginTop: 3 }}>
        <CardView
          brand={item.issuer.toLowerCase()}
          name={customer.firstName + " " + customer.lastName}
          number={"•••• •••• •••• " + item.last4}
          expiry={`${month}/${item.expiryYear.toString().slice(-2)}`}
          scale={1.15}
        />
      </Block>
    );
  };

  const getNewCard = async () => {
    try {
      const token = await stripe.paymentRequestWithCardFormAsync();
      dispatch(addCreditCard(customer.customerId, token.tokenId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Block flex={1} center style={{ width: width, paddingTop: 3 }}>
      {customer && (
        <>
          <FlatList
            data={customer.creditCards}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.creditCardId.toString()}
            ListEmptyComponent={renderEmpty()}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              width: width
            }}
          />
          {route.name === "View Credit Cards" && (
            <FAB
              style={{
                position: "absolute",
                margin: 10,
                right: 0,
                bottom: 0,
                backgroundColor: Theme.COLORS.PRIMARY
              }}
              icon="plus"
              onPress={() => getNewCard()}
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

export default ViewCreditCards;
