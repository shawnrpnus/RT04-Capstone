import React, { useEffect, useState } from "react";
import { Block, Card, Text } from "galio-framework";
import { useDispatch, useSelector } from "react-redux";
import { Dimensions, ImageBackground, Platform } from "react-native";
import Theme from "src/constants/Theme";
import { Divider } from "react-native-paper";
import {
  dispatchUpdatedCustomer,
  registerForPushNotifications
} from "src/redux/actions/customerActions";
import {Notifications, SplashScreen} from "expo";
import fashion_bg from "assets/images/fashion-bg.jpg";

const _ = require("lodash");
const moment = require("moment");
const { width, height } = Dimensions.get("window");

function Profile(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);


  return (
    <Block flex>
      {/*{customer && (*/}
      {/*  <>*/}
      {/*    <Block*/}
      {/*      flex={0.4}*/}
      {/*      center*/}
      {/*      middle*/}
      {/*      card*/}
      {/*      shadow*/}
      {/*      style={{*/}
      {/*        backgroundColor: Theme.COLORS.SECONDARY,*/}
      {/*        width: width*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <ImageBackground*/}
      {/*        source={fashion_bg}*/}
      {/*        style={{ height: "100%", width: "100%", resizeMode: "cover" }}*/}
      {/*      >*/}
      {/*        <Block flex middle style={{backgroundColor: "rgba(0,0,0,0.4)"}}>*/}
      {/*          <Text h2 bold style={{color: "white"}}>*/}
      {/*            Welcome,*/}
      {/*          </Text>*/}
      {/*          <Text h2 style={{color: "white"}}>*/}
      {/*            {customer.firstName} {customer.lastName}*/}
      {/*          </Text>*/}
      {/*        </Block>*/}
      {/*      </ImageBackground>*/}
      {/*    </Block>*/}
      {/*    <Block*/}
      {/*      flex={0.6}*/}
      {/*      center*/}
      {/*      card*/}
      {/*      shadow*/}
      {/*      style={{*/}
      {/*        backgroundColor: "rgba(255, 255, 255, 1)",*/}
      {/*        width: width,*/}
      {/*        borderRadius: 0,*/}
      {/*        padding: 20*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Block flex={0.15} center>*/}
      {/*        <Text h4 bold>*/}
      {/*          {store.storeName}*/}
      {/*        </Text>*/}
      {/*      </Block>*/}
      {/*      <Block flex={0.2} top>*/}
      {/*        <Text h5 bold>*/}
      {/*          Opening Hours*/}
      {/*        </Text>*/}
      {/*        <Text h5>*/}
      {/*          {moment(store.openingTime, "HH:mm:ss").format("h:mm A")}*/}
      {/*          {" - "}*/}
      {/*          {moment(store.closingTime, "HH:mm:ss").format("h:mm A")}*/}
      {/*        </Text>*/}
      {/*      </Block>*/}
      {/*      <Block flex={0.12} row top>*/}
      {/*        <Text h5 bold>*/}
      {/*          Total Changing Rooms:{" "}*/}
      {/*        </Text>*/}
      {/*        <Text h5>{store.numChangingRooms}</Text>*/}
      {/*      </Block>*/}
      {/*      <Block flex={0.12} row top>*/}
      {/*        <Text h5 bold>*/}
      {/*          Reserved Changing Rooms:{" "}*/}
      {/*        </Text>*/}
      {/*        <Text h5>{store.numReservedChangingRooms}</Text>*/}
      {/*      </Block>*/}
      {/*      <Block flex={0.3} top>*/}
      {/*        <Text h5 bold>*/}
      {/*          Address*/}
      {/*        </Text>*/}
      {/*        <Text*/}
      {/*          h5*/}
      {/*        >{`${address.buildingName}, \n${address.line1} ${address.line2} \n${address.postalCode}`}</Text>*/}
      {/*      </Block>*/}
      {/*    </Block>*/}
      {/*  </>*/}
      {/*)}*/}
    </Block>
  );
}

export default Profile;
