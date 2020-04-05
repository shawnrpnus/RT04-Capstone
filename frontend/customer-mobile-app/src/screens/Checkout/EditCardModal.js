import React from "react";
import { Button, Portal } from "react-native-paper";
import { Block, Text } from "galio-framework";
import { Feather } from "@expo/vector-icons";
import { Alert, Dimensions, FlatList, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { CardView } from "react-native-credit-card-input";
import { PaymentsStripe as stripe } from "expo-payments-stripe";
import { addCreditCard } from "src/redux/actions/customerActions";
import { useDispatch } from "react-redux";

const { width, height } = Dimensions.get("window");

function EditCardModal(props) {
  const {
    creditCardModalVisible,
    setCreditCardModalVisible,
    customer,
    setCreditCard
  } = props;

  const dispatch = useDispatch();

  const renderItem = ({ item }) => {
    let month = item.expiryMonth;
    month = ("0" + month).slice(-2);
    let issuer = item.issuer.toLowerCase();
    issuer =
      issuer === "visa" ? "visa" : issuer === "mastercard" ? "master-card" : "";
    return (
      <TouchableOpacity
        style={{ marginTop: 10 }}
        onPress={() => {
          setCreditCard(item);
          setCreditCardModalVisible(false);
        }}
      >
        <CardView
          brand={issuer}
          name={customer.firstName + " " + customer.lastName}
          number={"•••• •••• •••• " + item.last4}
          expiry={`${month}/${item.expiryYear.toString().slice(-2)}`}
          scale={0.9}
        />
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        You do not have any saved credit cards.
      </Text>
    );
  };

  const getNewCard = async () => {
    try {
      const token = await stripe.paymentRequestWithCardFormAsync();
      console.log(token);
      setCreditCardModalVisible(false);
      const newCreditCard = {
        paymentMethodId: token.card.cardId,
        last4: token.card.last4,
        expiryMonth: token.card.expMonth,
        expiryYear: token.card.expYear,
        issuer: token.card.brand
      };
      setCreditCard(newCreditCard);
      Alert.alert(
        "Save Credit Card",
        "Do you want to save this credit card to your account?",
        [
          {
            text: "No",
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () =>
              dispatch(addCreditCard(customer.customerId, token.tokenId))
          }
        ]
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      isVisible={creditCardModalVisible}
      onModalWillHide={() => setCreditCardModalVisible(false)}
      onBackdropPress={() => setCreditCardModalVisible(false)}
      animationIn="fadeInUpBig"
      animationInTiming={300}
      animationOut="fadeOutDownBig"
      animationOutTiming={300}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      style={{position: "absolute", top: height*0.075}}
    >
      <Block
        flex={0}
        center
        style={{
          width: width * 0.9,
          height: height * 0.8,
          backgroundColor: "white",
          borderRadius: 10
        }}
      >
        <Block
          row
          top
          style={{
            width: "100%",
            padding: 20,
            paddingRight: 12,
            marginBottom: -10
          }}
          space="between"
        >
          <Text h5 bold>
            Select a Credit Card
          </Text>
          <TouchableOpacity onPress={() => setCreditCardModalVisible(false)}>
            <Feather name="x" size={28} />
          </TouchableOpacity>
        </Block>
        <Block flex>
          <FlatList
            data={customer.creditCards}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.creditCardId.toString()}
            ListEmptyComponent={renderEmpty()}
            contentContainerStyle={{
              alignItems: "center",
              width: width * 0.8
            }}
          />
        </Block>
        <Block left style={{ marginBottom: 5 }}>
          <Button
            style={{ height: 50 }}
            contentStyle={{ height: 50 }}
            onPress={getNewCard}
          >
            Add New Card
          </Button>
        </Block>
      </Block>
    </Modal>
  );
}

export default EditCardModal;
