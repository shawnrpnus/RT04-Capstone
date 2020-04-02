import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import {Alert, Dimensions, FlatList, TouchableOpacity} from "react-native";
import { FAB } from "react-native-paper";
import Theme from "src/constants/Theme";
import Spinner from "react-native-loading-spinner-overlay";
import { useDispatch, useSelector } from "react-redux";
import { CardView } from "react-native-credit-card-input";
import { PaymentsStripe as stripe } from "expo-payments-stripe";
import {addCreditCard, removeCreditCard} from "src/redux/actions/customerActions";
import { Feather } from "@expo/vector-icons";

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
      <Block style={{ marginTop: 10 }}>
        <CardView
          brand={item.issuer.toLowerCase()}
          name={customer.firstName + " " + customer.lastName}
          number={"•••• •••• •••• " + item.last4}
          expiry={`${month}/${item.expiryYear.toString().slice(-2)}`}
          scale={1.05}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 7,
            left: 0,
            backgroundColor: "rgba(255,255,255,0.6)",
            borderWidth: 1,
            borderRadius: 50,
            borderColor: "transparent"
          }}
          onPress={() => showDeleteConfirmationAlert(item.creditCardId)}
        >
          <Feather name="x" size={30} style={{color: "rgb(96,96,96)"}}/>
        </TouchableOpacity>
      </Block>
    );
  };

  const getNewCard = async () => {
    try {
      const token = await stripe.paymentRequestWithCardFormAsync();
      dispatch(addCreditCard(customer.customerId, token.tokenId, setLoading));
    } catch (err) {
      console.log(err);
    }
  };

  const showDeleteConfirmationAlert = (creditCardId) => {
    Alert.alert("Remove card", "Are you sure you want to remove this card?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Remove",
        onPress: () => dispatch(removeCreditCard(customer.customerId, creditCardId, setLoading))
      }
    ]);
  };

  return (
    <Block flex={1} center style={{ width: width, paddingTop: 5 }}>
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
