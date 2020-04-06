import React from "react";
import TransactionCard from "src/screens/Purchases/TransactionCard";
import { FlatList } from "react-native";
import ReservationCard from "src/screens/Reservation/ReservationCard";

function ReservationList(props) {
  const {
    reservations,
    setLoading,
    navigation,
    renderEmpty,
    onRefresh,
    refreshing
  } = props;

  return (
    <FlatList
      data={reservations}
      renderItem={({ item }) => (
        <ReservationCard
          reservation={item}
          key={item.reservationId}
          navigation={navigation}
          setLoading={setLoading}
        />
      )}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.reservationId.toString()}
      ListEmptyComponent={renderEmpty()}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}

export default ReservationList;
