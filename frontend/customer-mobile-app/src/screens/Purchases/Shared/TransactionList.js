import React from "react";
import { FlatList } from "react-native";
import TransactionCard from "src/screens/Purchases/TransactionCard";
import Spinner from "react-native-loading-spinner-overlay";

function TransactionList(props) {
  const {
    transactions,
    setLoading,
    loading,
    routeToNavigate,
    renderEmpty,
    onRefresh,
    refreshing,
    navigation
  } = props;
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

export default TransactionList;
