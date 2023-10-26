import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import ThemePage from "../settings/ThemePage";
import { getCurrentTheme } from "../components/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import LoginPage from "./LoginPage";
import { apiLogin, getEmployeePhoto, storeToken, userLogin } from "../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../Api";

export default function ProfilePage({ route }) {
  const navigation = useNavigation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState(route.params.theme);
  const userToken = route.params.userToken;
  const { width, height } = Dimensions.get("window");
  const [fontLoaded, setFontLoaded] = useState(false);
  const buttonSize = Math.min(width, height) * 0.1;
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserPhoto, setCurrentUserPhoto] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    getCurrentUser(userToken).then((response) => {
      if (response != null) {
        setError(false);
        setCurrentUser(response);
        getEmployeePhoto(userToken, response.id).then((response) => {
          const base64Url = `data:image/png;base64,${response}`;
          setCurrentUserPhoto(base64Url);
        });
      } else {
        setError(true);
      }
    });
    const loadFonts = async () => {
      await Font.loadAsync({
        "HammersmithOne-Regular": require("../../assets/fonts/HammersmithOne-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);
  if (!error) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.primaryColor }}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: buttonSize / 4,
            left: buttonSize / 4,
            width: buttonSize,
            height: buttonSize,
            marginTop: 30,
          }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={50}
            color={theme.fourthColor}
          />
        </TouchableOpacity>
        <View
          style={{
            paddingTop: 50,
            alignSelf: "center",
            backgroundColor: theme.primaryColor,
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Your Profile</Text>
        </View>
        <View
          style={{
            backgroundColor: theme.primaryColor,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 50,
            paddingBottom: 20,
          }}
        >
          {currentUserPhoto != "" ? (
            <Image
              source={{ uri: currentUserPhoto }}
              style={{ width: 200, height: 200, borderRadius: 100 }}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle"
              size={210}
              width={200}
              height={200}
              color={theme.fourthColor}
            />
          )}
          <Text style={{ fontSize: 28, fontWeight: "bold", marginTop: 10 }}>
            {currentUser.gender == "Male"
              ? "Mr. "
              : currentUser.gender == "Female"
              ? "Mrs. "
              : ""}
            {currentUser.name} {currentUser.surname}
          </Text>
          <Text style={{ fontSize: 24, marginTop: 5 }}>{currentUser.work}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ textAlign: "center", fontSize: 20 }}>E-mail: </Text>
            <Text
              style={{
                color: "blue",
                textDecorationLine: "underline",
                textAlign: "center",
                fontSize: 20,
              }}
            >
              {currentUser.email}
            </Text>
          </View>
          {currentUserPhoto != "" ? (
            <Text style={{ textAlign: "center", fontSize: 20 }}>
              Birthdate: {currentUser.birth_date}
            </Text>
          ) : null}
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: theme.primaryColor }}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: buttonSize / 4,
            left: buttonSize / 4,
            width: buttonSize,
            height: buttonSize,
            marginTop: 30,
          }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={50}
            color={theme.fourthColor}
          />
        </TouchableOpacity>
        <View
          style={{
            paddingTop: 50,
            alignSelf: "center",
            backgroundColor: theme.primaryColor,
          }}
        ></View>
        <View style={{ alignSelf: "center", marginTop: "50%" }}>
          <Text
            style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}
          >
            Desole, nous n'avons pas pu recuperer les informations de votre
            profil
          </Text>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginTop: 30,
              backgroundColor: theme.fourthColor,
              paddingVertical:30
            }}
          >
            <Text style={{ color: theme.primaryColor, fontSize:24 }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
