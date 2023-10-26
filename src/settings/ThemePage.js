import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { getCurrentTheme } from "../components/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { storeTheme } from "../Api";

export default function ThemePage({ route }) {
  const navigation = useNavigation();
  const [theme, setTheme] = useState(route.params.theme);
  const userToken = route.params.userToken;
  const { width, height } = Dimensions.get("window");
  const [fontLoaded, setFontLoaded] = useState(false);
  const buttonSize = Math.min(width, height) * 0.1;
  const [isDark, setIsDark] = useState(getCurrentTheme(route.params.theme).isDark);

  const handleDarkMode = () => {
    setIsDark(!isDark);
    setTheme(getCurrentTheme(isDark));
    storeTheme(isDark);
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
        onPress={() =>
          navigation.navigate("Home", { theme: theme, userToken: userToken })
        }
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
          style={{
            backgroundColor: theme.thirdColor,
            padding: 30,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleDarkMode}
        >
          <Text
            style={{
              color: theme.primaryColor,
              fontFamily: "HammersmithOne-Regular",
              fontSize: 30,
            }}
          >
            {!isDark ? "Dark" : "Light"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
