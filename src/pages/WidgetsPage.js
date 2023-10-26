import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import citationData from "../../assets/citation.json";
import Citations from "./Widgets/Citations";
import axios from "axios";
import WeatherWidget from "./Widgets/Weather";
import CalendarWidget from "./Widgets/Calendar";
import ChatWidget from "./Widgets/Chat";
import CurrentDate from "../components/Date";
import { getCurrentUser, storeId } from "../Api";
import * as Font from "expo-font";
import StickyNote from "./Widgets/StickyNote";
import MapDisplay from "./Widgets/Map";
import ChuckNorrisFacts from "./Widgets/ChuckNorrisFacts";
import NewsWidget from "./Widgets/News";

export default function WidgetsPage({ route }) {
  const [currentUser, setCurrentUser] = useState({});
  const [userToken, setUserToken] = useState(route.params.userToken);
  const [theme, setTheme] = useState(route.params.theme);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [widgetsHeight, setWidgetsHeight] = useState(0);
  const widgetsRef = useRef(null);
  const [displayedWidgets, setDisplayedWidgets] = useState(
    route.params.displayedWidgets == null ||
      route.params.displayedWidgets == undefined ||
      route.params.displayedWidgets.length == 0
      ? [true, true, true, true, true, true, true, true]
      : route.params.displayedWidgets
  );
  const loadCurrentUser = async (token) => {
    const newCurrentUser = await getCurrentUser(token);
    if (newCurrentUser == null) {
      return;
    }
    setCurrentUser(newCurrentUser);
    storeId(newCurrentUser.id);
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      "HammersmithOne-Regular": require("../../assets/fonts/HammersmithOne-Regular.ttf"),
    });
    setFontLoaded(true);
  };
  useEffect(() => {
    loadCurrentUser(userToken);
    loadFonts();
  }, []);

  useEffect(() => {
    if (widgetsRef.current) {
      const height = Array.from(widgetsRef.current.children).reduce(
        (acc, child) => acc + child.offsetHeight,
        0
      );
      setWidgetsHeight(height);
    }
  }, [widgetsRef]);
  useEffect(() => {
    setTheme(route.params.theme);
  }, [route.params.theme]);
  useEffect(() => {
    if (route.params.displayedWidgets != (null || undefined)) {
      setDisplayedWidgets(route.params.displayedWidgets);
    }
  }, [route.params.displayedWidgets]);
  const handleButtonPress = () => {
    setModalVisible(true);
  };
  const containerStyle = {
    flex: 1,
    backgroundColor: theme.primaryColor,
    alignItems: "center",
    justifyContent: "top",
  };
  return (
    <ScrollView
      contentContainerStyle={containerStyle}
      contentInset={{
        bottom: displayedWidgets[5]
          ? "900%"
          : 100 * displayedWidgets.length + "%",
        top: 0,
      }}
      backgroundColor={theme.primaryColor}
    >
      <Text> </Text>
      <View style={styles.welcome}>
        <Text
          style={{
            color: theme.fourthColor,
            fontFamily: "HammersmithOne-Regular",
            fontSize: 24,
            textAlign: "left",
          }}
        >
          Bonjour {currentUser.name}!
        </Text>
        <CurrentDate theme={theme} />
      </View>
      <Text></Text>
      {displayedWidgets[0] ? (
        <View>
          <WeatherWidget />
        </View>
      ) : null}
      <Text></Text>
      {displayedWidgets[1] ? (
        <View style={styles.widgetsContainer}>
          <MapDisplay theme={theme} />
        </View>
      ) : null}
      <Text></Text>
      {displayedWidgets[2] || displayedWidgets[3] ? (
        <View style={styles.widgetsContainer}>
          {displayedWidgets[2] ? <Citations theme={theme} /> : null}
          {displayedWidgets[3] ? <CalendarWidget /> : null}
        </View>
      ) : null}
      {displayedWidgets[4] ? (
        <View>
          <ChuckNorrisFacts theme={theme} />
        </View>
      ) : null}
      <Text></Text>
      {displayedWidgets[5] ? (
        <View>
          <NewsWidget theme={theme} />
        </View>
      ) : null}
      {displayedWidgets[6] ? (
        <View style={styles.widgetsContainer}>
          <StickyNote theme={theme} />
        </View>
      ) : null}
      {displayedWidgets[7] ? (
        <TouchableOpacity onPress={() => handleButtonPress()}>
          <View
            style={[
              styles.widgetsContainer,
              {
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
                width: "100%",
              },
            ]}
          >
            <ChatWidget
              username={currentUser.name}
              userId={currentUser.id}
              userToken={userToken}
              theme={theme}
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  welcome: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginLeft: "10%",
  },
  widgetsContainer: {
    flexDirection: "row",
    width: "100%",
  },
  citationsContainer: {
    marginRight: 10,
  },
});
