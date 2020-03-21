import React from "react";
import { withNavigation } from "@react-navigation/compat";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions
} from "react-native";
import { Button, Block, NavBar, Input, Text, theme } from "galio-framework";

import Icon from "./Icon";
import materialTheme from "src/constants/Theme";
import Tabs from "./Tabs";
import {useNavigation} from "@react-navigation/core";

const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);


function Header(props) {
  const navigation = useNavigation();

  const handleLeftPress = () => {
    const { back } = props;
    return back ? navigation.goBack() : navigation.openDrawer();
  };


  const renderHeader = () => {
    const { search, tabs, options } = props;
    if (search || tabs || options) {
      return (
        <Block center>

        </Block>
      );
    }
    return null;
  };

  const { back, title, white, transparent, scene } = props;
  // const { routeName } = navigation.state;
  // const { options } = scene.descriptor;
  // const routeName = scene.descriptor?.options.headerTitle ?? '';
  const noShadow = ["Search", "Profile"].includes(title);
  const headerStyles = [
    !noShadow ? styles.shadow : null,
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null
  ];

  return (
    <Block style={headerStyles}>
      <NavBar
        back={back}
        title={title}
        style={styles.navbar}
        transparent={transparent}
        right={renderRight()}
        rightStyle={{ alignItems: "center" }}
        leftStyle={{ paddingTop: 3, flex: 0.3 }}
        leftIconName={back ? null : "navicon"}
        // leftIconFamily="font-awesome"
        leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
        titleStyle={[
          styles.title,
          { color: theme.COLORS[white ? "WHITE" : "ICON"] }
        ]}
        onLeftPress={handleLeftPress}
      />
      {renderHeader()}
    </Block>
  );
}

export default Header

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: "relative"
  },
  title: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold"
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: "absolute",
    top: 8,
    right: 8
  },
  header: {
    backgroundColor: theme.COLORS.WHITE
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.5,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: "300"
  }
});
