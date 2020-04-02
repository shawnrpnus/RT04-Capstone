import React from "react";
import { Portal } from "react-native-paper";
import { Block, Text } from "galio-framework";
import { Feather } from "@expo/vector-icons";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { CardView } from "react-native-credit-card-input";

const { width, height } = Dimensions.get("window");

function EditCardModal(props) {
  const {
    creditCardModalVisible,
    setCreditCardModalVisible,
    customer,
    setCreditCard
  } = props;

  const renderItem = ({ item }) => {
    let month = item.expiryMonth;
    month = ("0" + month).slice(-2);
    return (
      <TouchableOpacity
        style={{ marginTop: 10 }}
        onPress={() => {
          setCreditCard(item);
          setCreditCardModalVisible(false);
        }}
      >
        <CardView
          brand={item.issuer.toLowerCase()}
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
        You do not have any saved credit cards.{"\n"}
        Press the + below to get started!
      </Text>
    );
  };

  return (
    <Modal
      isVisible={creditCardModalVisible}
      onModalHide={() => setCreditCardModalVisible(false)}
    >
      <Block
        flex={0}
        center
        style={{
          width: width * 0.85,
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
      </Block>
    </Modal>
  );
}

export default EditCardModal;
