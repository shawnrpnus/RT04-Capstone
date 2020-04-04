import React, { useEffect, useState } from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, FlatList, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { retrieveCustomerInStoreTransactions } from "src/redux/actions/transactionActions";
import TransactionCard from "src/screens/Purchases/TransactionCard";
import Spinner from "react-native-loading-spinner-overlay";

const { width, height } = Dimensions.get("window");

function PurchaseHistory(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const transactions = useSelector(state => state.transaction.transactions);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (customer) {
      dispatch(
        retrieveCustomerInStoreTransactions(customer.customerId, setLoading)
      );
    }
  }, [customer.customerId]);

  const onRefresh = () => {
    if (customer) {
      dispatch(
          retrieveCustomerInStoreTransactions(customer.customerId, setRefreshing)
      );
    }
  }

  const renderEmpty = () => {
    return (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        You do not have any past store transactions.
      </Text>
    );
  };

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
          />
        )}
        showsVerticalScrollIndicator={false}
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
