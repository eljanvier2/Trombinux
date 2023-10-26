import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Trombinoscope from "../pages/Trombinoscope";
import WidgetsPage from "../pages/WidgetsPage";
import LoginPage from "../pages/LoginPage";
import { StatusBar } from "expo-status-bar";
import { View, TouchableOpacity } from "react-native";
import { getCurrentTheme } from "./Colors";
import TaskList from "../pages/TaskList";
import { useEffect, useState } from "react";
import { retrieveToken, retrieveTheme, retrieveDisplayedWidgets } from "../Api";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function BottomTabNavigator({ navigation }) {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState(getCurrentTheme(false));
  const [fontLoaded, setFontLoaded] = useState(false);
  const [userToken, setUserToken] = useState(null); // declare userToken state variable
  const [displayedWidgets, setDisplayedWidgets] = useState([]);
  const handleParametersPress = () => {
    navigation.navigate("Parameters");
    console.log("Parameters button pressed");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile", userToken);
    console.log("Profile button pressed");
  };
  const screenOptions = {
    backgroundColor: theme.primaryColor,
    headerTitleAlign: "center",
    headerTitle: "Trombinux",
    headerRight: () => (
      <TouchableOpacity onPress={handleParametersPress}>
        <MaterialCommunityIcons
          name="cog"
          size={30}
          color={theme.fourthColor}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
    ),
    headerLeft: () => (
      <TouchableOpacity onPress={handleProfilePress}>
        <MaterialCommunityIcons
          name="account"
          size={30}
          color={theme.fourthColor}
          style={{ marginLeft: 20 }}
        />
      </TouchableOpacity>
    ),
    headerTitleStyle: {
      fontSize: 35,
      fontFamily: "HammersmithOne-Regular",
      color: theme.fourthColor,
    },
    headerStyle: {
      backgroundColor: theme.primaryColor,
      shadowColor: "transparent",
    },
    tabBarStyle: {
      backgroundColor: theme.fourthColor,
      height: 80,
      borderTopLeftColor: theme.secondaryColor,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    tabBarContainerStyle: {
      backgroundColor: theme.secondaryColor,
    },
    tabBarItemStyle: {
      margin: 5,
      borderRadius: 30,
    },
    tabBarInactiveTintColor: theme.primaryColor,
    tabBarActiveTintColor: theme.primaryColor,
    tabBarActiveBackgroundColor: theme.secondaryColor,
  };
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "HammersmithOne-Regular": require("../../assets/fonts/HammersmithOne-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
    retrieveToken().then((resToken) => {
      if (resToken) {
        setUserToken(resToken);
      }
    });
  }, []);
  retrieveTheme().then((resTheme) => {
    console.log(resTheme);
    console.log(isDark);
    console.log(resTheme !== isDark);
    if (resTheme === null) {
      setTheme(getCurrentTheme(false));
    } else if (resTheme != isDark) {
      console.log("NNNNNNNNNN");
      setIsDark(resTheme);
      setTheme(getCurrentTheme(resTheme));
    }
  });
  retrieveDisplayedWidgets().then((resDisplayedWidgets) => {
    if (
      resDisplayedWidgets !== null &&
      JSON.stringify(resDisplayedWidgets) !== JSON.stringify(displayedWidgets)
    ) {
      setDisplayedWidgets(resDisplayedWidgets);
    }
  });
  if (!fontLoaded || !userToken) {
    return null;
  }
  return (
    <View style={{ backgroundColor: theme.primaryColor, flex: 1 }}>
      <Tab.Navigator {...{ screenOptions }} initialRouteName="Home">
        <Tab.Screen
          name="Apps"
          component={Trombinoscope}
          initialParams={{
            userToken: userToken,
            theme: theme,
          }}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="apps" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Home"
          component={WidgetsPage}
          initialParams={{
            userToken: userToken,
            theme: theme,
            displayedWidgets: displayedWidgets,
          }}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Work"
          component={TaskList}
          initialParams={{ userToken: userToken, theme: theme }}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="briefcase"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default BottomTabNavigator;
