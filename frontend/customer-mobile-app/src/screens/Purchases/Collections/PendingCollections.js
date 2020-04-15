import React, {useEffect, useState} from "react";
import {Text} from "galio-framework";
import {Dimensions} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {
  retrieveCustomerCompletedCollections,
  retrieveCustomerPendingCollections
} from "src/redux/actions/transactionActions";
import TransactionList from "src/screens/Purchases/Shared/TransactionList";

const { width, height } = Dimensions.get("window");

function PendingCollections(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const pendingCollections = useSelector(
      state => state.transaction.pendingCollections
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (customer) {
      dispatch(
          retrieveCustomerPendingCollections(customer.customerId, setLoading)
      );
    }
  }, [customer.customerId]);

  const onRefresh = () => {
    if (customer) {
      dispatch(
          retrieveCustomerPendingCollections(customer.customerId, setRefreshing)
      );
    }
  };

  const renderEmpty = () => {
    return (
        <Text h5 style={{ padding: 20, textAlign: "center" }}>
          You do not have any pending in-store collections
        </Text>
    );
  };


  return (
      <TransactionList
          transactions={pendingCollections}
          setLoading={setLoading}
          loading={loading}
          routeToNavigate={"Order Details"}
          renderEmpty={renderEmpty}
          onRefresh={onRefresh}
          refreshing={refreshing}
          navigation={navigation}
      />
  );
}

export default PendingCollections;
