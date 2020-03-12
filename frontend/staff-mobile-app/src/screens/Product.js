import React, { useState, useEffect } from "react";
import { Block, Button, Text } from "galio-framework";
import { HelperText, TextInput } from "react-native-paper";
import { clearErrors } from "src/redux/actions";
import { Dimensions } from "react-native";
import materialTheme from "src/constants/Theme";
import { useDispatch, useSelector } from "react-redux";
import { retrieveAllSKUs } from "src/redux/actions/productVariantActions";
import Autocomplete from "src/components/Autocomplete";
import { Portal } from "react-native-paper";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function Product(props) {
  const [SKU, setSKU] = useState("");

  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const allSKUs = useSelector(state => state.product.allSKUs);

  useEffect(() => {
    dispatch(retrieveAllSKUs());
  }, []);

  return (
    <Block flex={1} center>
      {allSKUs && (
        <>
          <Block
            flex={3}
            card
            top
            style={{
              backgroundColor: "white",
              width: width * 0.9,
              marginBottom: 20,
              marginTop: 20,
              padding: 20,
              zIndex: 1
            }}
          >
            <Block flex={0.5} center>
              <Text h4 bold>
                Enter SKU
              </Text>
            </Block>
            <Block
              flex={2}
              style={{ width: "100%", zIndex:1,}}
            >
              <Autocomplete
                array={allSKUs}
                label="SKU"
                value={SKU}
                setValue={setSKU}
                helperText={
                  <HelperText type="error" visible={!!_.get(errors, "sku")}>
                    {errors.sku}
                  </HelperText>
                }
                error={!!_.get(errors, "sku")}
              />
            </Block>
            <Block flex={0.4} style={{width: "100%", zIndex: 0}}>
              <Button
                color={materialTheme.COLORS.BUTTON_COLOR}
                style={{ width: "100%", height: 50}}
                onPress={() => console.log("PRESSED")}
              >
                SEARCH
              </Button>
            </Block>
          </Block>
          <Block flex={2} style={{ zIndex: 0 }} center>
            <Block flex={2} center  style={{ zIndex: 0 }}>
              <Text h4 bold style={{ textAlign: "center" }}>
                OR
              </Text>
            </Block>
            <Block flex={6}>
              <Button
                color={materialTheme.COLORS.BUTTON_COLOR}
                style={{ width: width * 0.9 - 40, height: 50 }}
              >
                SCAN QR
              </Button>
            </Block>
          </Block>
        </>
      )}
    </Block>
  );
}

export default Product;
