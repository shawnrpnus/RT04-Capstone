import React, { useState, useEffect } from "react";
import { Block, Button, Text } from "galio-framework";
import { HelperText, TextInput } from "react-native-paper";
import { clearErrors } from "src/redux/actions";
import { Dimensions, Modal, Alert, StyleSheet } from "react-native";
import materialTheme from "src/constants/Theme";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveAllSKUs,
  retrieveProductStockById,
  retrieveProductVariantBySKU,
  retrieveStocksForProductVariant
} from "src/redux/actions/productVariantActions";
import Autocomplete from "src/components/Autocomplete";
import { Portal } from "react-native-paper";
import { BarCodeScanner } from "expo-barcode-scanner";
import {useRoute} from "@react-navigation/native";

const _ = require("lodash");
const { width, height } = Dimensions.get("window");

function Product(props) {
  const [SKU, setSKU] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const route = useRoute();

  const { navigation } = props;
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const allSKUs = useSelector(state => state.product.allSKUs);

  useEffect(() => {
    dispatch(retrieveAllSKUs());
  }, []);

  const handleSkuSearch = () => {
    alert(route.name);
    dispatch(retrieveProductVariantBySKU(SKU, navigation, setSKU));
  };

  const requestPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status === "granted") {
      setModalVisible(true);
    } else {
      // Alert.alert("Camera permission not granted", { cancelable: true });
      Alert.alert("Camera permission not granted", null, null, {
        cancelable: true
      });
    }
  };

  const handleQRScanned = async ({ type, data }) => {
    setModalVisible(false);
    const productStock = await retrieveProductStockById(data);
    if (productStock) {
      dispatch(
        retrieveProductVariantBySKU(
          productStock.productVariant.sku,
          navigation,
          setSKU
        )
      );
    } else {
      Alert.alert(
        "Error",
        "Invalid QR Code!\nPlease scan QR codes from our stores.",
        null,
        { cancelable: false }
      );
    }
  };

  return (
    <Block flex={1} center>
      {allSKUs && (
        <>
          <Block
            flex={4}
            card
            style={{
              backgroundColor: "white",
              width: width,
              marginTop: 0,
              padding: 20,
              borderRadius: 0,
              zIndex: 1
            }}
          >
            <Block flex={0.5} middle canter>
              <Text h4 bold style={{marginBottom: 10}}>
                {route.name}
              </Text>
              <Text h4 >
                Enter SKU
              </Text>
            </Block>
            <Block flex={2} center style={{ width: width*0.8, zIndex: 1 }}>
              <Autocomplete
                array={allSKUs}
                label="SKU"
                value={SKU}
                setValue={setSKU}
                helperText={
                  <HelperText
                    type="error"
                    visible={
                      !!_.get(errors, "sku") || !!_.get(errors, "errorMessage")
                    }
                  >
                    {errors.sku}
                    {errors.errorMessage}
                  </HelperText>
                }
                error={
                  !!_.get(errors, "sku") || !!_.get(errors, "errorMessage")
                }
              />
            </Block>
            <Block flex={0.4} center style={{ width: "100%", zIndex: 0 }}>
              <Button
                color={materialTheme.COLORS.BUTTON_COLOR}
                style={{ width: width*0.8, height: 50 }}
                onPress={handleSkuSearch}
              >
                {route.name.toUpperCase()}
              </Button>
            </Block>
          </Block>
          <Block flex={2} style={{ zIndex: 0 }} center>
            <Block flex={3} middle style={{ zIndex: 0 }}>
              <Text h4 bold style={{ textAlign: "center" }}>
                OR
              </Text>
            </Block>
            <Block flex={3}>
              <Button
                color={materialTheme.COLORS.BUTTON_COLOR}
                style={{ width: width * 0.8, height: 50 }}
                onPress={requestPermissions}
              >
                SCAN QR
              </Button>
            </Block>
          </Block>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            style={{ height: height * 0.8, width: width * 0.9 }}
          >
            <Text
              h3
              bold
              style={{ textAlign: "center", marginTop: width * 0.2 }}
            >
              Scan QR
            </Text>

            {modalVisible && (
              <BarCodeScanner
                onBarCodeScanned={handleQRScanned}
                style={{ ...StyleSheet.absoluteFillObject }}
                barCodeTypes={["qr"]}
              />
            )}

            <Button
              style={{
                position: "absolute",
                width: width * 0.5,
                marginLeft: width * 0.25,
                marginRight: width * 0.25,
                marginTop: height * 0.84
              }}
              color={materialTheme.COLORS.BUTTON_COLOR}
              onPress={() => setModalVisible(false)}
            >
              Close
            </Button>
          </Modal>
        </>
      )}
    </Block>
  );
}

export default Product;
