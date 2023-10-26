import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import ThemePage from "./ThemePage";
import { getCurrentTheme } from "../components/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import LoginPage from "../pages/LoginPage";
import { apiLogin, storeToken, userLogin } from "../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ParametersPage({ route }) {
  const navigation = useNavigation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState(route.params.theme);
  const userToken = route.params.userToken;
  const { width, height } = Dimensions.get("window");
  const [fontLoaded, setFontLoaded] = useState(false);
  const buttonSize = Math.min(width, height) * 0.1;

  const handleLogout = async () => {
    await storeToken("");
    navigation.navigate("Login");
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

  return (
    <View
      style={{
        backgroundColor: theme.primaryColor,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: buttonSize / 4,
          left: buttonSize / 4,
          width: buttonSize,
          height: buttonSize,
          marginTop: 30,
        }}
        onPress={() => navigation.navigate("Home")}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={50}
          color={theme.fourthColor}
        />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.thirdColor, width: "90%", marginRight: 20, marginLeft: 20 }]}
          onPress={() => navigation.navigate("ThemePage", { theme, userToken })}
        >
          <Text style={[styles.buttonText, { color: theme.primaryColor }]}>
            Modifier le thème
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.thirdColor, width: "90%" , marginRight: 20, marginLeft: 20}]}
          onPress={() => navigation.navigate("SelectWidgets", { theme, userToken })}
        >
          <Text style={[styles.buttonText, { color: theme.primaryColor, textAlign: "center" }]}>
            Modifier les Widgets affichés
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.thirdColor }]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, { color: theme.primaryColor }]}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    padding: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "HammersmithOne-Regular",
    fontSize: 30,
  },
});
