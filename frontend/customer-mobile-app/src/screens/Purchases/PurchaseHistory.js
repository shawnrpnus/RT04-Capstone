import React, { useEffect, useState } from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, FlatList, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveCustomerInStoreCollectionTransactions,
  retrieveCustomerInStoreTransactions
} from "src/redux/actions/transactionActions";
import TransactionCard from "src/screens/Purchases/TransactionCard";
import Spinner from "react-native-loading-spinner-overlay";
import { useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

function PurchaseHistory(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const route = useRoute();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const inStoreTransactions = useSelector(
    state => state.transaction.transactions
  );
  const inStoreCollections = useSelector(
    state => state.transaction.collections
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (customer) {
      if (route.name === "Purchase History") {
        dispatch(
          retrieveCustomerInStoreTransactions(customer.customerId, setLoading)
        );
      } else if (route.name === "Pending Collections") {
        dispatch(
          retrieveCustomerInStoreCollectionTransactions(
            customer.customerId,
            setLoading
          )
        );
      }
    }
  }, [customer.customerId]);

  const onRefresh = () => {
    if (customer) {
      if (route.name === "Purchase History") {
        dispatch(
          retrieveCustomerInStoreTransactions(
            customer.customerId,
            setRefreshing
          )
        );
      } else if (route.name === "Pending Collections") {
        dispatch(
          retrieveCustomerInStoreCollectionTransactions(
            customer.customerId,
            setRefreshing
          )
        );
      }
    }
  };

  const renderEmpty = () => {
    return route.name === "Purchase History" ? (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        {customer && customer.inStoreShoppingCart.shoppingCartItems.length > 0
          ? `You do not have any past store transactions at ${customer.inStoreShoppingCart.store.storeName.toUpperCase()}.`
          : "Scan a QR code to get your store purchase history"}
      </Text>
    ) : (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        You do not have any pending in-store collections
      </Text>
    );
  };

  const routeToNavigate =
    route.name === "Purchase History"
      ? "Purchase Details"
      : route.name === "Pending Collections"
      ? "Order Details"
      : "";

  const transactions =
    route.name === "Purchase History"
      ? inStoreTransactions
      : inStoreCollections;

  return (
    <>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            key={item.transactionId}
            navigation={navigation}
            setLoading={setLoading}
            routeToNavigate={routeToNavigate}
          />
        )}
        showsVerticalScrollIndicator={true}
        keyExtractor={item => item.transactionId.toString()}
        ListEmptyComponent={renderEmpty()}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={{ color: "white" }}
        overlayColor="rgba(0,0,0,0.75)"
      />
    </>
  );
}

export default PurchaseHistory;
