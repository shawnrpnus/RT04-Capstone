/*eslint-disable*/
import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import People from "@material-ui/icons/People";
// core components
import GridContainer from "components/Layout/components/Grid/GridContainer.js";
import GridItem from "components/Layout/components/Grid/GridItem.js";
import NavPills from "components/UI/NavPills/NavPills.js";
import CardHeader from "components/UI/Card/CardHeader.js";
import Parallax from "components/UI/Parallax/Parallax.js";
import Clearfix from "components/UI/Clearfix/Clearfix.js";

import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";
import AccountInfo from "components/Profile/sections/AccountInfo";
import Measurements from "components/Profile/sections/Measurements";
import Style from "components/Profile/sections/Style";
import { useDispatch, useSelector } from "react-redux";
import OrderHistoryPage from "components/Profile/sections/Orders/OrderHistoryPage";
import { clearErrors } from "redux/actions";
import { useParams } from "react-router-dom";
import OrderDetails from "components/Profile/sections/Orders/OrderDetails";
import ReviewCardForProfilePage from "components/Reviews/ReviewCardForProfilePage";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {AttachMoney, Cached} from "@material-ui/icons";
import RefundHistoryPage from "./sections/Refunds/RefundHistoryPage";
import RefundDetails from "./sections/Refunds/RefundDetails";
import CreateRefund from "./sections/Refunds/CreateRefund";

const useStyles = makeStyles(profilePageStyle);

export default function ProfilePage(props) {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer.loggedInCustomer);
  const classes = useStyles();
  const { mode, transactionId, refundId } = useParams();
  const [largeModal, setLargeModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    dispatch(clearErrors);
  }, []);

  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    {
      tabButton: "Account",
      tabIcon: Palette,
      route: "/account/profile/info",
      tabContent: <AccountInfo setIsLoading={setIsLoading} />,
    },
    {
      tabButton: "Orders",
      tabIcon: People,
      route: "/account/profile/orderHistory",
      tabContent: <OrderHistoryPage />,
    },
    {
      tabButton: "Personalize",
      tabIcon: Camera,
      route: "/account/profile/personalize",
      tabContent: (
        <div>
          <GridContainer>
            <GridItem xs={3} sm={3} md={3}>
              <Measurements />
            </GridItem>
            <GridItem xs={9} sm={9} md={9}>
              <Style />
            </GridItem>
          </GridContainer>
        </div>
      ),
    },
    {
      tabButton: "Refunds",
      tabIcon: AttachMoney,
      route: "/account/profile/refundHistory",
      tabContent: <RefundHistoryPage />,
    },
  ];

  if (mode === "viewOrder") {
    tabs.push({
      tabButton: "Order Details",
      tabIcon: Camera,
      route: `/account/profile/viewOrder/${transactionId}`,
      tabContent: <OrderDetails />,
    });
  } else if (mode === "viewRefund") {
    tabs.push({
      tabButton: "Refund Details",
      tabIcon: Camera,
      route: `/account/profile/viewRefund/${refundId}`,
      tabContent: <RefundDetails />,
    });
  }

  return (
    <div>
      <Backdrop
        className={classes.backdrop}
        style={{ zIndex: 100000000000000 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Parallax
        image={require("assets/img/examples/city.jpg")}
        filter="dark"
        className={classes.parallax}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={6}>
              <CardHeader color="primary" signup className={classes.cardHeader}>
                <div className={classes.profile}>
                  <div className={classes.name}>
                    <h3
                      className={classes.title}
                    >{`${customer.firstName} ${customer.lastName}`}</h3>
                  </div>
                </div>
              </CardHeader>
            </GridItem>
          </GridContainer>
          <div className={classNames(classes.description, classes.textCenter)}>
            <p>
              Explore your account - make reservations, get personalized
              recommendations, and more.
            </p>
          </div>
          <div className={classes.profileTabs}>
            <NavPills
              alignCenter
              // horizontal={{
              //   tabsGrid: { xs: 6, sm: 4, md: 4 }
              // }}
              color="primary"
              key={mode}
              active={
                mode === "info"
                  ? 0
                  : mode === "orderHistory"
                  ? 1
                  : mode === "personalize"
                  ? 2
                  : mode === "refundHistory"
                  ? 3
                  : mode === "viewOrder"
                  ? 4
                  : mode === "viewRefund"
                  ? 4
                  : 0
              }
              tabs={tabs}
            />
          </div>
          <Clearfix />
        </div>
      </div>
    </div>
  );
}
