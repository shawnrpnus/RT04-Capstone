/*eslint-disable*/
import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import People from "@material-ui/icons/People";
// core components
import GridContainer from "components/Layout/components/Grid/GridContainer.js";
import GridItem from "components/Layout/components/Grid/GridItem.js";
import NavPills from "components/UI/NavPills/NavPills.js";
import Card from "components/UI/Card/Card.js";
import CardBody from "components/UI/Card/CardBody.js";
import CardHeader from "components/UI/Card/CardHeader.js";
import Badge from "components/UI/Badge/Badge.js";
import Muted from "components/UI/Typography/Muted.js";
import Parallax from "components/UI/Parallax/Parallax.js";
import Clearfix from "components/UI/Clearfix/Clearfix.js";

import oluEletu from "assets/img/examples/olu-eletu.jpg";
import clemOnojeghuo from "assets/img/examples/clem-onojeghuo.jpg";
import cynthiaDelRio from "assets/img/examples/cynthia-del-rio.jpg";
import mariyaGeorgieva from "assets/img/examples/mariya-georgieva.jpg";
import clemOnojegaw from "assets/img/examples/clem-onojegaw.jpg";
import darrenColeshill from "assets/img/examples/darren-coleshill.jpg";
import avatar from "assets/img/faces/avatar.jpg";
import marc from "assets/img/faces/marc.jpg";
import kendall from "assets/img/faces/kendall.jpg";
import cardProfile2Square from "assets/img/faces/card-profile2-square.jpg";

import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";
import AccountInfo from "components/Profile/sections/AccountInfo";
import Measurements from "components/Profile/sections/Measurements";
import { useSelector } from "react-redux";
import OrderHistoryPage from "components/Profile/sections/Orders/OrderHistoryPage";

const useStyles = makeStyles(profilePageStyle);

export default function ProfilePage(props) {
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

  return (
    <div>
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
              //   tabsGrid: { xs: 12, sm: 4, md: 2 },
              //   contentGrid: { xs: 12, sm: 8, md: 10 }
              // }}
              color="primary"
              tabs={[
                {
                  tabButton: "Account",
                  tabIcon: Palette,
                  tabContent: <AccountInfo />
                },
                {
                  tabButton: "Orders",
                  tabIcon: People,
                  tabContent: <OrderHistoryPage />
                },
                {
                  tabButton: "Personalize",
                  tabIcon: Camera,
                  tabContent: <Measurements />
                }
              ]}
            />
          </div>
          <Clearfix />
        </div>
      </div>
    </div>
  );
}
