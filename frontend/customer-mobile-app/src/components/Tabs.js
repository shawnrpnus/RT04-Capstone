import React, { useEffect } from "react";
import { StyleSheet, Dimensions, FlatList, Animated } from "react-native";
import { Block, theme } from "galio-framework";

const { width } = Dimensions.get("screen");
import materialTheme from "src/constants/Theme";

const defaultMenu = [
  { id: "popular", title: "Popular" },
  { id: "beauty", title: "Beauty" },
  { id: "cars", title: "Cars" },
  { id: "motocycles", title: "Motocycles" }
];

export default function Tabs(props) {
  const [state, setState] = useState({ active: null });

  useEffect(() => {
    const { initialIndex } = props;
    initialIndex && selectMenu(initialIndex);
  }, []);

  const animatedValue = new Animated.Value(1);

  const animate = () => {
    animatedValue.setValue(0);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300
      // useNativeDriver: true, // color not supported
    }).start();
  };

  const menuRef = React.createRef();

  const onScrollToIndexFailed = () => {
    menuRef.current.scrollToIndex({
      index: 0,
      viewPosition: 0.5
    });
  };

  const selectMenu = id => {
    setState({ active: id });

    menuRef.current.scrollToIndex({
      index: props.data.findIndex(item => item.id === id),
      viewPosition: 0.5
    });

    animate();
    props.onChange && props.onChange(id);
  };

  const renderItem = item => {
    const isActive = state.active === item.id;

    const textColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        materialTheme.COLORS.MUTED,
        isActive ? materialTheme.COLORS.ACTIVE : materialTheme.COLORS.MUTED
      ],
      extrapolate: "clamp"
    });

    const width = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", isActive ? "100%" : "0%"],
      extrapolate: "clamp"
    });

    return (
      <Block style={styles.titleContainer}>
        <Animated.Text
          style={[styles.menuTitle, { color: textColor }]}
          onPress={() => selectMenu(item.id)}
        >
          {item.title}
        </Animated.Text>
        <Animated.View
          style={{
            height: 2,
            width,
            backgroundColor: materialTheme.COLORS.ACTIVE
          }}
        />
      </Block>
    );
  };

  const renderMenu = () => {
    const { data, ...props } = props;

    return (
      <FlatList
        {...props}
        data={data}
        horizontal={true}
        ref={menuRef}
        extraData={state}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={onScrollToIndexFailed}
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={styles.menu}
      />
    );
  };

  return <Block style={styles.container}>{renderMenu()}</Block>;
}

Tabs.defaultProps = {
  data: defaultMenu,
  initialIndex: null
};

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: theme.COLORS.WHITE,
    zIndex: 2
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4
  },
  menu: {
    paddingHorizontal: theme.SIZES.BASE * 2.5,
    paddingTop: 8,
    paddingBottom: 0
  },
  titleContainer: {
    alignItems: "center"
  },
  menuTitle: {
    fontWeight: "300",
    fontSize: 16,
    lineHeight: 28,
    // paddingBottom: 8,
    paddingHorizontal: 16,
    color: materialTheme.COLORS.MUTED
  }
});
