import React from "react";
import { Block } from "galio-framework";
import {Dimensions} from "react-native";

const { width, height } = Dimensions.get("window");

function PurchaseHistory(props) {
  return <Block flex={1} center style={{ width: width }}></Block>;
}

export default PurchaseHistory;
