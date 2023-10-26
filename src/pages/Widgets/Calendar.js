import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentTheme } from "../../components/Colors";
import * as Font from "expo-font";
isDark = getCurrentTheme().isDark;
const theme = getCurrentTheme(isDark);

export default function CalendarWidget() {
  const [todayEvents, setTodayEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [eventName, setEventName] = useState("");
  const [mydate, setDate] = useState(new Date());
  const [dateString, setDateString] = useState("");
  const [startHour, setStartHour] = useState(new Date());
  const [startHourString, setStartHourString] = useState("");
  const [endHour, setEndHour] = useState(new Date());
  const [endHourString, setEndHourString] = useState("");
  const [displaymode, setMode] = useState("date");
  const [isDisplayDate, setShowDate] = useState(false);
  const [isDisplayHour, setShowHour] = useState(false);
  const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || mydate;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    const dateString = `${year}-${month}-${day}`;
    setDate(currentDate);
    setDateString(dateString);
    hideModeDate();
  };

  const events = [
    {
      date: "2023-09-07",
      startTime: "14:00",
      endTime: "16:00",
      name: "Lunch with Paul",
    },
    {
      date: "2023-09-07",
      startTime: "22:00",
      endTime: "23:00",
      name: "Meeting with John",
    },
    {
      date: "2023-09-07",
      startTime: "19:00",
      endTime: "20:00",
      name: "Lunch with Jane",
    },
    {
      date: "2023-09-07",
      startTime: "18:00",
      endTime: "20:00",
      name: "Lunch with",
    },
    {
      date: "2023-09-07",
      startTime: "17:00",
      endTime: "20:00",
      name: "Lunch Jane",
    },
    {
      date: "2023-09-15",
      startTime: "17:30",
      endTime: "23:00",
      name: "After-work Dionysos",
    },
    {
      date: "2023-09-07",
      startTime: "23:00",
      endTime: "20:00",
      name: "Lunch",
    },
    {
      date: "2022-10-25",
      startTime: "18:00",
      endTime: "20:00",
      name: "Gym workout",
    },
  ];

  const storeEvent = async (event) => {
    try {
      console.log("event saved:", event);
      await AsyncStorage.setItem("@MySuperStore:events", JSON.stringify(event));
    } catch (error) {
      console.log("Error saving event:", error);
    }
  };

  const retrieveEvent = async () => {
    try {
      const event = await AsyncStorage.getItem("@MySuperStore:events");
      console.log("event retrieved:", event);
      return JSON.parse(event);
    } catch (error) {
      console.log("Error retrieving event:", error);
    }
  };

  const changeSelectedStartHour = (event, selectedHour) => {
    const currentHour = selectedHour || startHour;
    const hours = selectedHour.getHours();
    let minutes = selectedHour.getMinutes();

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    const startHourString = `${hours}:${minutes}`;
    setStartHour(currentHour);
    setStartHourString(startHourString);
    console.log("heure de début = ", startHourString);
  };

  const changeSelectedEndHour = (event, selectedHour) => {
    const currentHour = selectedHour || endHour;
    const hours = selectedHour.getHours();
    let minutes = selectedHour.getMinutes();

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    const endHourString = `${hours}:${minutes}`;
    setEndHour(currentHour);
    setEndHourString(endHourString);
    console.log("heure de fin = ", endHourString);
  };

  //const [events, setEvents] = React.useState([]);
  const getCurrentDayName = () => {
    const options = { weekday: "long", timeZone: "UTC" };
    const date = new Date().toLocaleDateString("fr-FR", options);
    return date.charAt(0).toUpperCase() + date.slice(1);
  };
  const currentDayName = getCurrentDayName();
  console.log(currentDayName.split(" "[0]));

  function getTodayEvents(events) {
    const today = new Date();
    const todayDateString = today.toISOString().slice(0, 10);
    const currentTimeString = today.toTimeString().slice(0, 5);
    console.log(todayDateString);
    const todayEvents = events.filter((event) => {
      if (event.date !== todayDateString) {
        return false;
      }
      const eventEndTimeString = event.endTime.slice(0, 5);
      return eventEndTimeString >= currentTimeString;
    });
    todayEvents.sort((a, b) => {
      const aDate = new Date(`${a.date} ${a.startTime}`);
      const bDate = new Date(`${b.date} ${b.startTime}`);
      return aDate - bDate;
    });
    return todayEvents;
  }

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleEventNameChange = (text) => {
    setEventName(text);
  };

  const showModeDate = (currentMode) => {
    setShowDate(true);
    setMode(currentMode);
  };

  const hideModeDate = () => {
    setShowDate(false);
  };

  const showModeHour = (currentMode) => {
    setShowHour(true);
    setMode(currentMode);
  };

  const hideModeHour = () => {
    setShowHour(false);
  };

  const displayDatePicker = () => {
    showModeDate("date");
  };

  const displayHourPicker = () => {
    showModeHour("time");
  };

  const addEvent = () => {
    if (
      eventName === "" ||
      dateString === "" ||
      startHourString === "" ||
      endHourString === ""
    ) {
      return;
    }
    let tempStart = startHourString;
    let tempEnd = endHourString;
    let tempHour = "";
    if (startHourString > endHourString) {
      tempHour = tempStart;
      tempStart = tempEnd;
      tempEnd = tempHour;
    }
    const newEvent = {
      date: dateString,
      startTime: tempStart,
      endTime: tempEnd,
      name: eventName,
    };
    setTodayEvents((prevEvents) => [...prevEvents, newEvent]);
    setIsModalVisible(false);
    storeEvent([...todayEvents, newEvent]);
    setEventName("");
    setDateString("");
    setStartHourString("");
    setEndHourString("");
  };

  useEffect(() => {
    setTodayEvents(getTodayEvents(events));
    console.log(todayEvents);
    const loadFonts = async () => {
      await Font.loadAsync({
        "HammersmithOne-Regular": require("../../../assets/fonts/HammersmithOne-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
    retrieveEvent().then((resEvent) => {
      console.log("resEvent: ", resEvent);
      if (resEvent) {
        setEvents(resEvent);
      }
    });
  }, []);
  console.log(todayEvents);
  return (
    <View
      style={[
        styles.container,
        { borderColor: theme.fourthColor, borderWidth: 1 },
      ]}
    >
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.day}>
          {currentDayName.split(" "[0])[0].toUpperCase()}
        </Text>
        <Text style={styles.dayNumber}>
          {currentDayName.split(" "[0])[1].split("/")[0][0] == 0
            ? currentDayName.split(" "[0])[1].split("/")[0][1]
            : currentDayName.split(" "[0])[1].split("/")[0]}
        </Text>
        <FlatList
          scrollEnabled={false}
          style={{ paddingBottom: 10 }}
          data={todayEvents}
          keyExtractor={(item) => item.name}
          renderItem={({ item, index }) => (
            <View style={styles.eventTile}>
              <View
                style={[
                  styles.separator,
                  { backgroundColor: index % 2 === 0 ? "#6FDB6F" : "red" },
                ]}
              />
              <View
                style={[
                  styles.eventContainer,
                  {
                    backgroundColor: index % 2 === 0 ? "#E0FCE0" : "#FCE0E0",
                  },
                ]}
              >
                <Text style={styles.event}>{item.name}</Text>
                <Text style={styles.event}>
                  {item.startTime} - {item.endTime}
                </Text>
              </View>
            </View>
          )}
        />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              {
                textAlign: "center",
                fontSize: 18,
                fontFamily: "HammersmithOne-Regular",
                backgroundColor: theme.primaryColor,
                width: "50%",
                borderRadius: 10,
                top: "25%",
                left: "25%",
              },
            ]}
            placeholder="Nom de l'évènement"
            placeholderTextColor={
              isDark ? theme.thirdColor : theme.secondaryColor
            }
            value={eventName}
            onChangeText={handleEventNameChange}
          />
          <View
            style={{
              top: "30%",
              left: "25%",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={displayDatePicker}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontFamily: "HammersmithOne-Regular",
                  backgroundColor: theme.primaryColor,
                  width: "75%",
                  borderRadius: 10,
                }}
              >
                Choisir une date
              </Text>
            </TouchableOpacity>
            {isDisplayDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={mydate}
                mode={displaymode}
                is24Hour={true}
                display="default"
                onChange={changeSelectedDate}
              />
            )}
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontFamily: "HammersmithOne-Regular",
                width: "30%",
                color: "red",
              }}
            >
              Date choisie: {dateString}
            </Text>
          </View>
          <View
            style={{
              top: "40%",
              left: "60%",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={displayHourPicker}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontFamily: "HammersmithOne-Regular",
                  backgroundColor: theme.primaryColor,
                  width: "75%",
                  borderRadius: 10,
                }}
              >
                Choisir une heure
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              top: "50%",
              left: "25%",
              flexDirection: "row",
            }}
          >
            {/*Appel heure de début*/}
            {isDisplayHour && (
              <DateTimePicker
                testID="startTimePicker"
                value={startHour}
                mode={displaymode}
                is24Hour={true}
                display="default"
                onChange={changeSelectedStartHour}
              />
            )}
            {/*Appel heure de fin*/}
            {isDisplayHour && (
              <DateTimePicker
                testID="endTimePicker"
                value={endHour}
                mode={displaymode}
                is24Hour={true}
                display="default"
                onChange={changeSelectedEndHour}
              />
            )}

            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontFamily: "HammersmithOne-Regular",
                width: "40%",
              }}
            >
              {startHourString < endHourString
                ? `Heure de début: ${startHourString}`
                : `Heure de début: ${endHourString}`}
            </Text>

            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontFamily: "HammersmithOne-Regular",
                width: "30%",
              }}
            >
              {endHourString > startHourString
                ? `Heure de fin: ${endHourString}`
                : `Heure de fin: ${startHourString}`}
            </Text>
          </View>
          <TouchableOpacity onPress={addEvent} style={styles.saveButton}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontFamily: "HammersmithOne-Regular",
                color: theme.fourthColor,
              }}
            >
              Sauvegarder
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EBEBEB",
    borderRadius: 20,
    width: "40%",
    maxHeight: 200,
  },
  day: {
    paddingHorizontal: 15,
    paddingTop: 15,
    color: "red",
  },
  dayNumber: {
    paddingHorizontal: 15,
    paddingTop: 5,
    color: "black",
    fontWeight: "bold",
    fontSize: 30,
  },
  eventTile: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  eventContainer: {
    width: "80%",
    marginVertical: 5,
    marginLeft: "5%",
    marginRight: "10%",
    borderRadius: 5,
  },
  event: {
    paddingLeft: 5,
  },
  separator: {
    width: 4,
    backgroundColor: "red",
    height: "70%",
    borderRadius: 2,
    marginLeft: "5%",
  },
  closeButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    color: "red",
    width: "50%",
    height: 50,
  },
});
