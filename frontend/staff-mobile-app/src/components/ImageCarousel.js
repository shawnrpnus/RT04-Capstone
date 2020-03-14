import React from "react";
import { Block } from "galio-framework";
import { ScrollView, Animated, StyleSheet,Image, Dimensions} from "react-native";
import Theme from "src/constants/Theme";

const { width, height } = Dimensions.get("window");

function ImageCarousel(props) {
  const { productVariant } = props;

    const scrollX = new Animated.Value(0);


    return (
    <Block
      flex
      center
      style={{ backgroundColor: "transparent", position: "relative" }}
    >
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={"normal"}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([
          {
            nativeEvent: { contentOffset: { x: scrollX } }
          }
        ])}
      >
        {productVariant.productImages.map(image => {
          return (
            <Image
              key={image.productImageUrl}
              style={{ width: width, height: height * 0.7 }}
              resizeMethod="scale"
              resizeMode="contain"
              source={{
                uri: image.productImageUrl
              }}
            />
          );
        })}
      </ScrollView>
      <Block center style={styles.dotsContainer}>
        <Block row>
          {productVariant.productImages.map((_, index) => {
            const position = Animated.divide(scrollX, width);
            const dotOpacity = position.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.8, 1, 0.8],
              extrapolate: "clamp"
            });

            const dotWidth = position.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [10, 20, 10],
              extrapolate: "clamp"
            });

            return (
              <Animated.View
                key={index}
                style={[styles.dots, { opacity: dotOpacity, width: dotWidth }]}
              />
            );
          })}
        </Block>
      </Block>
    </Block>
  );
}

export default ImageCarousel;

const styles = StyleSheet.create({
    dots: {
        height: 10,
        margin: 8,
        borderRadius: 4,
        backgroundColor: Theme.COLORS.PRIMARY
    },
    dotsContainer: {
        position: "absolute",
        width: width,
        bottom: 8,
        left: 0,
        right: 0,
    }
});
