import React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { CardContent } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { analytics_updateStore } from "../../redux/actions/analyticsActions";

const _ = require("lodash");

const StoreInsights = props => {
  const { store, reservationsByTimeSlotData } = props;
  const dispatch = useDispatch();

  const getHighestAverageReservationForStore = () => {
    let highest = 0;
    reservationsByTimeSlotData.forEach(timeSlotData => {
      const { storeReservationsData } = timeSlotData;
      const key = store.storeId + "-averageReservations";
      if (storeReservationsData[key] > highest)
        highest = storeReservationsData[key];
    });
    return highest;
  };

  const recommendedNum = Math.ceil(getHighestAverageReservationForStore());

  const updateStoreReservationLimit = () => {
    const newStore = _.cloneDeep(store);
    newStore.numReservedChangingRooms = recommendedNum;
    dispatch(analytics_updateStore(newStore));
  };

  return (
    <Card
      variant="outlined"
      style={{ marginBottom: 10, marginTop: 10, padding: 5 }}
    >
      <CardContent>
        <Typography variant="h6">{store.storeName}</Typography>
        <Divider style={{ marginTop: 5, marginBottom: 5 }} />

        <Typography variant="body1">
          Reservation Limit per Time Slot:{" "}
          <b>{store.numReservedChangingRooms}</b>
        </Typography>

        <Typography variant="body1">
          From past trends, the highest average reservations is:{" "}
          <b>{getHighestAverageReservationForStore()}</b>
        </Typography>

        <Typography variant="body1">
          Recommended Reservation Limit: <b>{recommendedNum}</b>
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant={"outlined"}
          color={"primary"}
          onClick={updateStoreReservationLimit}
          disabled={recommendedNum === store.numReservedChangingRooms}
        >
          {recommendedNum === store.numReservedChangingRooms
            ? "Store Reservation Limit is Optimal"
            : `Update Reservation Limit to ${recommendedNum}`}
        </Button>
      </CardActions>
    </Card>
  );
};

export default StoreInsights;
