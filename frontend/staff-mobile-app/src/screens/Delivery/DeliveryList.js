import React, { useEffect, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { retrieveDeliveryRoute } from "src/redux/actions/deliveryActions";
import { Text } from "galio-framework";
import Spinner from "react-native-loading-spinner-overlay";
import TransactionCard from "src/screens/Delivery/Transaction/TransactionCard";
import GroupedStoreOrderCard from "src/screens/Delivery/GroupedStoreOrder/GroupedStoreOrderCard";
import {SplashScreen} from "expo";

const { width, height } = Dimensions.get("window");

function DeliveryList(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const staff = useSelector(state => state.staff.loggedInStaff);
  const deliveryList = useSelector(state => state.delivery.deliveryList);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (staff) {
        SplashScreen.hide();
      dispatch(retrieveDeliveryRoute(staff.staffId, setRefreshing));
    }
  }, [staff.staffId]);

  const onRefresh = () => {
    if (staff) {
      dispatch(retrieveDeliveryRoute(staff.staffId, setRefreshing));
    }
  };

  const renderEmpty = () => {
    return (
      <Text h5 style={{ padding: 20, textAlign: "center" }}>
        You do not have any deliveries assigned for today.
      </Text>
    );
  };

  return (
    <>
      <FlatList
        data={deliveryList}
        renderItem={({ item }) => {
          if (item.transactionId) {
            return (
              <TransactionCard
                transaction={item}
                key={item.transactionId}
                navigation={navigation}
                setLoading={setLoading}
              />
            );
          } else {
            return (
              <GroupedStoreOrderCard
                groupedStoreOrder={item}
                key={item.store.storeId}
                navigation={navigation}
                setLoading={setLoading}
              />
            );
          }
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={item =>
          item.transactionId
            ? item.transactionId.toString()
            : item.inStoreRestockOrderId
            ? item.inStoreRestockOrderId.toString()
            : ""
        }
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

export default DeliveryList;
