import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Chat from "@material-ui/icons/Chat";
import Build from "@material-ui/icons/Build";
// core components
import { CustomTabs } from "components/UI/CustomTabs/CustomTabs.js";
import tabsStyle from "assets/jss/material-kit-pro-react/views/componentsSections/tabsStyle.js";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import classNames from "classnames";
import Parallax from "components/UI/Parallax/Parallax";
import wishlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle";
import ReservationCartPage from "components/Reservation/ReservationCart/ReservationCartPage";
import { ShoppingCart } from "@material-ui/icons";
import UpcomingReservations from "components/Reservation/View/UpcomingReservations";
import PastReservations from "components/Reservation/View/PastReservations";
import { useParams } from "react-router-dom";
import UpdateReservationPage from "components/Reservation/UpdateReservation/UpdateReservationPage";

const useTabStyles = makeStyles(tabsStyle);
const useStyles = makeStyles(wishlistStyle);

export default function ReservationHomePage(props) {
  const classes = useStyles();
  const tabClasses = useTabStyles();
  const { mode, reservationId } = useParams();

  const tabs = [
    {
      tabName: "Reservation Cart",
      tabIcon: ShoppingCart,
      route: "/account/reservation/cart",
      tabContent: <ReservationCartPage />,
    },
    {
      tabName: "Upcoming Reservations",
      tabIcon: ShoppingCart,
      route: "/account/reservation/upcoming",
      tabContent: <UpcomingReservations />,
    },
    {
      tabName: "Past Reservations",
      tabIcon: ShoppingCart,
      route: "/account/reservation/history",
      tabContent: <PastReservations />,
    },
  ];

  if (mode === "update") {
    tabs.push({
      tabName: "Update Reservation",
      tabIcon: ShoppingCart,
      route: `/account/reservation/update/${reservationId}`,
      tabContent: <UpdateReservationPage />,
    });
  }

  return (
    <div>
      <Parallax
        image={require("assets/img/examples/bg2.jpg")}
        filter="dark"
        small
      >
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={8}
              sm={8}
              className={classNames(
                classes.mlAuto,
                classes.mrAuto,
                classes.textCenter
              )}
            >
              <h2 className={classes.mainTitle}>Reservations</h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <CustomTabs
        headerColor="primary"
        className={classes.customTabsRaised}
        key={mode}
        activeIndex={
          mode === "cart"
            ? 0
            : mode === "upcoming"
            ? 1
            : mode === "history"
            ? 2
            : mode === "update"
            ? 3
            : 0
        }
        tabs={tabs}
      />
    </div>
  );
}
