import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from "react-native";
import { Block, Button, Input, Text, theme } from "galio-framework";

import { LinearGradient } from "expo-linear-gradient";
import materialTheme from "src/constants/Theme";
import { Snackbar, Card, TextInput, HelperText } from "react-native-paper";
import { View } from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {staffLogin} from "src/redux/actions/staffActions";
import {clearErrors} from "src/redux/actions";

const { width, height } = Dimensions.get("window");
const _ = require("lodash");

export default function LogIn(props) {
  const { navigation } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);

  const handleLogin = () => {
    const staffLoginRequest = {username, password};
    dispatch(staffLogin(staffLoginRequest, setSnackbarOpen));
  }

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0.25, y: 1.1 }}
      locations={[0.2, 1]}
      colors={["#F08B6A","#F8A175" ]}
      style={[styles.signin, { flex: 1, paddingTop: theme.SIZES.BASE * 4 }]}
    >
      <Block middle>
        <KeyboardAvoidingView behaviour="padding" enabled>
          <Block flex={2} middle style={{ justifyContent: "flex-end" }}>
            <Text h1 color="white" style={{ marginBottom: 20 }}>
              apricot & nut
            </Text>
          </Block>
          <Block
            flex={3}
            middle
            card
            shadow
            style={{
              backgroundColor: "rgba(255,255,255,0.90)",
              width: width * 0.9,
              paddingTop: 20
            }}
          >
            <Block flex={1} style={{width: width * 0.75}}>
              <TextInput
                label="Username"
                onChangeText={text => {
                  setUsername(text)
                  dispatch(clearErrors());
                }}
                style={{ backgroundColor: "transparent"}}
                error={!_.isEmpty(errors)}
              />
              <HelperText type="error" visible={!_.isEmpty(errors)}>
                {errors.username}
              </HelperText>
            </Block>

            <Block flex={1} style={{width: width * 0.75, marginTop: 15}}>
              <TextInput
                label="Password"
                secureTextEntry
                onChangeText={text => {
                  setPassword(text)
                  dispatch(clearErrors());
                }}
                style={{ backgroundColor: "transparent"}}
                error={!_.isEmpty(errors)}
              />
              <HelperText type="error" visible={!_.isEmpty(errors)}>
                {errors.password}
              </HelperText>
            </Block>

            <Block flex={2} middle>
              <Button
                shadowless
                color={materialTheme.COLORS.BUTTON_COLOR}
                style={{ marginTop: 0, height: 50, width: width * 0.75}}
                onPress={handleLogin}
              >
                LOG IN
              </Button>
            </Block>
          </Block>
          <Block flex={2} />
        </KeyboardAvoidingView>
      </Block>
      <Snackbar
        visible={snackbarOpen}
        duration={2000}
        onDismiss={() => setSnackbarOpen(false)}
        action={{
          label: "Ok",
          onPress: () => {
            setSnackbarOpen(false);
          }
        }}
        style={{ marginBottom: height - 70, backgroundColor: "green"}}

      >
        Logged in!
      </Snackbar>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  signin: {
    marginTop: 0
  }
});
