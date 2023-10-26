import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  View,
} from "react-native";
import * as Font from "expo-font";
import {
  retrieveDisplayedWidgets,
  retrieveId,
  storeDisplayedWidgets,
} from "../Api";
import { TextInput } from "react-native-gesture-handler";
import { addEmployeeTasks, getEmployeeTasks } from "../Firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SelectWidgetPage({ route }) {
  const navigation = useNavigation();
  const [displayedWidgets, setDisplayedWidgets] = useState([]);
  const [theme, setTheme] = useState(route.params.theme);
  const [userToken, setUserToken] = useState(route.params.userToken);
  const [fontLoaded, setFontLoaded] = useState(false);

  const handleCheckboxChange = (index) => {
    setDisplayedWidgets((prevWidgets) => {
      const newWidgets = [...prevWidgets];
      newWidgets[index] = !newWidgets[index];
      storeDisplayedWidgets(newWidgets);
      return newWidgets;
    });
  };

  const handleButtonPress = () => {
    navigation.navigate("Home", {
      theme: theme,
      userToken: userToken,
      displayedWidgets: displayedWidgets,
    });
  };

  const widgetNames = [
    "Weather",
    "Map",
    "Citations",
    "Calendar",
    "Chuck Norris Facts",
    "News",
    "Notes",
    "Chat",
  ];

  useEffect(() => {
    retrieveDisplayedWidgets().then((res) => {
      if (res == null) {
        setDisplayedWidgets([true, true, true, true, true, true, true, true]);
      } else {
        setDisplayedWidgets(res);
      }
    });
    const loadFonts = async () => {
      await Font.loadAsync({
        "HammersmithOne-Regular": require("../../assets/fonts/HammersmithOne-Regular.ttf"),
        ...MaterialCommunityIcons.font,
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);
  const { width, height } = Dimensions.get("window");
  const buttonSize = Math.min(width, height) * 0.1;

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: buttonSize / 2,
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
      <View style={styles.title}>
        <Text style={[styles.remainingTasks, { color: theme.fourthColor }]}>
          Selectionnez les widgets que vous voulez afficher
        </Text>
      </View>
      <View style={styles.taskList}>
        <FlatList
          numColumns={2}
          data={displayedWidgets.slice(0, widgetNames.length)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.taskContainer}
          renderItem={({ item, index }) => (
            <View style={styles.taskContainer2}>
              <TouchableOpacity onPress={() => handleCheckboxChange(index)}>
                <MaterialCommunityIcons
                  style={[styles.checkbox, { color: theme.fourthColor }]}
                  name={
                    !item ? "checkbox-blank-outline" : "checkbox-marked-outline"
                  }
                />
                <Text
                  style={[
                    styles.widgetName,
                    { color: theme.fourthColor, textAlign: "center" },
                  ]}
                >
                  {widgetNames[index]}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity
          onPress={handleButtonPress}
          style={[styles.saveButton, { backgroundColor: theme.fourthColor }]}
        >
          <Text
            style={{
              color: theme.primaryColor,
              fontFamily: "HammersmithOne-Regular",
              fontSize: 24,
            }}
          >
            Sauvegarder
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  taskList: {
    width: "80%",
  },
  taskContainer: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  taskContainer2: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  title: {
    alignItems: "center",
    marginTop: 100,
    width: "80%",
  },
  checkbox: {
    fontSize: 24,
    alignSelf: "center",
  },
  remainingTasks: {
    fontSize: 24,
    fontFamily: "HammersmithOne-Regular",
    marginVertical: 10,
    textAlign: "center",
  },
  widgetName: {
    flex: 1,
    marginRight: 10,
    fontSize: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 40,
    textAlign: "center",
  },
  saveButton: {
    width: 200,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 50,
  },
});
