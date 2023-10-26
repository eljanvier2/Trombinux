import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./src/components/BottomNavBar";
import LoginPage from "./src/pages/LoginPage";
import { getCurrentTheme } from "./src/components/Colors";
import ParametersPage from "./src/settings/ParametersPage";
import ThemePage from "./src/settings/ThemePage";
import { retrieveTheme, retrieveToken } from "./src/Api";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { ThemeProvider } from "./src/components/ThemeContext";
import ProfilePage from "./src/pages/ProfilePage";
import {
  addStuffTest,
  createEmployeeDBSlot,
  Employee,
  Task,
  addEmployeeTask,
  createEmployeeSlots,
} from "./src/Firebase";
import SelectWidgetPage from "./src/settings/SelectWidgetsPage";

const Stack = createStackNavigator();
export default function App() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  const [token, setToken] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState(getCurrentTheme(false));
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      "HammersmithOne-Regular": require("./assets/fonts/HammersmithOne-Regular.ttf"),
    });
    setFontLoaded(true);
  };
  useEffect(() => {
    retrieveToken().then((token) => {
      if (token) {
        setToken(token);
      }
    });
    loadFonts();
  }, []);
  retrieveTheme().then((resTheme) => {
    if (resTheme !== null) {
      setIsDark(resTheme);
      setTheme(getCurrentTheme(resTheme));
    } else {
      setTheme(getCurrentTheme(false));
    }
  });
  if (!fontLoaded) {
    return null;
  }
  if (token) {
    return (
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="App"
              component={BottomTabNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfilePage}
              initialParams={{ theme: theme, userToken: token }}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Parameters"
              component={ParametersPage}
              initialParams={{ theme: theme }}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SelectWidgets"
              component={SelectWidgetPage}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ThemePage"
              component={ThemePage}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginPage}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="App"
            component={BottomTabNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Parameters"
            component={ParametersPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ThemePage"
            component={ThemePage}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
