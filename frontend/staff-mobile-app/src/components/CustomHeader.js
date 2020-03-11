import React from "react";
import { Block, NavBar, theme } from "galio-framework";
import { StyleSheet } from "react-native";

function CustomHeader(props) {
  const { back, transparent, navigation, title } = props;
  const headerStyles = [
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
  ];

  const handleLeftPress = () => {
    const { back } = props;
    return back ? navigation.goBack() : navigation.openDrawer();
  };

  return (
    <Block style={headerStyles}>
      <NavBar
        back={back}
        title={title}
        style={styles.navbar}
        leftStyle={{ paddingTop: 3, flex: 0.3 }}
        leftIconName={back ? null : "navicon"}
        leftIconFamily="font-awesome"
        leftIconColor={theme.COLORS.ICON}
        titleStyle={[styles.title, { color: theme.COLORS["ICON"] }]}
        onLeftPress={handleLeftPress}
      />
    </Block>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: theme.SIZES.BASE * 4,
    zIndex: 5
  },
  title: {
    width: "100%",
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default CustomHeader;
