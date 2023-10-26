import React, { useState, useEffect } from "react";
import { getCurrentTheme } from "../components/Colors";
isDark = getCurrentTheme().isDark;
const theme = getCurrentTheme(isDark);

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import * as Font from "expo-font";
import { apiLogin, storeToken, userLogin } from "../Api";

export default function LoginPage({ navigation }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [fontLoaded, setFontLoaded] = useState(false);

  const handleLoginChange = (text) => {
    setLogin(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "HammersmithOne-Regular": require("../../assets/fonts/HammersmithOne-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  const handleLoginPress = () => {
    console.log(`Login: ${login}, Password: ${password}`);
    if (login == "" || password == "") {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
      return;
    }
    userLogin(login, password)
      .then((response) => {
        console.log(`Login successful with status code ${response.status}`);
        console.log(`EEEEEEEEEEEEEEEEEEE : ` + response.token);
        storeToken(response.token)
        navigation.navigate("App");
      })
      .catch((status) => {
        console.log(`Login failed with status code ${status}`);
        if (status == 500)
          apiLogin(login, password).then((status) => {
            console.log(`Login successful with status code ${status}`);
            navigation.navigate("App");
          });
        else {
          ToastAndroid.show("Incorrect email or password", ToastAndroid.SHORT);
        }
      });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primaryColor,
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    inputContainer: {
      width: "90%",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
    },
    buttonText: {
      fontSize: 24,
      color: theme.primaryColor,
    },
    button: {
      height: 70,
      width: "50%",
      padding: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.thirdColor,
      borderRadius: 35,
    },
    input: {
      borderWidth: 3,
      borderColor: theme.fourthColor,
      borderRadius: 35,
      padding: 8,
      marginVertical: 8, // Modified property
      width: "80%",
      height: 70,
      textAlign: "center",
      paddingLeft: 0,
      fontSize: 30,
      fontFamily: "HammersmithOne-Regular",
    },
  });

  return (
    <View style={styles.container}>
      {fontLoaded ? (
        <>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "HammersmithOne-Regular",
                fontSize: 36,
                color: theme.fourthColor,
              },
            ]}
          >
            Trombinux
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  textAlign: login == "" ? "center" : "left",
                  paddingLeft: login == "" ? 0 : 20,
                  fontSize: login == "" ? 30 : 18,
                  fontFamily: "HammersmithOne-Regular",
                },
              ]}
              placeholder="ID"
              placeholderTextColor={
                isDark ? theme.thirdColor : theme.secondaryColor
              }
              value={login}
              onChangeText={handleLoginChange}
            />
            <TextInput
              style={[
                styles.input,
                {
                  textAlign: password == "" ? "center" : "left",
                  paddingLeft: password == "" ? 0 : 20,
                  fontSize: password == "" ? 30 : 18,
                  fontFamily: "HammersmithOne-Regular",
                },
              ]}
              placeholder="Mot de passe"
              placeholderTextColor={
                isDark ? theme.thirdColor : theme.secondaryColor
              }
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
            <Text
              style={[
                styles.buttonText,
                { fontFamily: "HammersmithOne-Regular" },
              ]}
            >
              Connexion
            </Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}
