import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Platform
} from "react-native";
import { Block, Button, Input, Text, theme } from "galio-framework";

import { LinearGradient } from "expo-linear-gradient";
import materialTheme from "src/constants/Theme";

const { width } = Dimensions.get("window");

export default function LogIn(props) {
  const [state, setState] = useState({
    email: "-",
    password: "-",
    active: {
      email: false,
      password: false
    }
  });

  const handleChange = (name, value) => {
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const toggleActive = name => {
    const { active } = state;
    active[name] = !active[name];

    setState(prevState => ({...prevState, active }));
  };

  const { navigation } = props;
  const { email, password } = state;

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0.25, y: 1.1 }}
      locations={[0.2, 1]}
      colors={["#6C24AA", "#15002B"]}
      style={[styles.signin, { flex: 1, paddingTop: theme.SIZES.BASE * 4 }]}
    >
      <Block flex middle>
        <KeyboardAvoidingView behavior="padding" enabled>
          <Block middle>
            <Block
              row
              center
              space="between"
              style={{ marginVertical: theme.SIZES.BASE * 1.875 }}
            >
              <Block flex middle right>
                <Button
                  round
                  onlyIcon
                  iconSize={theme.SIZES.BASE * 1.625}
                  icon="facebook"
                  iconFamily="font-awesome"
                  color={theme.COLORS.FACEBOOK}
                  shadowless
                  iconColor={theme.COLORS.WHITE}
                  style={styles.social}
                  onPress={() => Alert.alert("Not implemented")}
                />
              </Block>
              <Block flex middle center>
                <Button
                  round
                  onlyIcon
                  iconSize={theme.SIZES.BASE * 1.625}
                  icon="twitter"
                  iconFamily="font-awesome"
                  color={theme.COLORS.TWITTER}
                  shadowless
                  iconColor={theme.COLORS.WHITE}
                  style={styles.social}
                  onPress={() => Alert.alert("Not implemented")}
                />
              </Block>
              <Block flex middle left>
                <Button
                  round
                  onlyIcon
                  iconSize={theme.SIZES.BASE * 1.625}
                  icon="dribbble"
                  iconFamily="font-awesome"
                  color={theme.COLORS.DRIBBBLE}
                  shadowless
                  iconColor={theme.COLORS.WHITE}
                  style={styles.social}
                  onPress={() => Alert.alert("Not implemented")}
                />
              </Block>
            </Block>
          </Block>
          <Block middle style={{ paddingVertical: theme.SIZES.BASE * 2.625 }}>
            <Text center color="white" size={14}>
              or be classical
            </Text>
          </Block>
          <Block flex>
            <Block center>
              <Input
                borderless
                color="white"
                placeholder="Email"
                type="email-address"
                autoCapitalize="none"
                bgColor="transparent"
                onBlur={() => toggleActive("email")}
                onFocus={() => toggleActive("email")}
                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                onChangeText={text => handleChange("email", text)}
                style={[
                  styles.input,
                  state.active.email ? styles.inputActive : null
                ]}
              />
              <Input
                password
                viewPass
                borderless
                color="white"
                iconColor="white"
                placeholder="Password"
                bgColor="transparent"
                onBlur={() => toggleActive("password")}
                onFocus={() => toggleActive("password")}
                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                onChangeText={text => handleChange("password", text)}
                style={[
                  styles.input,
                  state.active.password ? styles.inputActive : null
                ]}
              />
              <Text
                color={theme.COLORS.WHITE}
                size={theme.SIZES.FONT * 0.75}
                onPress={() => Alert.alert("Not implemented")}
                style={{
                  alignSelf: "flex-end",
                  lineHeight: theme.SIZES.FONT * 2
                }}
              >
                Forgot your password?
              </Text>
            </Block>
            <Block flex top style={{ marginTop: 20 }}>
              <Button
                shadowless
                color={materialTheme.COLORS.BUTTON_COLOR}
                style={{ height: 48 }}
                onPress={() =>
                  Alert.alert(
                    "Sign in action",
                    `Email: ${email} Password: ${password}`
                  )
                }
              >
                SIGN IN
              </Button>
              <Button
                color="transparent"
                shadowless
                onPress={() => navigation.navigate("Sign Up")}
              >
                <Text
                  center
                  color={theme.COLORS.WHITE}
                  size={theme.SIZES.FONT * 0.75}
                  style={{ marginTop: 20 }}
                >
                  {"Don't have an account? Sign Up"}
                </Text>
              </Button>
            </Block>
          </Block>
        </KeyboardAvoidingView>
      </Block>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  signin: {
    marginTop: 0
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 1
  },
  input: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER
  },
  inputActive: {
    borderBottomColor: "white"
  }
});
