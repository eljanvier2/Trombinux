import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function StickyNote(props) {
  const notes = [];
  const [data, setData] = React.useState(notes);
  const [numberData, setNumberData] = React.useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  const buttonSize = Math.min(width, height) * 0.1;
  const [fontLoaded, setFontLoaded] = useState(false);
  const { theme } = props;
  const storeNotes = async (notes) => {
    try {
      console.log("Notes saved:", notes);
      await AsyncStorage.setItem("@MySuperStore:notes", JSON.stringify(notes));
    } catch (error) {
      console.log("Error saving notes:", error);
    }
  };

  const retrieveNotes = async () => {
    try {
      const notes = await AsyncStorage.getItem("@MySuperStore:notes");
      console.log("Notes retrieved:", notes);
      return JSON.parse(notes);
    } catch (error) {
      console.log("Error retrieving notes:", error);
    }
  };

  const storeNotesNumber = async (notesNumber) => {
    try {
      console.log("NotesNumber saved:", notesNumber);
      await AsyncStorage.setItem(
        "@MySuperStore:notesNumber",
        JSON.stringify(notesNumber)
      );
    } catch (error) {
      console.log("Error saving notes:", error);
    }
  };

  const retrieveNotesNumber = async () => {
    try {
      const notesNumber = await AsyncStorage.getItem(
        "@MySuperStore:notesNumber"
      );
      console.log("NotesNumber retrieved:", notesNumber);
      return JSON.parse(notesNumber);
    } catch (error) {
      console.log("Error retrieving notes:", error);
    }
  };

  function saveNotes(index) {
    const first = data.slice(0, index + 1);
    console.log(first);
    storeNotes([...first]);
  }

  function handleOnPress(index) {
    setNumberData((index) => index + 1);
    const first = data.slice(0, index + 1);
    setData([...first, { id: index + 1, name: "" }]);
    storeNotes([...first, { id: index + 1, name: "" }]);
    storeNotesNumber(index + 1);
  }

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "HammersmithOne-Regular": require("../../../assets/fonts/HammersmithOne-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
    retrieveNotes().then((resNotes) => {
      console.log("resNotes: ", resNotes);
      if (resNotes) {
        setData(resNotes);
      }
    });
    retrieveNotesNumber().then((resNotesNumber) => {
      console.log("resNotes: ", resNotesNumber);
      if (resNotesNumber) {
        setNumberData(resNotesNumber);
      }
    });
    setData(notes);
    setNumberData(data.length);
  }, []);
  if (!fontLoaded) {
    return null;
  }
  console.log(notes);
  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ padding: "15%" }}>
          <TouchableOpacity
            style={{
              position: "absolute",
              marginTop: "20%",
              left: "2%",
              width: buttonSize,
              height: buttonSize,
            }}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={50}
              color={theme.fourthColor}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: theme.fourthColor,
              textAlign: "center",
              fontSize: 26,
              fontFamily: "HammersmithOne-Regular",
            }}
          >
            Notes
          </Text>
        </View>
        <ScrollView>
          {data.map((note, index) => {
            return (
              <View key={note.id}>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: theme.secondaryColor },
                  ]}
                >
                  <TextInput
                    multiline
                    style={styles.noteBox}
                    value={note.name}
                    onChangeText={(text) => {
                      const newData = [...data];
                      newData[index].name = text;
                      setData(newData);
                    }}
                    key={index}
                  ></TextInput>
                  <TouchableOpacity
                    style={{ left: "85%" }}
                    onPress={() => {
                      const newData = [...data];
                      newData.splice(index, 1);
                      setData(newData);
                      storeNotes(newData);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          <View style={styles.containerButton}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.thirdColor }]}
              onPress={() => saveNotes(numberData)}
            >
              <Text style={[styles.textButton, { color: theme.primaryColor }]}>
                Sauvegarder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.thirdColor }]}
              onPress={() => handleOnPress(numberData)}
            >
              <Text style={[styles.textButton, { color: theme.primaryColor }]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
      <Pressable
        style={[
          styles.button,
          styles.buttonOpen,
          { backgroundColor: theme.fourthColor },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.textStyle, { color: theme.primaryColor }]}>
          {data.length > 0 ? data[0].name : "No notes yet"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerButton: {
    flexDirection: "row",
  },
  saveButton: {
    width: 200,
    height: 50,
    left: "40%",
    paddingLeft: "0.25%",
    paddingTop: "1.25%",
    borderRadius: 30,
    alignItems: "center",
  },
  addButton: {
    width: 50,
    height: 50,
    left: "100%",
    paddingLeft: "0.25%",
    paddingTop: "1.25%",
    borderRadius: 30,
    alignItems: "center",
  },
  closeButton: {
    width: 50,
    height: 50,
    left: "40%",
    paddingLeft: "0.25%",
    paddingTop: "1.25%",
    borderRadius: 30,
    backgroundColor: "#9BA5B7",
    alignItems: "center",
  },
  textButton: {
    fontSize: 30,
    fontFamily: "HammersmithOne-Regular",
    fontWeight: "bold",
  },
  noteBox: {
    padding: 20,
    width: "60%",
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 20,
  },
  button: {
    height: 70,
    width: "90%",
    top: "15%",
    left: "5%",
    marginBottom: "3%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  textStyle: {
    fontFamily: "HammersmithOne-Regular",
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
      alignItems: "center",
    width:"80%",
    padding: 10,
    margin: 10,
    borderRadius: 15,
  },
});
