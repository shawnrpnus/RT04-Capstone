import React from "react";
import { Block, Card, Text } from "galio-framework";
import { useSelector } from "react-redux";
import { Dimensions } from "react-native";
import DrawerCustomItem from "src/components/DrawerCustomItem";
import Theme from "src/constants/Theme";

const { width, height } = Dimensions.get("window");

function Home(props) {
  const staff = useSelector(state => state.staff.loggedInStaff);
  return (
    <Block flex>
      {staff && (
        <>
          <Block flex={0.04} />
          <Block
            flex={0.2}
            center
            middle
            card
            shadow
            style={{
              backgroundColor: Theme.COLORS.PRIMARY,
              width: width * 0.9,
              marginBottom: 20
            }}
          >
            <Text h4 bold>
              Welcome,
            </Text>
            <Text h4>
              {staff.firstName} {staff.lastName}
            </Text>
          </Block>
          <Block
            flex={0.6}
            center
            card
            shadow
            style={{
              backgroundColor: "rgba(255, 255, 255, 1)",
              width: width * 0.9,
              marginBottom: 20,
              paddingTop: 20
            }}
          >
            <Text h4 bold>
              Store Information
            </Text>
          </Block>
        </>
      )}
    </Block>
  );
}

export default Home;
